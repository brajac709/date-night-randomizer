import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-bar',
  templateUrl: './button-bar.component.html',
  styleUrls: ['./button-bar.component.scss']
})
export class ButtonBarComponent implements OnInit {

  @Input() buttons : any[] = [];
  @Output() event = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onClick(button : any) {
    this.event.emit(button);
  }

}
