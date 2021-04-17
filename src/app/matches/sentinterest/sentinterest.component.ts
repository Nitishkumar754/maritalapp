import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../common.service'

@Component({
  selector: 'app-sentinterest',
  templateUrl: './sentinterest.component.html',
  styleUrls: ['./sentinterest.component.css']
})
export class SentinterestComponent implements OnInit {

  constructor(private common: CommonService) { }

  profiles = [];
  sent_interest_count = 0;
  ngOnInit() {
  	this.getSentInterest({});
  }

  getSentInterest(requestBody){
    
    this.common.commonService(requestBody, "POST", "profile/p/myinterest")
    .subscribe((data:any)=>{
      this.profiles = data.profile_list;
      console.log("data",data);
      this.sent_interest_count = data.count;
    },
    error=>{
      console.log("error is  ", error)
    })
  }


  previousPage:any
  page2:any
  loadPage(page: number) {
    
    var query = {pageNumber:page, pageCount:10}
    console.log("query", query);
    if (page !== this.previousPage) {
      this.previousPage = page;
      // this.loadData(page);
      this.getSentInterest(query);
    }
  }

}
