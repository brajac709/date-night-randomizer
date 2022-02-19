import { Injectable } from '@angular/core';
import { AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { animate, style, keyframes } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  // USE THIS FOR REFERENCE....
  // https://huantao.medium.com/angular-animation-programmatically-using-animation-builder-5eb9b661de84
  // May not go this route, since the spinner should spin whenever it visible.
  // may add in/out transitions later though...

  // private spinnerRef : ElementRef;

  private _show = false;
  private show = new EventEmitter<boolean>();

  constructor(
    /*private animationBuilder : AnimationBuilder*/
    ) { }

  showSpinner(show : boolean | undefined) {
    if (show === undefined) {
      this._show = !this._show;
    } else {
      this._show = show;
    }
    this.show.emit(this._show);
  }

  subscribe(next? : (value : boolean) => void, error? : (error : any) => void, complete? : () => void) : Subscription {
    return this.show.subscribe(next, error, complete);
  }
}



