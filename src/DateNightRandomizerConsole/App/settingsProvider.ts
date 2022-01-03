import { Settings } from './settings';
import { DateNightData } from './dateNightData';
import * as fs from 'fs';
import { ConfigManager } from './configManager';
import { env } from 'process';
import { Octokit } from '@octokit/core';
import { LocalSettingsProvider } from './localSettingsProvider';
import { RemoteSettingsProvider } from './remoteSettingsProvider';
// TODO we can probably use builtin promise library, 
// I just need to figure out how to include it in the project
//import * as fsPromises from 'fs/promises';
// import { resolve } from 'url';

//eg. env.GIST_TOKEN


export namespace SettingsProvider {
    // TODO need a way to set this later from configuration
    const fileName : string = 'test.json'

    export interface SettingsProvider {
        get() : Promise<Settings>;
        set(settings : Settings) : Promise<void>;
    }

    export async function getSettingsProvider() : Promise<SettingsProvider.SettingsProvider> {
        const configManager = await ConfigManager.getInstance();

        const remoteSettings = configManager.get('remoteSettings');

        if (remoteSettings) {
            return RemoteSettingsProvider.getInstance();
        }

        return LocalSettingsProvider.getInstance();
    }

    // TODO this may come from a separate Serializer/Deserializer class 
    export function parseSettings(data : string) : Settings {
        return JSON.parse(data);
    }

    export async function getFileName() : Promise<string> {
        const configManager : ConfigManager = await ConfigManager.getInstance();
        return configManager.get("settingsFile") || fileName
    }
}
