import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UserProfile } from 'firebase/auth';
import { ProfilesService } from '../services/profiles.service.firebase';
import {Observable, Subscription} from 'rxjs';
import {map, take} from 'rxjs/operators';


@Component({
  selector: 'app-account-admin',
  templateUrl: './account-admin.component.html',
  styleUrls: ['./account-admin.component.scss']
})
export class AccountAdminComponent implements OnInit, OnDestroy {

  profileNames : Observable<string[]>;
  currentProfileName : Observable<string>;

  public profileName : string = "";

  constructor(private profilesService : ProfilesService) { 
    this.profileNames = this.profilesService.getUserProfiles().pipe(map(x => Object.keys(x)))
    // TODO make this a subject so we don't make multiple calls
    this.currentProfileName = this.profilesService.getUserProfiles().pipe(map(x => {
      const keys = Object.keys(x);
      const trueProfiles = keys.filter(key => x[key]);
      if (trueProfiles.length == 0) {
        return 'N/A';
      }
      if (trueProfiles.length == 1) {
        return trueProfiles[0];
      }
      return `ERROR: there were ${trueProfiles.length} selected profiles`
    }))
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
  }

  public onAddProfile(): void {
    // TODO show a new box for Name
    // or just have the box always up?
    // or use a dialog? <-- Probably this eventually but for now will probably do always up
    window.alert(this.profileName);
  }
}
