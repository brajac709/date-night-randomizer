import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from '../contracts/menu-item';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {

  @Input() buttons : MenuItem[] = [];
  @Output() selected = new EventEmitter<MenuItem>()

  selectedButton : MenuItem | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(selected : MenuItem) {
    this.selectedButton = selected;
    this.selected.emit(selected);
    selected.click && selected.click(selected);
  }

}
