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

  profile_visitor = []
  error_message
  constructor(private route: ActivatedRoute,
  private router: Router, private common:CommonService) { }

  ngOnInit() {
  	this.get_viewed_contacts()
  }

  get_viewed_contacts(){
  	this.common.commonService({}, "GET", "profile/p/profilevisitor")
	   .subscribe((visitor)=>{
       console.log("visitor>>>>>>>>>>> ",visitor);
	   	this.profile_visitor  =  visitor['visitor_profile']
	   	console.log("profile_visitor>>>>>>>>>>>>>>>>>>>>>>>>>> ", this.profile_visitor)
	   	
	   },
	   error => {
       console.log("this is error>>>>>>>>>>>>>>> ", error.error);
       this.error_message = error.error.message;

      })
  }

}
