import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../common.service'


@Component({
  selector: 'app-shortlisted',
  templateUrl: './shortlisted.component.html',
  styleUrls: ['./shortlisted.component.css']
})
export class ShortlistedComponent implements OnInit {

  constructor(private common: CommonService) { }

  profiles = [];
  shortlisted_count = 0;
  ngOnInit() {
  	this.getShortlisted({});
  }

  getShortlisted(requestBody){
    
    this.common.commonService(requestBody, "POST", "profile/p/shortlisted")
    .subscribe((data:any)=>{
      console.log("data ", data)
      this.profiles = data.profile_list;
      this.shortlisted_count = data.count;
    },
    error=>{
      console.log("error is ", error)
    })
  }

previousPage:any
page2:any
  loadPage(page: number) {
    
    var query = {pageNumber:page, pageCount:10}
    console.log("query", query);
    if (page && page !== this.previousPage) {
      this.previousPage = page;
      this.getShortlisted(query);
    }
  }

}
