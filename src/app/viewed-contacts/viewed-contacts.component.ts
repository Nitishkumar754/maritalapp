import { Component, OnInit } from '@angular/core';
import {CommonService} from '../common.service';

@Component({
  selector: 'app-viewed-contacts',
  templateUrl: './viewed-contacts.component.html',
  styleUrls: ['./viewed-contacts.component.css']
})
export class ViewedContactsComponent implements OnInit {
  viewedContactCount = 0;
  constructor(private common: CommonService) { }
  viewed_contacts = []
  ngOnInit() {

  	this.get_viewed_contacts({});
  }

  get_viewed_contacts(query){
  	
  	this.common.commonService(query, "POST", "profile/get/viewedcontacts")
    .subscribe((data:any)=>{
    	console.log("data ",data);
      this.viewed_contacts = data.profile_list;
      this.viewedContactCount = data.count;
      
    },
    error=>{
      console.log("error is  ", error)
    })
  }

  previousPage:any
  page2:any
  loadPage(page: number) {
    var query = {pageNumber:page, pageCount:10}
    if (page && page !== this.previousPage) {
      this.previousPage = page;
      // this.loadData(page);
      this.get_viewed_contacts(query);
    }
  }

}
