import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AddEventComponent } from './add-event/add-event.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { EventViewComponent } from './event-view/event-view.component';
import { RemoveEventComponent } from './remove-event/remove-event.component';

@NgModule({
  declarations: [
    AppComponent,
    AddEventComponent,
    MenuBarComponent,
    EventViewComponent,
    RemoveEventComponent,
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
