import { DateNightData } from './dateNightData';

export class Settings {
    events : DateNightData[];
    // TODO may use another class with additional metadata 
    // eg. Date Popped, Event Ratings, ????
    poppedEvents : DateNightData[];
}