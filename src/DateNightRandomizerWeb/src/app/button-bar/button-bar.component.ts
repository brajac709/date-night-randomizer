import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from '../contracts/menu-item';

@Component({
  selector: 'app-button-bar',
  templateUrl: './button-bar.component.html',
  styleUrls: ['./button-bar.component.scss']
})
export class ButtonBarComponent implements OnInit {

  @Input() buttons : MenuItem[] = [];
  @Output() event = new EventEmitter<MenuItem>();

  constructor() { }

  ngOnInit(): void {
  }

  onClick(button : MenuItem) {
    button.click && button.click(button);
    this.event.emit(button);
  }

}
