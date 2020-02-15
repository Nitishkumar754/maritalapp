import {CommonService} from '../common.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private common: CommonService) { }

  contact_form = {};
  feedback_response = {};
  success_message = false
  error_message = false
  ngOnInit() {
  }

  post_feedback(){
    console.log("contact_form>>>>>>>>> ",this.contact_form);
    this.common.commonService(this.contact_form, "POST", "feedback/postmessage")
    .subscribe((data:any)=>{
    	console.log("feedback_response>>>>>> ",data);
      	this.feedback_response = data.message;
      	this.error_message = false;
      	this.success_message = true;
      	this.contact_form = {};
      
    },
    error =>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error);
      this.error_message = true
      this.success_message = false
      this.feedback_response = error.error.message;
    })
    
  }

}
