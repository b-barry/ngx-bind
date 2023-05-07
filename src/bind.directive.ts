import {DOCUMENT} from '@angular/common';
import {Directive, ElementRef, Inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {getEventType, isOn} from "./utils";
import {listen, setProp, unlisten} from "./petite-vue";


@Directive({
  selector: '[ngxBind]',
  standalone: true,
  host: {},
  providers: [],
})
export class BindDirective implements OnChanges {

  @Input()
  input: Record<string, any> = {}; // TODO typing for event listener and attributes property

  constructor(
    @Inject(DOCUMENT) private readonly doc: Document,
    @Inject(ElementRef) private readonly el: ElementRef<HTMLElement>,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const value = changes['input'].currentValue;
    const prevValue = changes['input'].previousValue;
    const el = this.el.nativeElement
    for (const key in value) {
      // we are going to bind an event
      if (isOn(key)) {
        listen(el, getEventType(key), value[key])
      } else {
        setProp(el, key, value[key], prevValue && prevValue[key])
      }
    }
    for (const key in prevValue) {
      if (!value || !(key in value)) {
        setProp(el, key, null)
      }
      // we always unlisten event to avoid leak or double execution
      if (isOn(key) && prevValue[key]) {
        unlisten(el, getEventType(key), prevValue[key])
      }
    }
  }


}
