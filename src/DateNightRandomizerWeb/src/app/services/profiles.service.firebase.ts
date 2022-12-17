import { Injectable, OnDestroy } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class ProfilesService implements OnDestroy {

  private user : Observable<User | null> = EMPTY;
  private profiles : Observable<string[] | null> = EMPTY;
  private userProfiles : Observable<UserProfiles | null> = EMPTY;
  private currentProfile : Observable<string | null> = EMPTY;

  //private userProfilesRef : DatabaseReference;
  //private userRef : DatabaseReference;

  private currentProfileRef : DatabaseReference;
  private eventsRef : DatabaseReference;
  private poppedEventsRef : DatabaseReference;

  private  deleteInProgress = false;

  constructor(private database: Database, private auth : Auth) { 
    if (auth) {
      this.user = authState(this.auth);
    }

    this.userProfiles = this.user.pipe(
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
        return retVal
      })
      /*
      map((userProfiles : UserProfileDatabase[] | null) => {
        const retVal : UserProfiles = {};
        userProfiles?.forEach(profile => retVal[profile[databaseKey]] = profile[0])
        return retVal;
      })
      */
    );

    // TODO where user == ????
    //this.userProfilesRef = ref(this.database, `/user/${this.user.uid}/profiles`);



    // TODO figure out the the profile name from settings/environment
    var profile = 'First';
    this.currentProfileRef = ref(this.database, `/profiles/${profile}`);
    this.eventsRef = ref(this.database, `/profiles/${profile}/events`);
    this.poppedEventsRef = ref(this.database, `/profiles/${profile}/poppedEvents`);
  }

  ngOnDestroy() {

  }

  getUserProfiles() : Observable<UserProfiles> {
    return this.userProfiles.pipe(map(x => x === null ? {} : x));
  }
}
