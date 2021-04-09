import { Component, OnInit, ViewChild } from '@angular/core';
import {CommonService} from '../../common.service';
import {NgForm} from '@angular/forms'
import { AuthserviceService } from '../../services/authservice.service'
import {Router, ActivatedRoute }  from '@angular/router';


@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  constructor(private auth: AuthserviceService, private common: CommonService, private router: Router) { }

  message = '';
  otp_error_msg = '';
  otp_success_msg = '';
  email_to_verified = '';
  otp_error = false;
  invalid_email = 'Please enter a valid email';
  @ViewChild('f') emailForm:NgForm
  show_email_input_form = true;
  show_otp_input_form = false;
  
  ngOnInit() {
  }
  send_email_verification_otp(){
    this.email_to_verified = this.emailForm.form.value.email;
    this.common.commonService({email:this.emailForm.form.value.email}, "POST", "user/resend/otp")
    .subscribe((data:any)=>{
      console.log("data", data);
      this.message = data.message;
      this.show_email_input_form=false;
      this.show_otp_input_form  = true;
      this.otp_error_msg = '';
    },
    error=>{
    	this.message = error.error.message;
      this.otp_error_msg = error.error.message;
      this.invalid_email = '';
      console.log("error ", error)
    })
  }

  onOtpChange(user_otp_input){
  if(user_otp_input.length==4){
    this.auth.verifyUserEmail({otp:user_otp_input, email:this.email_to_verified})
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
  if(!this.email_to_verified){
    this.otp_error_msg = 'Email not found!';
    return
  }
  this.auth.resendOtp({email:this.email_to_verified})
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




}
