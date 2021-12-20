import { Randomizer } from './randomizer';
import { DateNightData } from './dateNightData';
//import { SettingsProvider } from './settingsProvider';
import { SettingsProvider } from './settingsProvider';

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

/******************************/

console.log('Hello world');

testRandomizer();

testSettingsProvider();


