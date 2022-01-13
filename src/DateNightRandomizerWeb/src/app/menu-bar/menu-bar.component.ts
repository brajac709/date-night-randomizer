import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {

  @Input() buttons : string[] = [];
  @Output() selected = new EventEmitter<string>()

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(selected : string) {
    this.selected.emit(selected);
  }

}
