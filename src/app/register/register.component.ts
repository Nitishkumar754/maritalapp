import { Component, OnInit, ViewChild } from '@angular/core';


import { AuthserviceService } from '../services/authservice.service'
import {NgForm} from '@angular/forms';


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

  @ViewChild('f') signupForm:NgForm

  user = {'email':''};
  showLoader = false;
  registerForm=true;
  registerMessage=''
  otpError=false;
  successTick = false;
  input_otp = '';
  user_id = '';
  otpMessage='';
  selectedDate = '';
  genders = ['male', 'female'];
  request_body = {};
  show_verification_msg = false;
  errorMessage = '';
  constructor(private auth: AuthserviceService) { 

  	// this.logger.debug('Your log message goes here');
  }


  ngOnInit() {
    
  }

  userRegister(form:NgForm){

    console.log("form>>>>>>>>>>>>>>> ",this.signupForm.form.value);
  	
    this.request_body['email'] = this.signupForm.form.value.userData.email;
    this.request_body['mobile_number'] = this.signupForm.form.value.userData.mobile;
    this.request_body['name'] = this.signupForm.value.userData.name;
    this.request_body['dob'] = this.signupForm.value.userData.dob.jsdate;
    this.request_body['gender'] = this.signupForm.value.userData.gender;
    this.request_body['password'] = this.signupForm.value.userData.passwordData.password; 
    this.request_body['password_re'] = this.signupForm.value.userData.passwordData.password_re; 


    console.log("this.request_body>>>>>>>>>>> ",this.request_body);

    this.showLoader = true;
    this.errorMessage = '';

  	this.auth.registerService({user:this.request_body})
  	.subscribe((data:any)=>{

    console.log("data>>>>>>>> ",data);
    if(data && data.status){
    	this.showLoader = false;
    	this.registerForm = false;
      this.show_verification_msg = true;
      this.registerMessage = "We have sent a verification link to your email. Please click on the link to confirm registration"
    	this.user_id = data.user;
    	return;
    }
    
	  },
	  error=>{
	    console.log("error>>>>>>>>>>>>>> ",error);
      this.showLoader = false;
	    this.errorMessage=JSON.stringify(error.error.error);
	    return error;
	  })
  }


  verifyOtp(){
  	this.auth.verifyOtp({otp:this.input_otp, email:this.user.email, user_id:this.user_id})
  	.subscribe((data:any)=>{
  		console.log("data>>>>>>>>>>>>> ",data);
  		if(data.status){
  			this.successTick=true;
  			
  			return;

  		}

  	},error=>{
  		console.log("error>>>>>>>> ",error);
  		this.otpMessage=error.error.error;
  		
  	})
  }

  onDateChanged(event){
    console.log("event>>>>>>>>>>>>>> ",event);
    console.log("selectedDate>>>>>>>>>>>> ",this.selectedDate);
  }



}
