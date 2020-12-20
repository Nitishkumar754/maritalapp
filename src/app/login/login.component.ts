import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
// import {CookieService} from 'angular2-cookie/core';
import {CookieService} from 'ngx-cookie';

import { AuthserviceService } from '../services/authservice.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private auth: AuthserviceService, private _cookieService:CookieService) { }
  private payload:any
  cr_user:''
  @Input() email: string;
  @Input() password: string;
  loginStatus:any

  loginMessage:String;

  ngOnInit() {
  }

  localLogin(){
    console.log("email>>>>>>>>>>>>>>>>>>>> ", this.email)
    console.log("password>>>>>>>>>>>>>>>>>>>> ", this.password)
    this.payload = {"username":this.email, "password": this.password}
    this.loginStatus = this.auth.myLocalLoginService(this.payload)
        .subscribe((data:any)=>{
      console.log("data>>>>>>>>>>>>>>>>> ", data)
      if(data && data.status){

        // var Token = data.token
        // localStorage.setItem('MAtoken', JSON.stringify({ token: Token }));
        // var currentUser = JSON.parse(localStorage.getItem('MAtoken'));

        const token: string = this._cookieService.get('token');
        // this._cookieService.put('token', data.token);

       
        // this.cr_user = currentUser;
        
        console.log("redirecting.....")
        this.router.navigate(['member']);
        return;
      }

      this.loginMessage = data.message;
  },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
      this.loginMessage = error.error.message;
      return false
    })


  }

}
