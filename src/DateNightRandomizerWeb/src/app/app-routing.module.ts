import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes : Routes  = [

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
