import { Component, OnInit, Input } from '@angular/core';
import { DateNightData } from '../../../../DateNightRandomizerConsole/App/dateNightData';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss']
})
export class EventViewComponent implements OnInit {

  @Input() event? : DateNightData;

  fieldMapping : FieldMapping[] = [
    {label: 'Name', fcn: (event : DateNightData) => event.eventName },
    {label: 'Description', fcn: (event : DateNightData) => event.eventDescription },
  ];


  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.event === undefined) {
      this.route.data.subscribe(data  => {
        if (data['events']) {
          var events = data['events'];
          if (events.length > 0) {
            this.event = events[events.length-1];
          }
        }
      });
    }
  }

}

interface FieldMapping {
  label:  string;
  fcn: (event : DateNightData) => any
}
