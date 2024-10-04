import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Database } from '@angular/fire/database';

import { ProfilesService } from './profiles.service.firebase';

import { Observable, EMPTY, BehaviorSubject, ReplaySubject, Subscription, of, take, forkJoin, throwError } from 'rxjs';
import { switchMap, map, mergeMap, catchError } from 'rxjs/operators';
import * as AngularFireDatabase from '@angular/fire/database';
import * as AngularFireAuth from '@angular/fire/auth';
import { traceUntilFirst } from '@angular/fire/performance';
import { remove, update } from 'firebase/database';
import { collection } from 'firebase/firestore';
import { Auth as FirebaseAuth } from 'firebase/auth'

describe('ProfilesService', () => {
  let service: ProfilesService;
  let databaseSpy: jasmine.SpyObj<Database>;
  let authSpy: jasmine.SpyObj<Auth>;


  beforeEach(() => {
    TestBed.configureTestingModule({providers: [
      ProfilesService,
      { provide: Database, useValue: jasmine.createSpyObj('Database', ['app', 'type']) },
      { provide: Auth, useValue: jasmine.createSpyObj('Auth', ['app', 'name']) }
    ]});
    const authStateSpy = spyOn(AngularFireAuth, "authState");

    authStateSpy.and.returnValue(of({
      uid : "1234",
    } as AngularFireAuth.User))
    service = TestBed.inject(ProfilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
