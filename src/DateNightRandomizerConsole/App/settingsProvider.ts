import { Settings } from './settings';
import { DateNightData } from './dateNightData';
import * as fs from 'fs';
import { ConfigManager } from './configManager';
// TODO we can probably use builtin promise library, 
// I just need to figure out how to include it in the project
//import * as fsPromises from 'fs/promises';
// import { resolve } from 'url';


export namespace SettingsProvider {
    // TODO need a way to set this later from configuration
    const fileName : string = 'test.json'

    export async function get() : Promise<Settings> {
        const file = await getFileName();

        var promise = new Promise<Settings>((resolve, reject) => {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err)  {
                    if(err.code == 'ENOENT')
                    {
                        const settings = Settings.default();
                        set(settings).then(() => resolve(settings), (reason) => reject(reason))
                    }
                    else {
                        reject(err); // TODO throw err????
                    }
                    return;
                }

                if (data == '') {
                    const settings = Settings.default();
                    set(settings).then(() => resolve(settings), (reason) => reject(reason))

                    return;
                }

                const settings = parseSettings(data);
                resolve(settings);  
            });
        });

        return promise;
    }

    export async function set(settings : Settings) : Promise<void> {
        const file = await getFileName();
        const promise = new Promise<void>((resolve, reject) => {
            const settingString = JSON.stringify(settings);
            fs.writeFile(file, settingString, 'utf8', (err) => {
                if (err)  {
                    reject(err);
                }

                resolve();
            });
        });
        return promise;
    }

    // TODO this may come from a separate Serializer/Deserializer class 
    function parseSettings(data : string) : Settings {
        return JSON.parse(data);
    }

    async function getFileName() : Promise<string> {
        const configManager : ConfigManager = await ConfigManager.getInstance();
        return configManager.get("settingsFile") || fileName
    }
}
