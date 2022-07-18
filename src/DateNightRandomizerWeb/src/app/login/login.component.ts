import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as  auth from 'firebase/auth';
import { auth as authui } from 'firebaseui';
import { Auth, User, signInWithPopup, signOut, GoogleAuthProvider, authState } from '@angular/fire/auth';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserTrackingService } from '@angular/fire/analytics';
import { traceUntilFirst } from '@angular/fire/performance';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  private readonly userDisposable: Subscription|undefined;
  public readonly user: Observable<User | null> = EMPTY;

  showLoginButton = false;
  showLogoutButton = false;


  constructor(public auth: Auth, private router: Router) { 
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth).pipe(
        traceUntilFirst('auth'),
        map(u => !!u)
      ).subscribe(isLoggedIn => {
        this.showLoginButton = !isLoggedIn;
        this.showLogoutButton = isLoggedIn;
      })
    }
  }

  ngOnDestroy() {
    this.userDisposable?.unsubscribe();
  }

  async login() {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
    this.router.navigate(['/']);
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/']);
  }
}
