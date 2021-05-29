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
  	this.getVisitors({pageNumber:1})
  }

  getVisitors(requestBody){
  	this.common.commonService(requestBody, "POST", "profile/p/profilevisitor")
	   .subscribe(visitor=>{
       this.profile_visitor  =  visitor['profile_list'];
       console.log("profile_visitor", this.profile_visitor);
      this.visitor_count = visitor['count'];
	   	
	   },
	   error => {
       console.log( error.error);
       this.error_message = error.error.message;

      })
  }

  previousPage:any
  page2:any
  loadPage(page: number) {
    
    var query = {pageNumber:page, pageCount:10}
    if (page && page !== this.previousPage) {
      this.previousPage = page;
      // this.loadData(page);
      this.getVisitors(query);
    }
  }

}
