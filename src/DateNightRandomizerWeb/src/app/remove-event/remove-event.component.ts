import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DateNightData } from "../../../../DateNightRandomizerConsole/App/dateNightData";

@Component({
  selector: 'app-remove-event',
  templateUrl: './remove-event.component.html',
  styleUrls: ['./remove-event.component.scss']
})
export class RemoveEventComponent implements OnInit {

  @Input() events : DateNightData[] = [];
  @Output() remove = new EventEmitter<number>();
  
  constructor() { }

  ngOnInit(): void {
  }

  onRemove(idx : number) : void  {
    this.remove.emit(idx);
  }


}
