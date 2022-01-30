import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { DateNightData } from "../../../DateNightRandomizerConsole/App/dateNightData";
import { environment } from '../environments/environment';



/*
const apiUrl = new URL(environment.apiUrl);
const eventUrl = new URL('/event', apiUrl).toString();
const recycleUrl = new URL('/events/recycle', apiUrl).toString();
const eventsUrl = new URL('/events', apiUrl).toString();
const poppedUrl = new URL('/events/popped', apiUrl).toString();
const countUrl = new URL('/events/count', apiUrl).toString();
const initializeUrl = new URL('/initiaize', apiUrl).toString();
const addId = (id : number, base? : string | URL) => {
  if (!Number.isInteger(id)) throw "id must be an integer";
  return new URL(id.toString(), base).toString();
}
*/
const apiUrl = '/api';
const eventUrl = `${apiUrl}/event`;
const recycleUrl = `${apiUrl}/events/recycle`;
const eventsUrl = `${apiUrl}/events`;
const poppedUrl = `${apiUrl}/events/popped`;
const countUrl = `${apiUrl}/events/count`;
const initializeUrl = `${apiUrl}/initialize`;
const addId = (id : number, base? : string | URL) => {
  if (!Number.isInteger(id)) throw "id must be an integer";
  return `${base}/${id}`;
}

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

  constructor(private http: HttpClient) { }


  getPoppedEvents() : Observable<DateNightData[]> {
    return this.http.get<DateNightData[]>(poppedUrl);
  }

  addEvent(newEvent : DateNightData) : Observable<void> {
    return this.http.post<void>(eventUrl, newEvent);
  }

  popEvent() : Observable<DateNightData | undefined> {
    return this.http.get<DateNightData | undefined>(eventUrl);
  }

  recyclePoppedEvents() : Observable<void> {
    return this.http.post<void>(recycleUrl, {});
  }

  numberOfEvents() : Observable<number> {
    return this.http.get<number>(countUrl);
  }

  removePoppedEvent(idx : number) : Observable<void> {
    // TODO may want to keep a global list of all events for historical purposes.
    const url = addId(idx, poppedUrl);
    return this.http.delete<void>(url);
  }

  /* TODO restrict the following to debug mode */
  getEvents() : Observable<DateNightData[]> {
    return this.http.get<DateNightData[]>(eventsUrl, {
      withCredentials: true
    });
  }
}
