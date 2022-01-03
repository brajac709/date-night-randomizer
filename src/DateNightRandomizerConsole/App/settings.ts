import { isNullOrUndefined } from 'util';
import { DateNightData } from './dateNightData';

export class Settings {
    events : DateNightData[];
    // TODO may use another class with additional metadata 
    // eg. Date Popped, Event Ratings, ????
    poppedEvents : DateNightData[];


    static default() : Settings {
        return { 
            events: [],
            poppedEvents: [],
        };
    }

    static verify(data : any) : boolean {
        const props = ["events", "poppedEvents"];

        return props.reduce((acc,  val) => acc && !isNullOrUndefined(data[val]), true);
    }
}