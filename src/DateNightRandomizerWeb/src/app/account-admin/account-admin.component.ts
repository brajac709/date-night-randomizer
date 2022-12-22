import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UserProfile } from 'firebase/auth';
import { ProfilesService, UserProfileData } from '../services/profiles.service.firebase';
import {Observable, Subscription} from 'rxjs';
import {map, take} from 'rxjs/operators';

type UserProfileView = UserProfileData & {
  id : string
}

function compareUserProfileViews(v1 : UserProfileView, v2 : UserProfileView) : number {
  if (v1.selected != v2.selected)
  {
    return v1.selected ? -1 : 1;
  }

  if (v1.name == v2.name)
  {
    return 0;
  }

  return (v1.name || v1.id) < (v2.name || v2.id) ? -1 : 1;
}



@Component({
  selector: 'app-account-admin',
  templateUrl: './account-admin.component.html',
  styleUrls: ['./account-admin.component.scss']
})
export class AccountAdminComponent implements OnInit, OnDestroy {

  profiles : Observable<UserProfileView[]>;
  profileNames : Observable<string[]>;
  currentProfileName : Observable<string>;

  public profileName : string = "";

  constructor(private profilesService : ProfilesService) { 
    this.profiles = this.profilesService.getUserProfiles().pipe(map(profiles => {
      const keys = Object.keys(profiles);
      return keys.map(k => {
        return {
          id: k,
          ...profiles[k]
        };
      }).sort(compareUserProfileViews);
    }));

    // TODO these can probably be removed now
    this.profileNames = this.profilesService.getUserProfiles().pipe(map(x => Object.keys(x)))
    // TODO make this a subject so we don't make multiple calls
    this.currentProfileName = this.profilesService.getUserProfiles().pipe(map(profiles => {
      const keys = Object.keys(profiles);
      const trueProfileIds = keys.filter(key => profiles[key]);
      if (trueProfileIds.length == 0) {
        return 'N/A';
      }
      if (trueProfileIds.length == 1) {
        const key = trueProfileIds[0];
        return profiles[key].name || key;
      }
      return `ERROR: there were ${trueProfileIds.length} selected profiles`
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
    if (!this.profileName)
    {
      return;
    }
    this.profilesService.addUserProfile(this.profileName)
      .pipe(take(1))
      .subscribe(_ => console.log("Profile Added"));
  }
}
