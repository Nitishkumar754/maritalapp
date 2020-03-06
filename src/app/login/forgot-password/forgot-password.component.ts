import { Component, OnInit,ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms'
import {CommonService} from '../../common.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private common: CommonService) { }
  @ViewChild('f') emailForm:NgForm

  message = ''

  ngOnInit() {
  }
  send_password_reset_link(){
  	console.log("emailForm>>>>>>>>>>> ",this.emailForm);


    this.common.commonService({email:this.emailForm.form.value.email}, "POST", "user/password/reset")
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
