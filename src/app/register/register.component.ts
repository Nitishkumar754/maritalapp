import { Component, OnInit, ViewChild } from '@angular/core';


import { AuthserviceService } from '../services/authservice.service'
import {NgForm} from '@angular/forms';
import {MapperService} from '../services/mapperservice.service';


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
  password_msg = '';
  indian_state = [];
  districts = [];
  verify_email_btn = false;
  dob_message = '';
  invalid_dob = false;
  constructor(private auth: AuthserviceService, private mapperservice:MapperService) { 

  	// this.logger.debug('Your log message goes here');
  }


  ngOnInit() {
    this.indian_state = this.mapperservice.state;
    this.districts = this.mapperservice.state_district['states']['3']['districts'];
    console.log("this.district>>>>>>>>> ",this.districts);
  }

  
  userRegister(form:NgForm){

    console.log("form>>>>>>>>>>>>>>> ",this.signupForm);
  	
    this.request_body['email'] = this.signupForm.form.value.userData.email;
    this.request_body['mobile_number'] = this.signupForm.form.value.userData.mobile;
    this.request_body['name'] = this.signupForm.value.userData.name;
    this.request_body['dob'] = this.signupForm.value.userData.dob.jsdate;
    this.request_body['gender'] = this.signupForm.value.userData.gender;
    this.request_body['password'] = this.signupForm.value.userData.passwordData.password; 
    this.request_body['password_re'] = this.signupForm.value.userData.passwordData.password_re; 
    this.request_body['state'] = this.signupForm.value.userData.addressData.state; 
    this.request_body['district'] = this.signupForm.value.userData.addressData.district; 
    this.request_body['addressline'] = this.signupForm.value.userData.addressData.addressline; 


    console.log("this.request_body>>>>>>>>>>> ",this.request_body);

    
    this.errorMessage = '';
    if(this.invalid_dob){
      this.errorMessage = 'Date of birth is not valid';
      return;
    }
    this.showLoader = true;
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
      if(error.error.email_verification===false){
        this.verify_email_btn = true;
      }
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
    
    var current_date = new Date();
    var dob = event.jsdate;
    var cutoff_date = new Date(current_date.setFullYear(current_date.getFullYear()-18));
    
     if(dob > cutoff_date){
       this.dob_message = "age should be geater than 18";
       this.invalid_dob=true;
     }
     else{
       this.dob_message = '';
       this.invalid_dob = false;
     }
    console.log("selectedDate>>>>>>>>>>>> ",this.selectedDate);

  }

  comparePassword(){
    var password_re = this.signupForm.value.userData.passwordData.password_re;
    var password = this.signupForm.value.userData.passwordData.password;
    if(password.localeCompare(password_re)==0){
      this.password_msg = '';
      return;
    }
    
    else{
      this.password_msg = "Password not matching with above"
    }
    // if(this.signupForm.value.userData.passwordData.password)
  }

selected_state_name(key){
 
  var mystate_code = this.signupForm.value.userData.addressData.state;

  var state_district = this.mapperservice.state_district;
  for (let [key, value] of Object.entries(state_district['states'])) {
  if(value['state_code']==mystate_code){

      this.districts = value['districts']
        console.log("districts>>>>>>>> ",this.districts);

  }
}

}


}
