import { Injectable, OnDestroy } from '@angular/core';
import { Observable, EMPTY, BehaviorSubject, ReplaySubject, Subscription, of, take } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Database, ref, objectVal, listVal, DatabaseReference, push, set, fromRef, ListenEvent, list} from '@angular/fire/database';
import { Auth, User, authState } from '@angular/fire/auth';
import { traceUntilFirst } from '@angular/fire/performance';
import { isNullOrUndefined } from 'util';
import { remove, update } from 'firebase/database';


const databaseKey = 'databaseKey';

type UserProfileDatabase = {
  databaseKey : string,
  [idx : number] : boolean
};

type UserProfiles = {
  // True means it is the active profile
  [profileName : string] : boolean
}

// TODO may change any to DateNightEvents  but not sure yet
type Profile = {
  name: string,
  events:any[],
  poppedEvents:any[],
  users:UserProfiles,
}

@Injectable({
  providedIn: 'root'
})
export class ProfilesService implements OnDestroy {

  private user : Observable<User | null> = EMPTY;
  private profiles : Observable<string[] | null> = EMPTY;
  private userProfilesSubject : ReplaySubject<UserProfiles | null> = new ReplaySubject<UserProfiles | null>(1);
  private userProfiles : Observable<UserProfiles | null> = EMPTY;
  private userProfiles$: Subscription;
  private currentProfile : Observable<string | null> = EMPTY;

  //private userProfilesRef : DatabaseReference;
  //private userRef : DatabaseReference;

  private databaseRef : DatabaseReference;
  private profilesRef : DatabaseReference;
  private currentProfileRef : DatabaseReference;
  private eventsRef : DatabaseReference;
  private poppedEventsRef : DatabaseReference;

  private  deleteInProgress = false;

  constructor(private database: Database, private auth : Auth) { 
    if (auth) {
      this.user = authState(this.auth);
    }

    //this.userProfiles = this.user.pipe(
    //this.user.pipe(
    this.userProfiles$ = this.user.pipe(
      switchMap((user : User | null) => {
        if (user == null) {
          return [];
        }
        const userProfilesRef = ref(this.database, `/users/${user.uid}/profiles`);
        //return listVal<UserProfileDatabase>(userProfilesRef, { keyField: databaseKey })
        return list(userProfilesRef)
      }),
      map(queries => {
        const retVal : UserProfiles = {};
        queries.forEach(query => {
          const key = query.snapshot.ref.key;
          if (key !== null) {
            retVal[key] = query.snapshot.val();
          }
        })
        this.userProfilesSubject.next(retVal);
        return retVal
      })
      /*
      map((userProfiles : UserProfileDatabase[] | null) => {
        const retVal : UserProfiles = {};
        userProfiles?.forEach(profile => retVal[profile[databaseKey]] = profile[0])
        return retVal;
      })
      */
    )
    .subscribe();

    // TODO where user == ????
    //this.userProfilesRef = ref(this.database, `/user/${this.user.uid}/profiles`);

    this.databaseRef = ref(this.database);
    this.profilesRef = ref(this.database, '/profiles');

    // TODO probably don't need these
    // TODO figure out the the profile name from settings/environment
    var profile = 'First';
    this.currentProfileRef = ref(this.database, `/profiles/${profile}`);
    this.eventsRef = ref(this.database, `/profiles/${profile}/events`);
    this.poppedEventsRef = ref(this.database, `/profiles/${profile}/poppedEvents`);
  }

  ngOnDestroy() {
    this.userProfiles$.unsubscribe();
  }

  getUserProfiles() : Observable<UserProfiles> {
    //return this.userProfiles.pipe(map(x => x === null ? {} : x));
    return this.userProfilesSubject.asObservable().pipe(map(x => x === null ? {} : x));
  }

  addUserProfile(profileName: string) : Observable<void> {
    // TODO check if anything with the same name exists?? Maybe?? Per user???
    // What if a user is added to one with the same name later?
    // Maybe name doesn't need to be unique
    var newProfileKey = push(this.profilesRef).key;

    return this.user.pipe(
      take(1),
      switchMap((user: User | null) => {
        if (user == null) {
          // TODO maybe log an error or throw an error.... not sure how rxjs error handling works
          return of();
        }

        const updates : any = {};
        const newProfile : Profile = {
          name: profileName,
          events: [],
          poppedEvents: [],
          users: {} 
        }
        newProfile.users[`${user.uid}`] = false; // not active
        updates[`/profiles/${newProfileKey}`] = newProfile;
        updates[`/users/${user.uid}/profiles/${newProfileKey}`] = false; // not active

        return update(this.databaseRef, updates);
      })
    );


  }

  /*
  addEvent(newEvent : DateNightData) : Observable<void> {
    //var newEventRef = push(this.eventsRef, newEvent);
    var newEventKey = push(this.eventsRef).key;

    const updates : any = {};
    updates[`/${newEventKey}`] = newEvent;

    return from(update(this.eventsRef, updates)).
    pipe(take(1));
    //return fromRef(newEventRef, ListenEvent.added).pipe(map(x => {}));
  }
  */
}
