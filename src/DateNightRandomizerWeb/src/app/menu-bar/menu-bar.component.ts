import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {

  @Input() buttons : string[] = [];
  @Output() selected = new EventEmitter<string>()

  selectedButton : string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(selected : string) {
    this.selectedButton = selected;
    this.selected.emit(selected);
  }

}
