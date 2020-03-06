import {Directive, ElementRef, OnInit} from '@angular/core';


@Directive({
	selector:'[appRegisterSuccess]'
})

export class SuccessDirective implements OnInit {
	
	constructor(private elementRef: ElementRef) {
		// code...
	}
	ngOnInit(){
		this.elementRef.nativeElement.style.background = 'transparent';
	}


}