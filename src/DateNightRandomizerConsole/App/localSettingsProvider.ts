import { Settings } from './settings';
import * as fs from 'fs';
import { ConfigManager } from './configManager';
import { env } from 'process';
import { promisify } from "util";
import { SettingsProvider } from './settingsProvider';

const readFileAsync = promisify(fs.readFile).bind(fs);
const writeFileAsync = promisify(fs.writeFile).bind(fs);

export class LocalSettingsProvider implements SettingsProvider.SettingsProvider
{
    private static _instance : LocalSettingsProvider;
    private constructor() {

    }

    static getInstance() : LocalSettingsProvider {
        if (!LocalSettingsProvider._instance) {
            LocalSettingsProvider._instance = new LocalSettingsProvider();
        }

        return LocalSettingsProvider._instance;
    }

    async get() : Promise<Settings> {
        const file = await SettingsProvider.getFileName();

        try {
            const data = await readFileAsync(file, 'utf8')
            if (data == '') {
                // TODO may want to avoid possibl double error handling???
                return await this.createDefault();
            }

            const settings = SettingsProvider.parseSettings(data);

            if (!Settings.verify(settings))
            {
                return await this.createDefault();
            }

            return settings;

        } catch (err) {
            if (err.code == 'ENOENT') {
                return await this.createDefault();
            } else {
                throw err;
            }
        }
    }

    async set(settings : Settings) : Promise<void> {
        const file = await SettingsProvider.getFileName();
        const settingString = JSON.stringify(settings);

        return await writeFileAsync(file,  settingString, 'utf8')
    }

    private async createDefault() : Promise<Settings> {
        const settings = Settings.default();
        await this.set(settings);
        return settings;
    }
}
