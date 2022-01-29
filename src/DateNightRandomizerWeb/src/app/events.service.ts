import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DateNightData } from "../../../DateNightRandomizerConsole/App/dateNightData";



@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private mockEvents : DateNightData[] = [
    {
      eventName : "Test Event",
      eventDescription : "Test Description"
    }
  ];

  private mockPoppedEvents : DateNightData[] = [];

  constructor() { }


  getPoppedEvents() : Observable<DateNightData[]> {
    return of(this.mockPoppedEvents);
  }

  addEvent(newEvent : DateNightData) : Observable<void> {
    this.mockEvents.push(newEvent);
    return of();
  }

  popEvent() : Observable<DateNightData | undefined> {
    const event = this.mockEvents.pop();
    if (event !== undefined) {
      this.mockPoppedEvents.push(event);
    }
    return of(event);
  }

  recyclePoppedEvents() : Observable<void> {
    this.mockEvents.push(...this.mockPoppedEvents);
    this.mockPoppedEvents.splice(0,this.mockPoppedEvents.length);
    return of();
  }

  numberOfEvents() : Observable<number> {
    return of(this.mockEvents.length);
  }

  removePoppedEvent(idx : number) : Observable<void> {
    // TODO may want to keep a global list of all events for historical purposes.
    this.mockPoppedEvents.splice(idx,1);
    return of();
  }

  /* TODO restrict the following to debug mode */
  getEvents() : Observable<DateNightData[]> {
    return of(this.mockEvents);
  }
}
