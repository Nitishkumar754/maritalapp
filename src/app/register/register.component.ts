import { Component, OnInit, ViewChild } from '@angular/core';


import { AuthserviceService } from '../services/authservice.service'
import {NgForm} from '@angular/forms';
import {MapperService} from '../services/mapperservice.service';
import {Router, ActivatedRoute }  from '@angular/router';
import {CommonService} from '../common.service';


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
  otp_error = false;
  otp_error_msg = '';
  otp_success_msg = '';
  verification_email = '';
  state_list = [];
  stateDistrict = [];
  constructor(private auth: AuthserviceService, private mapperservice:MapperService, private router: Router, private common: CommonService) { 

  	// this.logger.debug('Your log message goes here');
  }


  ngOnInit() {
    this.indian_state = this.mapperservice.state;
    this.districts = this.mapperservice.state_district['states']['3']['districts'];
    this.getMapper();
  }

  
  userRegister(form:NgForm){

  	let formValue = this.signupForm.form.value.userData;
    this.request_body['email'] = formValue.email;
    this.request_body['mobile_number'] = formValue.mobile;
    this.request_body['name'] = formValue.name;
    this.request_body['dob'] = formValue.dob.jsdate;
    this.request_body['gender'] = formValue.gender;
    this.request_body['password'] = formValue.passwordData.password; 
    this.request_body['password_re'] = formValue.passwordData.password_re; 
    this.request_body['state'] = formValue.addressData.state ? formValue.addressData.state.toUpperCase():''; 
    this.request_body['district'] = formValue.addressData.district; 
    this.request_body['addressline'] = formValue.addressData.addressline; 


    this.errorMessage = '';
    if(this.invalid_dob){
      this.errorMessage = 'Date of birth is not valid';
      return;
    }
    this.showLoader = true;
  	this.auth.registerService({user:this.request_body})
  	.subscribe((data:any)=>{
    if(data && data.status){
    	this.showLoader = false;
    	this.registerForm = false;
      this.show_verification_msg = true;
      this.verification_email = data.email;
      this.registerMessage = `Please enter the otp sent to your email ${data.email}`
    	this.user_id = data.user;

    	return;
    }
    
	  },
	  error=>{
      console.log("error", error)
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
  for (let [key, value] of Object.entries(this.stateDistrict)) {

  if(value['state_code']==mystate_code){

      this.districts = value['districts']

  }
}

}


onOtpChange(user_otp_input){
  if(user_otp_input.length==4){
    this.auth.verifyUserEmail({otp:user_otp_input, email:this.verification_email})
    .subscribe((data:any)=>{
     console.log("data **** ", data);
    if(data && data.status==200){
      this.otp_error_msg = '';
      this.otp_error = false;
      this.otp_success_msg = "Success!. Please login to continue";

      setTimeout(()=>{
            this.router.navigate(['/login']);
      },3000)
    }
    
    },
    error=>{
      console.log("error", error.error.message)
      this.otp_error_msg = error.error.message;
      this.otp_error = true;
      this.otp_success_msg = '';
      return error;
    })
  }
}


resendOtp(){
  if(!this.verification_email){
    this.otp_error_msg = 'Email not found!';
    return
  }
    alert("resending the otp");

  this.auth.resendOtp({email:this.verification_email})
    .subscribe((data:any)=>{
     console.log("data **** ", data);
    if(data && data.status==200){
      this.otp_error_msg = '';
      this.otp_error = false;
      this.otp_success_msg = "OTP sent";
    }
    
    },
    error=>{
      console.log("error", error.error.message)
      this.otp_error_msg = error.error.message;
      this.otp_error = true;
      this.otp_success_msg = '';
      return error;
    })
  }

  getMapper(){
    this.common.commonService({state:true, stateDistrict:true}, "POST", "common/getMapper")
    .subscribe((data:any)=>{
      
      this.state_list = data.mapper.states;
      this.stateDistrict = data.mapper.stateDistrict;
    },
    error=>{
      console.log(error)
    })
  }
  
}
