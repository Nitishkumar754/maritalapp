import { Directive, Renderer2, OnInit, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appRegisterFailure]'
})
export class RegisterFailureDirective implements OnInit {

  constructor(private eleRef:ElementRef, private renderer: Renderer2) { }

  @Input() highlightColor:string = 'transparent';
  @Input() defaultColor:string = 'transparent';
  @HostBinding ('style.background-color') backgroundColor : string = this.highlightColor;
  ngOnInit(){
  	// this.renderer.setStyle(this.eleRef.nativeElement, 'background-color','red');

  }

}
