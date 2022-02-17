import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEventComponent } from './add-event/add-event.component';
import { EventViewComponent } from './event-view/event-view.component';
import { RemoveEventComponent } from './remove-event/remove-event.component';
import { EventResolverService } from './services/event-resolver.service';

const appRoutes : Routes  = [
  {
     path: 'test',
     component: EventViewComponent,
     resolve : { events : EventResolverService }
  },
  // TODO make child paths
  { path: 'event/add', component: AddEventComponent },
  { 
    path: 'event/popped/remove', 
    component: RemoveEventComponent, 
    resolve : { events : EventResolverService },
  },
  { 
    path: 'event/remove',
    component: RemoveEventComponent,
    resolve: { events: EventResolverService },
  },
  { path: "**", redirectTo: ''  },
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
