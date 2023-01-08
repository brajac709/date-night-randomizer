import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, of, throwError, Subscription, forkJoin, from, ReplaySubject} from 'rxjs';
import { catchError, retry, map, mergeMap, take, switchMap } from 'rxjs/operators';
import { DateNightData } from "../../../../DateNightRandomizerConsole/App/dateNightData";
import { Settings } from "../../../../DateNightRandomizerConsole/App/settings";
import { environment } from '../../environments/environment';
import { Database, ref, objectVal, listVal, DatabaseReference, push, set, fromRef, ListenEvent, list} from '@angular/fire/database';
import { Auth, User, authState } from '@angular/fire/auth';
import { traceUntilFirst } from '@angular/fire/performance';
import { isNullOrUndefined } from 'util';
import { remove, update } from 'firebase/database';
import { ProfilesService } from './profiles.service.firebase';

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
  private currentProfile$ : Subscription;
  private currentProfileIdSubject = new ReplaySubject<string>(1);
  /*
  private currentProfileRef : DatabaseReference;
  private eventsRef : DatabaseReference;
  private poppedEventsRef : DatabaseReference;
  */

  private  deleteInProgress = false;

  constructor(private database: Database, private auth : Auth, private profilesService: ProfilesService) { 
    if (auth) {
      this.user = authState(this.auth);
    }
    // TODO figure out the the profile name from settings/environment
    this.currentProfile$ = profilesService.getUserProfiles().pipe(
      map(profiles => {
        const keys = Object.keys(profiles);
        const selectedProfileIds = keys.filter(k => profiles[k].selected)

        if (selectedProfileIds.length != 1)
        {
          console.error("Unexpected number of selected profiles", selectedProfileIds.length)
          return;
        }

        this.currentProfileIdSubject.next(selectedProfileIds[0]);

        /*
        this.currentProfileRef = ref(this.database, `/profiles/${currentProfileId}`);
        this.eventsRef = ref(this.database, `/profiles/${currentProfileId}/events`);
        this.poppedEventsRef = ref(this.database, `/profiles/${currentProfileId}/poppedEvents`);
        */
      })
    ).subscribe();

    /*
    var profile = 'First';
    this.currentProfileRef = ref(this.database, `/profiles/${profile}`);
    this.eventsRef = ref(this.database, `/profiles/${profile}/events`);
    this.poppedEventsRef = ref(this.database, `/profiles/${profile}/poppedEvents`);
    */
  }

  ngOnDestroy() {
    this.currentProfile$.unsubscribe();
  }

  currentProfileRef = () => this.currentProfileIdSubject.pipe(map(currentProfileId => ref(this.database, `/profiles/${currentProfileId}`)));
  eventsRef = () => this.currentProfileIdSubject.pipe(map(currentProfileId => ref(this.database, `/profiles/${currentProfileId}/events`)));
  poppedEventsRef = () => this.currentProfileIdSubject.pipe(map(currentProfileId => ref(this.database, `/profiles/${currentProfileId}/poppedEvents`)));

  getPoppedEvents() : Observable<DateNightData[]> {
    return this.poppedEventsRef()
    .pipe(
      switchMap(ref => listVal<DateNightData>(ref)),
      map((x) => {
        const value : DateNightData[] = x == null ? [] : x;
        this.poppedEventsEmitter.emit(value);
        return value;
      }));
  }

  addEvent(newEvent : DateNightData) : Observable<void> {
    //var newEventRef = push(this.eventsRef, newEvent);

    return this.eventsRef().pipe(
      switchMap(ref => {
        var newEventKey = push(ref).key;

        const updates : any = {};
        updates[`/${newEventKey}`] = newEvent;

        return from(update(ref, updates)).
        pipe(take(1));
        //return fromRef(newEventRef, ListenEvent.added).pipe(map(x => {}));
      }));
  }

  popEvent() : Observable<DateNightData | null> {
    return forkJoin({
      events: this.eventsRef().pipe(switchMap(ref => listVal<DateNightDataDatabaseEvent>(ref, { keyField : keyField})), take(1)),
      currentProfileRef: this.currentProfileRef()
    }).pipe(
      map(d => {
      if (d.events == null || d.events.length == 0)
      {
        return {
          update: of(),
          retVal: of(null),
        }
      }

      const idx = Math.floor(Math.random() * d.events.length);
      const retVal = d.events[idx];

      const updates : any = {};
      updates[`/events/${retVal.databaseKey}`] = null;
      // TODO may need to adjust the type so we don't add the "key" field back
      updates[`/poppedEvents/${retVal.databaseKey}`] = retVal;

      return {
        update: update(d.currentProfileRef, updates),
        retVal: of(retVal),
      };
    }),
    mergeMap(q => forkJoin([q.update, q.retVal])),
    map(([_, retVal]) => retVal ),
    );
  }

  recyclePoppedEvents() : Observable<void> {
    return forkJoin({
      poppedEvents: this.poppedEventsRef().pipe(switchMap(ref => listVal<DateNightDataDatabaseEvent>(ref, { keyField : keyField})), take(1)),
      currentProfileRef: this.currentProfileRef()
    }).pipe(
      map(d => {
      const updates : any = {};
      if (!d.poppedEvents) {
        return;
      }

      for (var ii = 0; ii < d.poppedEvents?.length; ii++ ) {
        // TODO may need to adjust the type so we don't add the "key" field back
        var event = d.poppedEvents[ii];
        updates[`/events/${event.databaseKey}`] = event
        updates[`/poppedEvents/${event.databaseKey}`] = null
      }

      return update(d.currentProfileRef, updates);
    }),
    map(_ => {}),
    take(1)
    )
  }

  numberOfEvents() : Observable<number> {
    return this.eventsRef().pipe(
      switchMap(ref => listVal<DateNightData>(ref)),
      map(events => events ? events.length : 0), 
      take(1)
    );
  }

  removePoppedEvent(idx : number) : Observable<void> {
    // TODO may want to keep a global list of all events for historical purposes.

    return this.poppedEventsRef().pipe(
    mergeMap(ref => forkJoin({
      poppedEvents: listVal<DateNightDataDatabaseEvent>(ref, { keyField : keyField}),
      poppedEventsRef: of(ref),
    })),
    map(d => {
      if (d.poppedEvents && d.poppedEvents.length > idx)
      {
        var event = d.poppedEvents[idx];
        const updates : any = {};
        updates[`${event.databaseKey}`] = null;

        return update(d.poppedEventsRef, updates);
      }
      return of();
    }),
    map(_ => {}),
    take(1)
    )
  }

  /* TODO restrict the following to debug mode */
  getEvents() : Observable<DateNightData[]> {
    return this.eventsRef().pipe(
      switchMap(ref => listVal<DateNightData>(ref)),
      map((x) => {
        const value : DateNightData[] = x == null ? [] : x;
        this.eventsEmitter.emit(value);
        return value;
      }));
  }

  reinitialize() : Observable<void> {
    var defaults = Settings.default();

    const updates : any = {};
    const eventUpdates : any = {};
    const poppedEventUpdates : any = {};

    updates['/events'] = eventUpdates;
    updates['/poppedEvents'] = poppedEventUpdates;

    return forkJoin({
      eventsRef: this.eventsRef(),
      poppedEventsRef: this.poppedEventsRef(),
      currentProfileRef: this.currentProfileRef()
    }).pipe(
      switchMap(d => {
        defaults.events.forEach(event => {
          const newKey = push(d.eventsRef).key;
          eventUpdates[`${newKey}`] = event;
        })

        defaults.poppedEvents.forEach(event => {
          const newKey = push(d.poppedEventsRef).key;
          poppedEventUpdates[`${newKey}`] = event;
        })

        // TODO may need to use "defer" instead so it only evaluates on subscribe
        return from(update(d.currentProfileRef, updates))
        .pipe(take(1))
        ;
      })
    );
  }




  removeEvent(idx : number) : Observable<void> {
    // TODO may want to keep a global list of all events for historical purposes.
    if (this.deleteInProgress) {
      alert("Delete already in progress")
      return of();
    }
    this.deleteInProgress = true;

    return this.eventsRef().pipe(
      take(1),
      mergeMap(ref => forkJoin({
        events: listVal<DateNightDataDatabaseEvent>(ref, { keyField : keyField}).pipe(take(1)),
        eventsRef: of(ref),
      })),
      take(1),
      map(d => {
      if (d.events && d.events.length > idx)
      {
        var event = d.events[idx];
        const updates : any = {};
        updates[`${event.databaseKey}`] = null;

        return update(d.eventsRef, updates);
      }
      return of();
    }),
    map((() => { this.deleteInProgress = false }).bind(this)),
    map(_ => {})
    );
  }
}
