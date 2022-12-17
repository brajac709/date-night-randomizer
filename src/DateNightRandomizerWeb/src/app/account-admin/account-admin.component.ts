import { Component, OnInit } from '@angular/core';
import { UserProfile } from 'firebase/auth';
import { ProfilesService } from '../services/profiles.service.firebase';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';


@Component({
  selector: 'app-account-admin',
  templateUrl: './account-admin.component.html',
  styleUrls: ['./account-admin.component.scss']
})
export class AccountAdminComponent implements OnInit {

  profileNames : Observable<string[]>;
  currentProfileName : Observable<string>;

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
}
