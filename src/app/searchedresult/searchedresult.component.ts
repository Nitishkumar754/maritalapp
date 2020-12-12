import { Component, OnInit } from '@angular/core';
import {DataService} from '../services/dataservice.service';
import {ActivatedRoute} from '@angular/router'
import {CommonService} from '../common.service';


@Component({
  selector: 'app-searchedresult',
  templateUrl: './searchedresult.component.html',
  styleUrls: ['./searchedresult.component.css']
})
export class SearchedresultComponent implements OnInit {

  constructor(private dataservice:DataService, private route:ActivatedRoute, private common: CommonService) { }
  searched_profile: any;

   member_count = 100;
 


  construct_query(searched_params, limit=10, pageNumber=1){

    var query = Object.assign({}, searched_params);
    console.log("query", query);
    query['limit']=limit;
    query['pageNumber']=pageNumber
    return query;


  }
  ngOnInit() {
  	console.log("route>>>>>>>>>>>>>", this.route.snapshot.queryParams);
  	// this.searched_profile_result 
    let query = this.construct_query(this.route.snapshot.queryParams);
  	this.get_searched_result(query)
  }

  get_searched_result (request_body){

  	this.common.commonService(request_body, "POST", "profile/search/regularsearch")
    .subscribe((data:any)=>{
      
      this.searched_profile = data;
      this.member_count = data.count;
     
      

    },
    error=>{
      console.log("error is", error)
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

    let query = this.construct_query(this.route.snapshot.queryParams, 10, page);
    this.get_searched_result(query)
    
    }
  }


}
