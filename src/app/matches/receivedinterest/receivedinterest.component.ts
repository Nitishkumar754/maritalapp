import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../common.service'

@Component({
  selector: 'app-receivedinterest',
  templateUrl: './receivedinterest.component.html',
  styleUrls: ['./receivedinterest.component.css']
})
export class ReceivedinterestComponent implements OnInit {

  constructor(private common: CommonService) { }
  interestReceivedCount:any;
    profiles = [];


  ngOnInit() {
  	this.getReceivedInterest({pageNumber:1});
  }

  getReceivedInterest(requestBody){
    
    this.common.commonService(requestBody, "GET", "profile/p/interestedinme")
    .subscribe((data:any)=>{
      this.profiles = data.profile_list;
      this.interestReceivedCount = data.count || 10;
    },
    error=>{
      console.log("error is ", error)
    })
  }
  previousPage:any
  page2:any
    loadPage(page: number) {
      
      var query = {pageNumber:page, pageCount:10}
      if (page && page !== this.previousPage) {
        this.previousPage = page;
        this.getReceivedInterest(query);
      }
    }

}
