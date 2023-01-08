import { Directive, TemplateRef, ViewContainerRef, OnInit, AfterContentInit, EmbeddedViewRef, ElementRef, Input } from '@angular/core';
import { style, animate, AnimationBuilder, AnimationPlayer } from '@angular/animations';

@Directive({
  selector: '[appReorderList]'
})
export class ReorderListDirective implements OnInit, AfterContentInit {
  private prevPos : any;
  private item?: EmbeddedViewRef<any>;

  @Input('timing') timing: string = ".3s ease-in-out";

  constructor(
    /*
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    */
    private elementRef: ElementRef,
    private builder: AnimationBuilder
  ) { }

  ngOnInit(): void {
    //this.item = this.viewContainer.createEmbeddedView(this.templateRef);
    //this.prevPos = this.item?.rootNodes[0].getBoundingClientRect();
    this.prevPos = this.elementRef.nativeElement.getBoundingClientRect();
  }

  ngAfterContentInit(): void {
  }

  triggerAnimation() {
    //const newPos = this.item?.rootNodes[0].getBoundingClientRect();
    const newPos = this.elementRef.nativeElement.getBoundingClientRect();
    // TODO these are not being calculated correctly... need to figure out why...
    const dx = this.prevPos.left - newPos.left;
    const dy = this.prevPos.top - newPos.top;
    this.prevPos = newPos;
    const myAnimation = this.builder.build([
      style({transform: `translate(${dx}px, ${dy}px)`}),
      animate(this.timing, style({transform: `translate(0px, 0px)`}))
    ]);
    //myAnimation.create(this.item?.rootNodes[0]).play();
    myAnimation.create(this.elementRef.nativeElement).play();
  }


}
