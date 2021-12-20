import * as fs from 'fs';

export class ConfigManager {
    private static _instance : ConfigManager;
    private static fileName : string = "./config.json";

    private _data : ConfigData;
    private _dataPromise : Promise<void>;

    private constructor() {
        this._dataPromise = new Promise<void>((resolve, reject) => {
            fs.readFile(ConfigManager.fileName, 'utf8', (err, data) => {
                if (err)  {
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

    getInstance() : ConfigManager {
        if (!ConfigManager._instance) {
            ConfigManager._instance = new ConfigManager();
        }

        return ConfigManager._instance;
    }

    get(index : string) : any {
        return this._data[index];
    }
}

export class ConfigData {
    readonly [index : string] : any 
}