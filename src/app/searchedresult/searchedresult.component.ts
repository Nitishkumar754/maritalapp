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


  ngOnInit() {
  	console.log("route>>>>>>>>>>>>>", this.route.snapshot.queryParams);
  	// this.searched_profile_result 
  	this.get_searched_result(this.route.snapshot.queryParams)
  }

  get_searched_result (request_body){

  	this.common.commonService(request_body, "POST", "profile/search/regularsearch")
    .subscribe((data:any)=>{
      console.log("data>>>>>>>>>>>>>>>>> ", data)
      this.searched_profile = data;
     
      

    },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
    })
  }

}
