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

  ngOnInit() {
  	this.getSentInterest();
  }

  getSentInterest(){
    
    this.common.commonService({}, "GET", "profile/p/myinterest")
    .subscribe((data:any)=>{
      console.log("data>>>>>>>>>>>>>>>>> ", data)
      this.profiles = data.profile_list;
    },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
    })
  }

}
