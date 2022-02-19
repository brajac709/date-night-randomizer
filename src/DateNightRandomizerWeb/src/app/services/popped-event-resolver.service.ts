import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Resolve } from '@angular/router';
import { EventsService } from './events.service';
import { DateNightData } from "../../../../DateNightRandomizerConsole/App/dateNightData";
import { of, Observable, EMPTY, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PoppedEventResolverService implements Resolve<DateNightData[]>  {

  constructor(private eventService : EventsService, private router : Router) { }

  resolve (route : ActivatedRouteSnapshot, state : RouterStateSnapshot) 
  : Observable<DateNightData[]> | Observable<never> {
    this.eventService.getPoppedEvents().pipe(
      map(events => {
        return events ? of(events) : of([]);
      })

    );

    return of([])
  }
}
