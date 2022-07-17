import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, of, throwError, Subscription, forkJoin, from } from 'rxjs';
import { catchError, retry, map, mergeMap, take } from 'rxjs/operators';
import { DateNightData } from "../../../../DateNightRandomizerConsole/App/dateNightData";
import { Settings } from "../../../../DateNightRandomizerConsole/App/settings";
import { environment } from '../../environments/environment';
import { Database, ref, objectVal, listVal, DatabaseReference, push, set, fromRef, ListenEvent, list} from '@angular/fire/database';
import { Auth, User, authState } from '@angular/fire/auth';
import { traceUntilFirst } from '@angular/fire/performance';
import { isNullOrUndefined } from 'util';
import { remove, update } from 'firebase/database';

const keyField = "databaseKey";
interface DateNightDataDatabaseEvent extends DateNightData {
  databaseKey : string;
}



@Injectable({
  providedIn: 'root'
})
export class EventsService implements OnDestroy {

  eventsEmitter = new EventEmitter<DateNightData[]>();  
  poppedEventsEmitter = new EventEmitter<DateNightData[]>();  

  private user : Observable<User | null> = EMPTY;
  private currentProfileRef : DatabaseReference;
  private eventsRef : DatabaseReference;
  private poppedEventsRef : DatabaseReference;

  private  deleteInProgress = false;

  constructor(private database: Database, private auth : Auth) { 
    if (auth) {
      this.user = authState(this.auth);
    }
    // TODO figure out the the profile name from settings/environment
    var profile = 'First';
    this.currentProfileRef = ref(database, `/profiles/${profile}`);
    this.eventsRef = ref(database, `/profiles/${profile}/events`);
    this.poppedEventsRef = ref(database, `/profiles/${profile}/poppedEvents`);
  }

  ngOnDestroy() {

  }

  getPoppedEvents() : Observable<DateNightData[]> {
    return listVal<DateNightData>(this.poppedEventsRef)
    .pipe(map((x) => {
        const value : DateNightData[] = x == null ? [] : x;
        this.poppedEventsEmitter.emit(value);
        return value;
      }),
      take(1));
  }

  addEvent(newEvent : DateNightData) : Observable<void> {
    //var newEventRef = push(this.eventsRef, newEvent);
    var newEventKey = push(this.eventsRef).key;

    const updates : any = {};
    updates[`/${newEventKey}`] = newEvent;

    return from(update(this.eventsRef, updates)).
    pipe(take(1));
    //return fromRef(newEventRef, ListenEvent.added).pipe(map(x => {}));
  }

  popEvent() : Observable<DateNightData | null> {
    return listVal<DateNightDataDatabaseEvent>(this.eventsRef, { keyField : keyField})
    .pipe(take(1),
      map(events => {
      if (events == null || events.length == 0)
      {
        return {
          update: of(),
          retVal: of(null),
        }
      }

      const idx = Math.floor(Math.random() * events.length);
      const retVal = events[idx];

      const updates : any = {};
      updates[`/events/${retVal.databaseKey}`] = null;
      // TODO may need to adjust the type so we don't add the "key" field back
      updates[`/poppedEvents/${retVal.databaseKey}`] = retVal;

      return {
        update: update(this.currentProfileRef, updates),
        retVal: of(retVal),
      };
    }),
    mergeMap(q => forkJoin([q.update, q.retVal])),
    map(([_, retVal]) => retVal ),
    );
  }

  recyclePoppedEvents() : Observable<void> {
    return listVal<DateNightDataDatabaseEvent>(this.poppedEventsRef, { keyField : keyField})
    .pipe(map(poppedEvents => {
      const updates : any = {};
      if (!poppedEvents) {
        return;
      }

      for (var ii = 0; ii < poppedEvents?.length; ii++ ) {
        // TODO may need to adjust the type so we don't add the "key" field back
        var event = poppedEvents[ii];
        updates[`/events/${event.databaseKey}`] = event
        updates[`/poppedEvents/${event.databaseKey}`] = null
      }

      return update(this.currentProfileRef, updates);
    }),
    map(_ => {}),
    take(1)
    )
  }

  numberOfEvents() : Observable<number> {
    return listVal<DateNightData>(this.eventsRef)
    .pipe(map(events => events ? events.length : 0), take(1));
  }

  removePoppedEvent(idx : number) : Observable<void> {
    // TODO may want to keep a global list of all events for historical purposes.

    return listVal<DateNightDataDatabaseEvent>(this.poppedEventsRef, { keyField : keyField})
    .pipe(map(poppedEvents => {
      if (poppedEvents && poppedEvents.length > idx)
      {
        var event = poppedEvents[idx];
        const updates : any = {};
        updates[`${event.databaseKey}`] = null;

        return update(this.poppedEventsRef, updates);
      }
      return of();
    }),
    map(_ => {}),
    take(1)
    )
  }

  /* TODO restrict the following to debug mode */
  getEvents() : Observable<DateNightData[]> {
    return listVal<DateNightData>(this.eventsRef)
    .pipe(map((x) => {
        const value : DateNightData[] = x == null ? [] : x;
        this.eventsEmitter.emit(value);
        return value;
      }),
      take(1)
      );
  }

  reinitialize() : Observable<void> {
    var defaults = Settings.default();

    const updates : any = {};
    const eventUpdates : any = {};
    const poppedEventUpdates : any = {};

    updates['/events'] = eventUpdates;
    updates['/poppedEvents'] = poppedEventUpdates;

    defaults.events.forEach(event => {
      const newKey = push(this.eventsRef).key;
      eventUpdates[`${newKey}`] = event;
    })

    defaults.poppedEvents.forEach(event => {
      const newKey = push(this.poppedEventsRef).key;
      poppedEventUpdates[`${newKey}`] = event;
    })

    // TODO may need to use "defer" instead so it only evaluates on subscribe
    return from(update(this.currentProfileRef, updates))
    .pipe(take(1))
    ;
  }




  removeEvent(idx : number) : Observable<void> {
    // TODO may want to keep a global list of all events for historical purposes.
    if (this.deleteInProgress) {
      alert("Delete already in progress")
      return of();
    }
    this.deleteInProgress = true;

    return listVal<DateNightDataDatabaseEvent>(this.eventsRef, { keyField : keyField})
    .pipe(
      take(1),
      map(events => {
      if (events && events.length > idx)
      {
        var event = events[idx];
        const updates : any = {};
        updates[`${event.databaseKey}`] = null;

        return update(this.eventsRef, updates);
      }
      return of();
    }),
    map((() => { this.deleteInProgress = false }).bind(this)),
    map(_ => {})
    );
  }
}
