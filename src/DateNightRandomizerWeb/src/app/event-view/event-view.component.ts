import { Component, OnInit, Input } from '@angular/core';
import { DateNightData } from '../../../../DateNightRandomizerConsole/App/dateNightData';

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


  constructor() { }

  ngOnInit(): void {
  }

}

interface FieldMapping {
  label:  string;
  fcn: (event : DateNightData) => any
}
