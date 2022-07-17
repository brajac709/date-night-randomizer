import { isNullOrUndefined } from 'util';
import { DateNightData } from './dateNightData';

export class Settings {
    events : DateNightData[] = [];
    // TODO may use another class with additional metadata 
    // eg. Date Popped, Event Ratings, ????
    poppedEvents : DateNightData[] = [];


    static default() : Settings {
        return { 
            events: [],
            poppedEvents: [],
        };
    }

    static verify(data : any) : boolean {
        const props = ["events", "poppedEvents"];
        const initialValue : boolean = true;

        return props.reduce<boolean>((acc,  val, _, arr) => acc && !(data[val] === null || data[val] === undefined), initialValue);
    }
}