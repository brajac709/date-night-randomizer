import { Component, OnInit } from '@angular/core';
import { animate, style, keyframes, useAnimation, trigger, state } from '@angular/animations';


const heartThrobAnimation = [
  animate("1.2s", keyframes([
    style({ transform: "scale(0.95)", offset: 0}),
    style({ transform: "scale(1.1)", offset: 0.05}),
    style({ transform: "scale(0.85)", offset: 0.39}),
    style({ transform: "scale(1)", offset: 0.45}),
    style({ transform: "scale(0.95)", offset: 0.6}),
    style({ transform: "scale(0.9)", offset: 1.0}),
  ])),
];

@Component({
  selector: 'app-heart-loader',
  templateUrl: './heart-loader.component.html',
  styleUrls: ['./heart-loader.component.scss'],
  /*
  animations: [
    heartThrobAnimation,
  ]
  */
})
export class HeartLoaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

