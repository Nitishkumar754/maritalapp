import { Component, OnInit } from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private router:Router, private _cookieService:CookieService) { 
  	var token =  this._cookieService.get('token');
  	if(token){
  	  // if(this.router.url=='/about'){
  	  // 	this.router.navigate(['about']);
  	  // 	return;	
  	  // }
  	  // if(this.router.url=='/contact'){
  	  // 	this.router.navigate(['contact']);
  	  // 	return;	
  	  // }
     this.router.navigate(['member']);
   } 
  }


  ngOnInit() {
  }

  
}
