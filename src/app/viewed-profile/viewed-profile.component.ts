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
  error_message = ''
  visitor_count = 0;
  constructor(private route: ActivatedRoute,
  private router: Router, private common:CommonService) { }

  ngOnInit() {
  	this.get_viewed_contacts({})
  }

  get_viewed_contacts(requestBody){
  	this.common.commonService(requestBody, "POST", "profile/p/profilevisitor")
	   .subscribe((visitor)=>{
       console.log("visitor ",visitor);
	   	this.profile_visitor  =  visitor['visitor_profile']
	   	console.log("profile_visitor ", this.profile_visitor)
       this.visitor_count = visitor.count;
	   	
	   },
	   error => {
       console.log("this is error ", error.error);
       this.error_message = error.error.message;

      })
  }

  previousPage:any

  loadPage(page: number) {
    
    var query = {pageNumber:page, pageCount:10}
    console.log("query", query);
    if (page !== this.previousPage) {
      this.previousPage = page;
      // this.loadData(page);
      this.get_viewed_contacts(query);
    }
  }

}
