import { Component, OnInit } from '@angular/core';

import { Person } from '../interfaces/interface';

import { AuthserviceService } from '../services/authservice.service'

// import { NGXLogger } from 'ngx-logger';
export interface User {
  name: string;
  section: string;
  phoneNumber: string;
}

let userDetails: User[] = [];


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user = {'email':''};
  showOtp = false;
  registerForm=true;
  registerMessage=''
  otpError=false;
  successTick = false;
  input_otp = '';
  user_id = '';
  otpMessage='';
  constructor(private auth: AuthserviceService) { 

  	// this.logger.debug('Your log message goes here');
  }


  ngOnInit() {
  }

  userRegister(){
  	console.log("person2>>>>>>>>>>>>>>> ",this.user);
  	this.auth.registerService({user:this.user})
  	.subscribe((data:any)=>{

    console.log("data>>>>>>>> ",data);
    if(data && data.status){
    	this.showOtp = true;
    	this.registerForm = false;
    	this.user_id = data.user;
    	return;
    }
    
	  },
	  error=>{
	    console.log("error>>>>>>>>>>>>>> ",error);
	    this.registerMessage=JSON.stringify(error.error.error);
	    return error;
	  })
  }

  verifyOtp(){
  	this.auth.verifyOtp({otp:this.input_otp, email:this.user.email, user_id:this.user_id})
  	.subscribe((data:any)=>{
  		console.log("data>>>>>>>>>>>>> ",data);
  		if(data.status){
  			this.successTick=true;
  			this.showOtp=false
  			return;

  		}

  	},error=>{
  		console.log("error>>>>>>>> ",error);
  		this.otpMessage=error.error.error;
  		this.otpError = true;
  	})
  }

}
