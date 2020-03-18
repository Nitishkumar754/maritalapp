import { Component, OnInit } from '@angular/core';
import  { AuthserviceService } from '../services/authservice.service'
import {environment}  from '../../environments/environment';
import {CookieService} from 'angular2-cookie/core';
import { Router } from '@angular/router';




@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  profileImage = ''
  serverUrl = environment.serverUrl

  constructor(private auth:AuthserviceService, private _cookieService:CookieService, private router:Router) { 

   var token =  this._cookieService.get('token');
   if(!token){
     this.router.navigate(['login']);
   } 

   // alert(this.router.url)
  }

  getCookie(key: string){
    return this._cookieService.get(key);
    }

  ngOnInit() {
  	console.log(this.auth._name)
  	console.log(this.auth._email)
  	console.log(this.auth._photoUrl)

  	this.profileImage = this.auth._photoUrl
  	

  }

onActivate(event) {
        let scrollToTop = window.setInterval(() => {
            let pos = window.pageYOffset;
            if (pos > 0) {
                window.scrollTo(0, pos - 20); // how far to scroll on each step
            } else {
                window.clearInterval(scrollToTop);
            }
        }, 16);
    }


}
