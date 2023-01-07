import { Directive, TemplateRef, ViewContainerRef, OnInit, AfterContentInit, EmbeddedViewRef } from '@angular/core';
import { style, animate, AnimationBuilder, AnimationPlayer } from '@angular/animations';

@Directive({
  selector: '[appReorderList]'
})
export class ReorderListDirective implements OnInit, AfterContentInit {
  private prevPos : any;
  private item?: EmbeddedViewRef<any>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private builder: AnimationBuilder
  ) { }

  ngOnInit(): void {
    this.item = this.viewContainer.createEmbeddedView(this.templateRef);
    this.prevPos = this.item?.rootNodes[0].getBoundingClientRect();
  }

  ngAfterContentInit(): void {
  }

  triggerAnimation() {
    const newPos = this.item?.rootNodes[0].getBoundingClientRect();
    const dx = this.prevPos.left - newPos.left;
    const dy = this.prevPos.top - newPos.top;
    const myAnimation = this.builder.build([
      style({transform: `translate(${dx}px, ${dy}px)`}),
      animate("1s", style({transform: `translate(0px, 0px)`}))
    ]);
    myAnimation.create(this.item?.rootNodes[0]).play();
  }


}
