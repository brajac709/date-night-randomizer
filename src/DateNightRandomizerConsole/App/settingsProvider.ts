import { Settings } from './settings';
import * as fs from 'fs';
import { resolve } from 'url';

export class SettingsProvider {
    async get() : Promise<Settings> {
        // TODO retrieve settings
        var promise = new Promise<Settings>((resolve, reject) => {
            fs.readFile('test.json', 'utf8',(err,data) => {
                if (err) reject(); // TODO throw err????

                const settings = this.parseSettings(data);
                resolve(settings);  // I think??? 
            });
        });
        return promise;
    }

    // TODO this may come from a separate Serializer/Deserializer class 
    private parseSettings(data : string) : Settings {
        return null;
    }


}