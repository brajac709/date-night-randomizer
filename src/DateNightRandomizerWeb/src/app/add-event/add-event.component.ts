import { Component, OnInit } from '@angular/core';
import { DateNightData } from "../../../../DateNightRandomizerConsole/App/dateNightData";

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  model : DateNightData = {
    eventName : "Temp Name",
  };


  constructor() { }

  ngOnInit(): void {
  }

}
