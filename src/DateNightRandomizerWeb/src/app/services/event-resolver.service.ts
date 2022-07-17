import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Resolve } from '@angular/router';
import { EventsService } from './events.service';
import { DateNightData } from "../../../../DateNightRandomizerConsole/App/dateNightData";
import { of, Observable, EMPTY, map,  mergeMap, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventResolverService implements Resolve<DateNightData[]>  {

  constructor(private eventService : EventsService, private router : Router) { }

  resolve (route : ActivatedRouteSnapshot, state : RouterStateSnapshot) 
    : Observable<DateNightData[]> | Observable<never> 
  {
    // not sure if I want separate resolvers 
    // or just to switch based on route...
    const op = switchMap((events : DateNightData[]) => events ? of(events) : of([]));
    // TODo eventually could use parent if I set that up...
    // but for now just use url
    const url = route.url;
    const previousSegment = url.length > 1 ? url[url.length-2].path : '';
    switch (previousSegment) {
      case 'popped':
        return this.eventService.getPoppedEvents().pipe(op);
      case 'event':
        return this.eventService.getEvents().pipe(op);
      default:
        if (url[url.length-1].path == 'test') {
          return this.eventService.getEvents().pipe(op);
        }
        return  of([])
    }
  }
}
