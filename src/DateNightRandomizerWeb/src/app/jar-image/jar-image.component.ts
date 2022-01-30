import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-jar-image',
  templateUrl: './jar-image.component.html',
  styleUrls: ['./jar-image.component.scss']
})
export class JarImageComponent implements OnInit, OnChanges {

  @Input() count : number = 0;

  positions : ContentsPosition[] = []

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["count"] !== undefined) {
      this.generatePositions();
    }
  }

  private generatePositions() {
    const count = this.count;
    const radius = 10;
    const newPositions : ContentsPosition[] = [];
    for (var i = 0; i < count; ++i)
    {
      newPositions.push({
        x: radius*(i + .5)*2.1,
        y: radius,
        radius: radius,
      });
    }
    this.positions = newPositions;
  }
}

interface ContentsPosition {
  x : number;
  y : number;
  radius : number;
}