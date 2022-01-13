import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AddEventComponent } from './add-event/add-event.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { EventViewComponent } from './event-view/event-view.component';

@NgModule({
  declarations: [
    AppComponent,
    AddEventComponent,
    MenuBarComponent,
    EventViewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
