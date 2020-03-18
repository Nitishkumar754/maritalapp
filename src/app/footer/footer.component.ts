import { Component, OnInit } from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private _cookieService:CookieService, private router:Router ) { }
  
  ngOnInit() {
  
  	
  }
  route_conditionally(route_to){
  		var token =  this._cookieService.get('token');
  	if(token){
  		 this.router.navigate(['/e/'+route_to]);

  	}
  	else{
  		
  		this.router.navigate([route_to]) 
  	}
  }

}
