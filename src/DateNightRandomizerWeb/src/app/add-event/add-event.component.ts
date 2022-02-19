import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DateNightData } from "../../../../DateNightRandomizerConsole/App/dateNightData";
import { EventsService } from '../services/events.service';
import { map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  model : DateNightData = {
    eventName : "Temp Name",
  };

  @Output() submittedEvent = new EventEmitter<boolean>();


  constructor(private eventService : EventsService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.eventService.addEvent({ ...this.model })
      .pipe(mergeMap(()=> {
        // To refresh parent element
        return this.eventService.getEvents();
      }))
      .subscribe((events) => {
        this.submittedEvent.emit(true);
      });
    console.log("Submitted");
  }

}
