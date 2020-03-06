import { Component, OnInit,ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import {CommonService} from '../../common.service';
import { ActivatedRoute } from "@angular/router";



@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private common: CommonService, private route: ActivatedRoute) { }
  password_message = '';

  @ViewChild('f') passwordResetForm:NgForm
  link = '';

  ngOnInit() {
  	this.link = this.route.snapshot.params["link"];
  	console.log("this.link>>>>>>>>>>> ",this.link);
  }


	validate_password(pass, pass_re){
		if(pass.length<6){
			this.password_message = "password must be atleast 6 characters long";
			return false;
		}
		if(pass.localeCompare(pass_re) != 0){
			this.password_message = "Both password should match";
			return false;
		}
		return true;
	}

  update_password(){
  	var pass = this.passwordResetForm.form.value.password
  	var pass_re = this.passwordResetForm.form.value.password_re
  	if(!this.validate_password(pass, pass_re)){
  		return;
  	}
  	this.password_message = '';
  	this.common.commonService({password:this.passwordResetForm.form.value.password}, "POST", `user/password/update/${this.link}`)
    .subscribe((data:any)=>{
      console.log("data>>>>>>>>>>>>>>>>> ", data);
      this.password_message = data.message;
      
    },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error);
      this.password_message = error.message
    })
  }

}
