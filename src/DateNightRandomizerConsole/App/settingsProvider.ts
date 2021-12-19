import { Settings } from './settings';
import { DateNightData } from './dateNightData';
import * as fs from 'fs';
// TODO we can probably use builtin promise library, 
// I just need to figure out how to include it in the project
//import * as fsPromises from 'fs/promises';
// import { resolve } from 'url';

export class SettingsProvider {
    fileName : string = 'test.json'

    async get() : Promise<Settings> {
        var promise = new Promise<Settings>((resolve, reject) => {
            fs.readFile(this.fileName, 'utf8', (err, data) => {
                if (err)  {
                    if(err.code == 'ENOENT')
                    {
                        const settings = this.createDefaultSettings();
                        this.set(settings).then(() => resolve(settings), (reason) => reject(reason))
                    }
                    else {
                        reject(err); // TODO throw err????
                    }
                }

                const settings = this.parseSettings(data);
                resolve(settings);  // I think??? 
            });
        });

        return promise;
    }

    async set(settings : Settings) : Promise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            const settingString = JSON.stringify(settings);
            fs.writeFile(this.fileName, settingString, 'utf8', (err) => {
                if (err)  {
                    reject(err);
                }

                resolve();
            });
        });
        return promise;
    }

    // TODO maybe this should exist statically in settings.ts???
    createDefaultSettings() : Settings {
        return { 
            events: []
        };
    }

    // TODO this may come from a separate Serializer/Deserializer class 
    private parseSettings(data : string) : Settings {
        return JSON.parse(data);
    }
}