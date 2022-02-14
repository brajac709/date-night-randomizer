import { Component, OnInit } from '@angular/core';
import { EventsService } from './events.service';
import { DateNightData } from '../../../DateNightRandomizerConsole/App/dateNightData';
import { environment } from '../environments/environment';
import { SpinnerService } from './spinner.service';



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
  actionButtons : string[] = [];

  showSpinner = false;

  constructor(
    private eventsService : EventsService,
    private spinnerService : SpinnerService
    ) { };

  ngOnInit() {
    this.spinnerService.subscribe((show) => {
      this.showSpinner = show
    });

    this.spinnerService.showSpinner(this.showSpinner);



    this.updateEvents();

    // TODO get from settings or something
    // TODO figure out how to assign templates to this as well.
    this.buttons = [
      "test",  // shows last added event. remove this entry
      "addEvent", 
      "removePoppedEvent",
    ];

    this.actionButtons = [
      "popEvent", 
      "recyclePoppedEvents", 
    ]

    // TODO add debug mode options for removing events and whatnot
    if (environment.debugMode) {
      this.buttons.push(...["removeEvent"]);
      this.actionButtons.push(...["reinitialize"]);
    }
  }

  onAdd(success : boolean) {
    this.updateEvents();
  }


  onMenuSelect(value : string) {
    this.selected = value;
  }

  onAction(value : string) {
    // Add some basic function handling for now
    switch(value) {
      case 'popEvent':
        //alert("popping");
        this.eventsService.popEvent()
          .subscribe(() => {
            this.updateEvents();
          });
        break;
      case 'recyclePoppedEvents':
        //alert("recycling");
        this.eventsService.recyclePoppedEvents()
          .subscribe(() => {
            this.updateEvents();
          });
        break;
      case 'reinitialize':
        //alert('re-initializing');
        this.eventsService.reinitialize()
          .subscribe(() => {
            this.updateEvents();
          });
        break;
    }
  }

  onRemovePopped(idx: number) {
    alert("removing pop");
    this.eventsService.removePoppedEvent(idx)
      .subscribe(() => {
        this.updateEvents();
      });
  }

  onRemoveEvent(idx:  number) {
    this.eventsService.removeEvent(idx)
      .subscribe(() => {
        this.updateEvents();
      });
  }

  private updateEvents()  {
    this.eventsService.getEvents()
      .subscribe(events => this.events = events);
    this.eventsService.getPoppedEvents()
      .subscribe(events => this.popped = events);
  }

}
