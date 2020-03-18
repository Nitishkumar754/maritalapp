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

  ngOnInit() {
  	this.getShortlisted();
  }

  getShortlisted(){
    
    this.common.commonService({}, "GET", "profile/p/shortlisted")
    .subscribe((data:any)=>{
      console.log("data>>>>>>>>>>>>>>>>> ", data)
      this.profiles = data.profile_list;
    },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
    })
  }
}
