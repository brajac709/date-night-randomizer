import { Component, OnInit } from '@angular/core';
import { EventsService } from './events.service';
import { DateNightData } from '../../../DateNightRandomizerConsole/App/dateNightData';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DateNightRandomizerWeb';

  // TODO lock this type down later
  events : any[] = [];
  popped : any[] = [];

  constructor(private eventsService : EventsService) {};

  ngOnInit() {
    this.eventsService.getEvents()
      .subscribe(events => this.events = events);
    this.eventsService.getPoppedEvents()
      .subscribe(events => this.popped = events);
  }

  onAdd(success : boolean) {
    this.eventsService.getEvents()
      .subscribe(events => this.events = events);
    this.eventsService.getPoppedEvents()
      .subscribe(events => this.popped = events);
  }
}
