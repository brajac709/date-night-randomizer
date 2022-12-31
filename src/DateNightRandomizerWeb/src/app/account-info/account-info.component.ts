import { Component, OnDestroy, OnInit, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { Auth, User, signInWithPopup, signOut, GoogleAuthProvider, authState } from '@angular/fire/auth';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { traceUntilFirst } from '@angular/fire/performance';
import { ProfilesService } from '../services/profiles.service.firebase';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit, OnDestroy {

  public readonly user: Observable<User | null> = EMPTY;
  public showMenu : boolean = false;
  public notifications : Observable<boolean> = EMPTY;

  private opening = false;


  constructor(public auth: Auth, private router: Router, private profilesService : ProfilesService) { 
    if (auth) {
      this.user = authState(this.auth);
    }

    this.notifications = profilesService.getProfileInvitations()
      .pipe(map(invitations => invitations.length > 0));
  }

  @HostListener('click')
  onInnerClick() {
    this.opening = true;

  }

  @HostListener('document:click') 
  onOuterClick() {
    if (this.opening)
    {
      this.opening = false

    }
    else {
      this.showMenu = false;
    }
  }


  ngOnInit(): void {
    this.user.pipe(take(1)).subscribe(console.log);
  }

  ngOnDestroy(): void {
  }

  async logout() {
    await signOut(this.auth);
    this.showMenu = false;
    this.router.navigate(['/']);
  }
}
