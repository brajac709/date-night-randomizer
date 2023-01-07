import { Component, OnInit } from '@angular/core';
import { EventsService } from './services/events.service';
import { DateNightData } from '../../../DateNightRandomizerConsole/App/dateNightData';
import { environment } from '../environments/environment';
import { SpinnerService } from './services/spinner.service';
import { MenuItem } from './contracts/menu-item';
import { Observable, NEVER, Subscription } from 'rxjs';



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

  events$ : Subscription | null = null;
  eventsObs : Observable<DateNightData[]> = NEVER;

  selected? : string;

  buttons : MenuItem[] = [];
  actionButtons : MenuItem[] = [];

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

    // SETUP Subscripion  (todo may need to unsubscribe)
    this.eventsService.eventsEmitter.subscribe(events => {
      this.events = events;
    })
    
    this.eventsService.poppedEventsEmitter.subscribe(events => {
      this.popped = events;
    })

    // TODO get from settings or something
    this.buttons = [
      {
        label: "Test",  // shows last added event. remove this entry
        value: "test",
        route: "test",
      },
      {
        label: "Add Event",
        value: "addEvent", 
        route: "/event/add",
      },
      {
        label: "Remove Popped Event",
        value: "removePoppedEvent",
        route: "/event/popped/remove"
      }
    ];

    this.actionButtons = [
      {
        label: "Pop Event",
        value: "popEvent", 
        click: this.popEvent.bind(this)
      },
      {
        label: "Recycle Popped Events",
        value: "recyclePoppedEvents", 
        click: this.recyclePoppedEvents.bind(this)
      }
    ]

    if (environment.debugMode) {
      this.buttons.push(...[
        {
          label: "Remove Event",
          value: "removeEvent",
          route: "/event/remove"
        }]);
      this.actionButtons.push(...[
        {
          label: "Reinitialize",
          value: "reinitialize",
          click: this.reinitialize.bind(this)
        }]);
    }
  }

  onMenuSelect(value : MenuItem) {
    this.selected = value.value;
  }

  private popEvent() {
    this.eventsService.popEvent()
      .subscribe(() => {
        this.updateEvents();
      });
  }

  private recyclePoppedEvents() {
    this.eventsService.recyclePoppedEvents()
      .subscribe(() => {
        this.updateEvents();
      });

  }

  private reinitialize() {
    this.eventsService.reinitialize()
      .subscribe(() => {
        this.updateEvents();
      });
  }

  private updateEvents()  {
    this.eventsObs = this.eventsService.getEvents();
    if (this.events$ != null) {
      this.events$?.unsubscribe();
    }
    this.events$ = this.eventsObs.subscribe(events => this.events = events);
    this.eventsService.getPoppedEvents()
      .subscribe(events => this.popped = events);
  }

}
