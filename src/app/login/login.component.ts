import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthserviceService } from '../services/authservice.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private auth: AuthserviceService) { }
  private payload:any
  @Input() username: string;
  @Input() password: string;
  loginStatus:any

  loginMessage:String;

  ngOnInit() {
  }

  localLogin(){
    console.log("username>>>>>>>>>>>>>>>>>>>> ", this.username)
    console.log("password>>>>>>>>>>>>>>>>>>>> ", this.password)
    this.payload = {"username":this.username, "password": this.password}
    this.loginStatus = this.auth.myLocalLoginService(this.payload)
        .subscribe((data:any)=>{
      console.log("data>>>>>>>>>>>>>>>>> ", data)
      if(data && data.status){

        var Token = data.token
        localStorage.setItem('MAtoken', JSON.stringify({ token: Token }));
        var currentUser = JSON.parse(localStorage.getItem('MAtoken'));
        console.log("reidirecting.....")
        this.router.navigate(['member']);
        return;
      }

      this.loginMessage = data.message;
  },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
      return false
    })


    // console.log("this.loginstatus>>>>>>>>>>>>>> ",this.loginStatus)
    // if (this.loginStatus==true){
    // 	 console.log("reidirecting.....")
    //     this.router.navigate(['member']);
    // }
    // else{
    // 	this.router.navigate(['landing']);
    // }
    
  }

}
