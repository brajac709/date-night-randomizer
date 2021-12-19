import { Randomizer } from './randomizer';
import { DateNightData } from './dateNightData';
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

const testSettingsProvider = () => {
    console.log('--- Begin testSettingsProvider() ---');
    const provider = new SettingsProvider();

    provider.get()
        .then((settings) => {
            console.log(settings);
            settings.events.push({
                eventName : 'Kona Grill',
                eventDescription: 'Pumpkin Spice',
            })
            return provider.set(settings);
         })
         .then(() => provider.get().then((settings) => console.log(settings)))
         .then(() => console.log('--- End testSettingsProvider() ---'));
}

/******************************/

console.log('Hello world');

testRandomizer();

testSettingsProvider();


