import { Settings } from "./settings";
import { SettingsProvider } from "./settingsProvider";

export class RandomizerApp {
    private static _instance : RandomizerApp

    private _settings : Settings;
    private _settingsPromise : Promise<void>;

    private constructor() {
        this._settingsPromise = new Promise<void>((resolve, reject) => {
            SettingsProvider.get().then((settings) => {
                this._settings = settings;
                resolve();
            }, (err) => {
                this._settings = null;
                resolve();
            });
        });
    };

    static async getInstance() : Promise<RandomizerApp> {
        if (!RandomizerApp._instance) {
            RandomizerApp._instance = new RandomizerApp();
        }

        await RandomizerApp._instance._settingsPromise;

        return RandomizerApp._instance;
    }
    
    // TODO some of these should probably be part of an interface so we can have several implementations
    addEvent() {};

    popEvent() {};

    recyclePoppedEvents() {}
}