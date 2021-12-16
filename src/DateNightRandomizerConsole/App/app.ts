import { Randomizer } from './randomizer';
import { DateNightData } from './dateNightData';


console.log('Hello world');

const data = [
    { eventName: "Kura Sushi" },
    { eventName: "Kona Grill" , eventDescription: "Pumpkin Spice"}
];

const rand = new Randomizer<DateNightData>(data);

Array.of(...data, null).forEach(() => console.log(rand.pick()));

