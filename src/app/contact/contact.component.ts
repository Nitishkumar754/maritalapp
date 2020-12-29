import {CommonService} from '../common.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


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
  feedbackForm = new FormGroup({
        name : new FormControl(''),
        mobile_number : new FormControl(''),
        email : new FormControl(''),
        message: new FormControl('')
    });
 

  ngOnInit() {
  }

  post_feedback(value){
    console.log("value**********", value);
    this.common.commonService(value,  "POST", "feedback/postmessage")
    .subscribe((data:any)=>{
    	console.log("feedback_response>>>>>> ",data);
      	this.feedback_response = data.message;
      	this.error_message = false;
      	this.success_message = true;
      	this.contact_form = {};
        this.feedbackForm= new FormGroup({ name : new FormControl(''),
        mobile_number : new FormControl(''),
        email : new FormControl(''),
        message: new FormControl('')});
      
    },
    error =>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error);
      this.error_message = true
      this.success_message = false
      this.feedback_response = error.error.message;
    })
    
  }

}
