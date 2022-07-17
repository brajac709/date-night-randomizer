import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEventComponent } from './add-event/add-event.component';
import { EventViewComponent } from './event-view/event-view.component';
import { RemoveEventComponent } from './remove-event/remove-event.component';
import { EventResolverService } from './services/event-resolver.service';
import { LoginComponent } from './login/login.component';
//import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/compat/auth-guard';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToIndex = () => redirectLoggedInTo(['']);

const appRoutes : Routes  = [
  {
     path: 'test',
     component: EventViewComponent,
     resolve : { events : EventResolverService },
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path:  'login',
    component: LoginComponent,
    //canActivate: [AngularFireAuthGuard]
    ...canActivate(redirectLoggedInToIndex)
  },
  // TODO make child paths
  { path: 'event/add', component: AddEventComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { 
    path: 'event/popped/remove', 
    component: RemoveEventComponent, 
    resolve : { events : EventResolverService },
    ...canActivate(redirectUnauthorizedToLogin)
  },
  { 
    path: 'event/remove',
    component: RemoveEventComponent,
    resolve: { events: EventResolverService },
    ...canActivate(redirectUnauthorizedToLogin)
  },
  { path: "**", redirectTo: '', ...canActivate(redirectUnauthorizedToLogin) },
];

// TODO
// Can add a resolver for parent (to get event count for jar)
// Then pull the necessary data for children with other resolvers

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
