import * as fs from 'fs';

export class ConfigManager {
    // TODO figure out a better way specify this path
    // maybe an environment variable???  
    // Or is there a way to embed stuff in a node build?
    private static fileName : string = "src/DateNightRandomizerConsole/dist/config.json";
    private static _instance : ConfigManager;

    private _data : ConfigData;
    private _dataPromise : Promise<void>;

    private constructor() {
        this._dataPromise = new Promise<void>((resolve, reject) => {
            fs.readFile(ConfigManager.fileName, 'utf8', (err, data) => {
                if (err)  {
                    console.log("Failed to get Config: " + err);
                    reject(err); 
                    return;
                }

                if (data == '') {
                    this._data = {};
                    resolve();
                    return;
                }

                this._data = JSON.parse(data);

                resolve();  
            });
        });
    }

    static async getInstance() : Promise<ConfigManager> {
        if (!ConfigManager._instance) {
            ConfigManager._instance = new ConfigManager();
        }

        const result = await ConfigManager._instance.whenReady();

        return result ? ConfigManager._instance : null;
    }

    private async whenReady() : Promise<boolean> {
        return this._dataPromise
            .then(() => true, () => false);
    }

    get(index : string) : any {
        return this._data[index];
    }
}

class ConfigData {
    readonly [index : string] : any 
}