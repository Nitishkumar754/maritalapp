import { Component, OnInit } from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import { Router } from '@angular/router';
import  {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private router:Router, private _cookieService:CookieService, private route:ActivatedRoute) { 
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
      if(/shared\/profile/gi.test(this.router.url)){
          this.router.navigate(['e/'+this.router.url]);
      }else{
        this.router.navigate(['member']);
      }
    
   } 
  }

  ngOnInit() {
    
  }

  
}
