import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as  auth from 'firebase/auth';
import { auth as authui } from 'firebaseui';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('login') loginRef? : ElementRef<HTMLDivElement>;
  public isLoading = true;

  constructor() { }

  ngOnInit(): void {
    //alert(this.loginRef);
  }

  
  ngAfterViewInit() : void {
    if (this.loginRef === undefined) {
      return;
    }

    var ui = new authui.AuthUI(auth.getAuth());

    var uiShownFcn = () => {
      alert("Shown")
      this.isLoading  = false;
    }


    ui.start(this.loginRef.nativeElement, {
      callbacks: {
        signInSuccessWithAuthResult: function(authResult,  redirectUrl)
        {
          return true;
        },
        uiShown: uiShownFcn.bind(this), 
        signInFailure  : function(error) {
          alert(error.message);
        },
      },
      signInOptions : [
        {
          provider: auth.GoogleAuthProvider.PROVIDER_ID
        },
      ]
    })
  }

}
