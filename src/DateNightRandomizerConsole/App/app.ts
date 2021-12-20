import { Randomizer } from './randomizer';
import { DateNightData } from './dateNightData';
//import { SettingsProvider } from './settingsProvider';
import { SettingsProvider } from './settingsProvider';
import { ConfigManager } from './configManager';

const testRandomizer = () => {
    console.log('--- Begin testRandomizer() ---');
    const data = [
        { eventName: "Kura Sushi" },
        { eventName: "Kona Grill" , eventDescription: "Pumpkin Spice"}
    ];

    const rand = new Randomizer<DateNightData>(data);

    Array.of(...data, null).forEach(() => console.log(rand.pick()));
    console.log('--- End testRandomizer() ---');
}

const testSettingsProvider = async () => {
    console.log('--- Begin testSettingsProvider() ---');
    const provider = SettingsProvider;

    const settings = await provider.get();
    console.log(settings);
    settings.events.push({
        eventName : 'Kona Grill',
        eventDescription: 'Pumpkin Spice',
    });
    await provider.set(settings);

    const newSettings = await provider.get();
    console.log(newSettings);

    console.log('--- End testSettingsProvider() ---');
}

const testConfigManager = async () => {
    console.log('--- Begin testConfigManager() ---');

    const configManager = await ConfigManager.getInstance();

    if (configManager == null)
    {
        console.log("Unable to retrieve configuration");
    }
    else 
    {
        console.log(configManager.get("settingsFile"));
    }

    console.log('--- End testConfigManager() ---');
}

/******************************/

const main = async() => {
    console.log('Hello world');

    testRandomizer();

    await testSettingsProvider();

    await testConfigManager();
}

main();



