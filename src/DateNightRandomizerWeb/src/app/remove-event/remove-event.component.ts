import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute }  from  '@angular/router';
import { DateNightData } from "../../../../DateNightRandomizerConsole/App/dateNightData";
import { EventsService }  from '../services/events.service';
import { take, map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-remove-event',
  templateUrl: './remove-event.component.html',
  styleUrls: ['./remove-event.component.scss']
})
export class RemoveEventComponent implements OnInit {

  @Input() events : DateNightData[] = [];
  @Output() remove = new EventEmitter<number>();
  
  constructor(private  route : ActivatedRoute, private  eventsService : EventsService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data  => {
      if (data['events']) {
        this.events = data['events'];
      }
    });
  }

  onRemove(idx : number) : void  {
    const url = this.route.snapshot.url;
    const previousSegment = url.length > 1 ?  url[url.length-2].path : '';
    switch (previousSegment)  {
      case 'popped':
        this.eventsService.removePoppedEvent(idx)
          .pipe(mergeMap(() => this.eventsService.getPoppedEvents()))
          .subscribe((events) => {
            this.events = events;
          });
        break;
      case 'event':
        this.eventsService.removeEvent(idx)
          .pipe(
            take(1),
            mergeMap(() => this.eventsService.getEvents()))
          .subscribe((events) => {
            this.events = events;
          });
        break;
      default:
        break;
    }

    this.remove.emit(idx);
  }


}
