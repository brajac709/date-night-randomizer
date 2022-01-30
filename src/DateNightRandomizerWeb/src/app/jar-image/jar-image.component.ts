import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';



@Component({
  selector: 'app-jar-image',
  templateUrl: './jar-image.component.html',
  styleUrls: ['./jar-image.component.scss']
})
export class JarImageComponent implements OnInit, OnChanges {

  @Input() count : number = 0;

  positions : ContentsPosition[] = []
  height = 100;
  width = 100;
  radius = 10;
  private _maxAccross = Math.trunc(this.width/this.radius/2);
  private _maxDown = Math.trunc(this.height/this.radius/2);

  

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
    const newPositions : ContentsPosition[] = [];
    for (var i = 0; i < count; ++i)
    {
      newPositions.push({
        x: this.radius*((i % this._maxAccross) + .5)*2,
        y: this.height - this.radius*(Math.trunc(i/this._maxAccross)+.5)*2,
        radius: this.radius,
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