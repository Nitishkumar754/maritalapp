import { Component, OnInit } from '@angular/core';
import {environment}  from '../../environments/environment';
import {CommonService} from '../common.service';




@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  serverUrl = environment.serverUrl
  members = []
  request_query = {"pageNumber":0,"pageCount":10};
  
  member_count :any;
  cr_user = '';
  constructor(private common:CommonService) {}

  ngOnInit() {
  	this.getMembers(this.request_query);
    var currentUser = JSON.parse(localStorage.getItem('MAtoken'));
    this.cr_user = JSON.stringify(currentUser);

  }


  getMembers(request_query){
    
    this.common.commonService(request_query, "POST", "profile/all")
    .subscribe((data:any)=>{
      console.log("data>>>>>>>>>>>>>>>>> ", data)
      this.members = data.data
      this.member_count = data.count;
      
    },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
    })
  }


  
  currentPage = 4;

  page2 = 1;

  isDisabled = true;

  toggleDisabled() {
    this.isDisabled = !this.isDisabled;
  }
  nextPage(){
    
  }

previousPage:any


  loadPage(page: number) {
    
    var query = {pageNumber:page-1, pageCount:10}
    if (page !== this.previousPage) {
      this.previousPage = page;
      // this.loadData(page);
      this.getMembers(query);
    }
  }


}
