import { Injectable, OnDestroy } from '@angular/core';
import { Observable, EMPTY, BehaviorSubject, ReplaySubject, Subscription, of, take, forkJoin } from 'rxjs';
import { switchMap, map, mergeMap, catchError } from 'rxjs/operators';
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

type ProfileUsers = {
  [userId : string] : boolean
}

export type UserProfiles = {
  // True means it is the active profile
  [profileId : string] : UserProfileData
}

export type UserProfileData = {
  selected : boolean,
  name: string
}

// TODO may change any to DateNightEvents  but not sure yet
type Profile = {
  name: string,
  events:any[],
  poppedEvents:any[],
  users:ProfileUsers,
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
        const nameObservables : {[profileId : string] : Observable<string> } = {};
        queries.forEach(query => {
          const key = query.snapshot.ref.key;
          if (key !== null) {
            retVal[key] = {
              selected: query.snapshot.val(),
              // TODO may want to use an intermediate type instead of temporary empty...
              name: ""
            };
            
            const profileNameRef = ref(this.database, `/profiles/${key}/name`);
            nameObservables[key] = objectVal<string>(profileNameRef).pipe(take(1),catchError(error => { console.log(error); return ""}));
          }
        })
        // TODO not sure this is the right way to retun this...
        return {
          profiles: of(retVal),
          names: nameObservables,
          //names: forkJoin(nameObservables)
        }

        /*
        this.userProfilesSubject.next(retVal);
        return retVal
        */
      }),
      // TODO these aren't working....
      // try adding some catch handlers maybe???  
      mergeMap(d => {
        const names = forkJoin(d.names);
        return of({
          profiles: d.profiles,
          names: names
        });
      }),
      mergeMap(d => forkJoin([d.profiles, d.names])),
      map(([profiles, names]) => {
        const keys = Object.keys(profiles);

        keys.forEach(key => {
          profiles[key].name = names[key];
        });

        this.userProfilesSubject.next(profiles);
        return profiles
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

  selectUserProfile(profileId: string) : Observable<void> {
    return this.user.pipe(
      take(1),
      mergeMap(user => forkJoin([of(user), this.userProfilesSubject.asObservable()])),
      switchMap(([user, profiles] : [User | null, UserProfiles | null]) => {
        if (user == null || profiles == null) {
          // TODO maybe log an error or throw an error.... not sure how rxjs error handling works
          return of();
        }

        const keys = Object.keys(profiles);
        const updates : any = {};
        // Clear all selected profiles for this user
        keys.filter(k => profiles[k].selected).forEach(k => {
            updates[`/profiles/${k}/users/${user.uid}`] = false;
            updates[`/users/${user.uid}/profiles/${k}`] = false;
          }
        )
        updates[`/profiles/${profileId}/users/${user.uid}`] = true;
        updates[`/users/${user.uid}/profiles/${profileId}`] = true; 

        return update(this.databaseRef, updates);
      })
    );
  }

}
