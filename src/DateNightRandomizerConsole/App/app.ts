import { Randomizer } from './randomizer';


console.log('Hello world');

const rand = new Randomizer<number>([1,2,3,4,5]);
console.log(rand.pick());

