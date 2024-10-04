import { Injectable } from '@angular/core';
import { Observable, EMPTY, BehaviorSubject, ReplaySubject, Subscription, of, take, forkJoin, throwError } from 'rxjs';
import { switchMap, map, mergeMap, catchError } from 'rxjs/operators';
import { Database, ref, objectVal, listVal, DatabaseReference, push, set, fromRef, ListenEvent, list, Query} from '@angular/fire/database';
import { Auth, User, authState } from '@angular/fire/auth';
import { traceUntilFirst } from '@angular/fire/performance';
import { remove, update } from 'firebase/database';
import { collection } from 'firebase/firestore';
import { Auth as FirebaseAuth } from 'firebase/auth'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private database: Database, private auth : Auth) { }

  ref(path? : string | undefined) {
    return ref(this.database, path);
  }

  authState() {
    return authState(this.auth);
  }

  objectVal<T>(query: Query, options?: {
      keyField?: string;
  }): Observable<T> {
    return objectVal<T>(query, options);
  }

  listVal<T>(query: Query, options?: {
      keyField?: string;
  }): Observable<T[] | null> {
    return listVal(query, options);
  }

  push(parent: DatabaseReference, value?: unknown) {
    return push(parent, value);
  }

  list(query: Query, options?: { events?: ListenEvent[] | undefined; } | undefined) {
    return list(query, options)
  }

  update(ref: DatabaseReference, values : Object) {
    return update(ref, values);
  }
}
