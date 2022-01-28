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

  selected? : string;

  buttons : string[] = [];

  constructor(private eventsService : EventsService) { };

  ngOnInit() {
    this.updateEvents();

    // TODO get from settings or something
    // TODO figure out how to assign templates to this as well.
    this.buttons = [
      "test",  // shows last added event. remove this entry
      "addEvent", 
      "popEvent", 
      "recyclePoppedEvents", 
      "removePoppedEvent"
    ];
    // TODO add debug mode options for removing events and whatnot

  }

  onAdd(success : boolean) {
    this.updateEvents();
  }


  onMenuSelect(value : string) {
    this.selected = value;

    // Add some basic function handling for now
    switch(value) {
      case 'popEvent':
        alert("popping");
        this.eventsService.popEvent()
          .subscribe();
        this.updateEvents();
        break;
      case 'recyclePoppedEvents':
        alert("recycling");
        this.eventsService.recyclePoppedEvents()
          .subscribe();
        this.updateEvents();
        break;
    }
  }

  onRemovePopped(idx: number) {
    alert("removing pop");
    this.eventsService.removePoppedEvent(idx)
      .subscribe();
    this.updateEvents();
  }

  private updateEvents()  {
    this.eventsService.getEvents()
      .subscribe(events => this.events = events);
    this.eventsService.getPoppedEvents()
      .subscribe(events => this.popped = events);
  }

}
