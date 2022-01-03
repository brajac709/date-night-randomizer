import { Settings } from './settings';
import { ConfigManager } from './configManager';
import { env } from 'process';
import { Octokit } from '@octokit/core';
import { SettingsProvider } from './settingsProvider';

export class RemoteSettingsProvider implements SettingsProvider.SettingsProvider
{
    private static _instance : RemoteSettingsProvider;
    private constructor() {

    }

    static getInstance() : RemoteSettingsProvider {
        if (!RemoteSettingsProvider._instance) {
            RemoteSettingsProvider._instance = new RemoteSettingsProvider();
        }

        return RemoteSettingsProvider._instance;
    }

    async get() : Promise<Settings> {
        const configManager : ConfigManager = await ConfigManager.getInstance();

        // TODO may want to make this an instance variable
        // not sure the overhead or if different auth may be needed
        const octokit = new Octokit({ auth: env.GIST_TOKEN });

        const gistId = configManager.get("gistId");
        const settingsFile = await SettingsProvider.getFileName();

        const { data } = await octokit.request('GET /gists/{gist_id}',
            {
                gist_id : gistId,
            });

        // TODO Error handling - create default if file doesn't exist
        // Probably don't want to create the gist though, 
        // expect it is already created
        const file = data.files[settingsFile];

        if (file.truncated)
        {
            // TODO handle it if too large.
            throw new Error("Gist file was too large")
        }
        else 
        {
            const settings = SettingsProvider.parseSettings(file.content);
            
            if (!Settings.verify(settings)) {
                return await this.createDefault();
            }
            return settings;
        }
    }

    async set(settings : Settings) : Promise<void> {
        const configManager : ConfigManager = await ConfigManager.getInstance();

        // TODO may want to make this an instance variable
        // not sure the overhead or if different auth may be needed
        const octokit = new Octokit({ auth: env.GIST_TOKEN });

        const gistId = configManager.get("gistId");
        const settingsFile = await SettingsProvider.getFileName();

        const files = {};
        files[settingsFile] = {
            content: JSON.stringify(settings),
        };

        const { data } = await octokit.request('PATCH /gists/{gist_id}',
            {
                gist_id : gistId,
                files : files,
            });

        // TODO error handling
    }

    private async createDefault() : Promise<Settings> {
        const settings = Settings.default();
        await this.set(settings);
        return settings;
    }
}
