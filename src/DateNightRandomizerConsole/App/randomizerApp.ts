import { isNullOrUndefined } from "util";
import { DateNightData } from "./dateNightData";
import { Settings } from "./settings";
import { SettingsProvider } from "./settingsProvider";

export class RandomizerApp {
    private static _instance : RandomizerApp

    private _settings : Settings;
    private _settingsProvider : SettingsProvider.SettingsProvider;
    private _settingsPromise : Promise<void>;

    private constructor() {
        this._settingsPromise = this.initialize()
    };

    private async initialize() {
        this._settingsProvider = await SettingsProvider.getSettingsProvider();

        this._settings = await this._settingsProvider.get();
    }

    static async getInstance() : Promise<RandomizerApp> {
        if (!RandomizerApp._instance) {
            RandomizerApp._instance = new RandomizerApp();
        }

        await RandomizerApp._instance._settingsPromise;

        return RandomizerApp._instance;
    }

    // TODO may want to add a version that doesn't writeback yet? 
    // May want to implement periodic writeback to allow more syncronous operation
    
    async addEvent(event : DateNightData) {

        // TODO add duplicate checking???
        this._settings.events.push(event);

        return this._settingsProvider.set(this._settings);
    };

    async popEvent() {
        const events = this._settings.events; 
        if (isNullOrUndefined(events) || events.length == 0)
        {
            return null;
        }

        const idx = Math.floor(Math.random() * events.length);
        const retVal = events[idx];
        events.splice(idx, 1);

        this._settings.events = events;
        // TODO may want to transform data type
        this._settings.poppedEvents.push(retVal);

        await this._settingsProvider.set(this._settings);

        return retVal;
    };

    async recyclePoppedEvents() {
        this._settings.events.push(...this._settings.poppedEvents);
        this._settings.poppedEvents.splice(0,this._settings.poppedEvents.length);
        // TODO add duplicate checking???

        return await this._settingsProvider.set(this._settings);
    }

    numberOfEvents() {
        return this._settings.events.length;
    }

    getPoppedEvents() : ReadonlyArray<DateNightData> {
        return this._settings.poppedEvents;
    }

    async reinitializeSettings() {
        this._settings = Settings.default();
        return await this._settingsProvider.set(this._settings);
    }
}