import { Component, OnInit } from '@angular/core';
import {environment}  from '../../environments/environment';
import {Router, ActivatedRoute }  from '@angular/router';
import {CommonService} from '../common.service'


@Component({
  selector: 'app-viewed-profile',
  templateUrl: './viewed-profile.component.html',
  styleUrls: ['./viewed-profile.component.css']
})
export class ViewedProfileComponent implements OnInit {
	serverUrl = environment.serverUrl

  viewed_contacts = []
  error_message
  constructor(private route: ActivatedRoute,
  private router: Router, private common:CommonService) { }

  ngOnInit() {
  	this.get_viewed_contacts()
  }

  get_viewed_contacts(){
  	this.common.commonService({}, "GET", "user/viewed/contacts/mine")
	   .subscribe((contacts:any)=>{

	   	this.viewed_contacts  = contacts.data.viewed_contacts
	   	console.log("viewed_contacts>>>>>>>>>>>>>>>>>>>>>>>>>> ", this.viewed_contacts)
	   	
	   },
	   error => {
       console.log("this is error>>>>>>>>>>>>>>> ", error.error);
       this.error_message = error.error.message;

      })
  }

}
