import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';



@Component({
  selector: 'app-jar-image',
  templateUrl: './jar-image.component.html',
  styleUrls: ['./jar-image.component.scss']
})
export class JarImageComponent implements OnInit, OnChanges {

  @Input() count : number = 0;

  positions : ContentsPosition[] = []

  useHeart = true;



  height = 200;
  width = 300;
  radius = 10;
  private _maxAcross = this.useHeart 
    ? 3
    : Math.trunc(this.width/this.radius/2);
  private _maxDown = this.useHeart
    ? 6
    : Math.trunc(this.height/this.radius/2);

  

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
    if (this.useHeart) {
      this._maxAcross = 1;
    }
    for (var i = 0; i < count; ++i)
    {
      const pos = !this.useHeart 
        ? this.generateRectPos(i) 
        : this.generateHeartPos(i)


      newPositions.push(pos);
    }
    this.positions = newPositions;
  }

  heightClass() {
    return `h-\[${this.height}px\]`
  }

  private generateRectPos(idx : number) {
    return {
      x: this.radius*((idx % this._maxAcross) + .5)*2,
      y: this.height - this.radius*(Math.trunc(idx/this._maxAcross)+.5)*2,
      radius: this.radius,
    }
  }

  private generateHeartPos(idx : number) {
    // TODO this needs a lot of work, but it kind of does the job for now
    // 1 , 3-3-3, 5-5-5-5-5
    // 0   1 2 3  4 5 6 7 8

    // TODO max we can fit with this method is 5 rows
    // And up to 34 events (2 less than max for 5 rows).
    // Could do some extra stuff to fill in the top of heart
    // or jut cap it at 34
    const maxidx = 23;
    const row = idx >= maxidx ? 0 : Math.floor(Math.sqrt(idx));
    const rowwidth = 2*(row+1) -1;
    const rowstart = row*row;
    const rowidx = idx >= maxidx ? 0 : idx - rowstart;
    const xoffset = Math.ceil(rowidx/2)*(rowidx % 2 > 0 ? -1 : 1);
    return  {
        x: this.radius*(xoffset)*2,
        // current max is 5 or 6 high
        y: 40*3-this.radius*1.4-this.radius*(row)*2,
        radius: this.radius,
    }
  }
}

interface ContentsPosition {
  x : number;
  y : number;
  radius : number;
}