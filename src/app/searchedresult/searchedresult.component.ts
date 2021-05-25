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
    let query = this.construct_query(this.route.snapshot.queryParams);
  	this.get_searched_result(query)
  }

  get_searched_result (request_body){

  	this.common.commonService(request_body, "POST", "profile/search/regularsearch")
    .subscribe((data:any)=>{
      this.searched_profile = data;
      this.member_count = data.count;
      for(let i=0;i<this.searched_profile.profiles.length;i++){
        if(this.searched_profile.profiles[i].profile_images.length === 0){
          if(this.searched_profile.profiles[i].gender === 'f'){
                 this.searched_profile.profiles[i].profile_images.push('assets/images/female.png')
          }
          if(this.searched_profile.profiles[i].gender === 'm'){
                 this.searched_profile.profiles[i].profile_images.push('assets/images/male.png')
          }
        }
      }
     
      

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
