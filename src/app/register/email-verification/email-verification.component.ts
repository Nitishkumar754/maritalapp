import { Component, OnInit, ViewChild } from '@angular/core';
import {CommonService} from '../../common.service';
import {NgForm} from '@angular/forms'


@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  constructor(private common: CommonService) { }
  message = '';

  @ViewChild('f') emailForm:NgForm

  ngOnInit() {
  }
  send_email_verification_link(){
  	console.log("emailForm>>>>>>>>>>> ",this.emailForm);


    this.common.commonService({email:this.emailForm.form.value.email}, "POST", "user/email/verification")
    .subscribe((data:any)=>{
      console.log("data>>>>>>>>>>>>>>>>> ", data)
      this.message = data.message;
    },
    error=>{
    	this.message = error.error.message;
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
    })
  }

}
