import { Component, OnInit } from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private _cookieService:CookieService, private router:Router) { }

  ngOnInit() {
  	this.logout();
  }

  logout(){
  	 this._cookieService.remove('token');
  	 this.router.navigate(['login']);
  }
 
}
