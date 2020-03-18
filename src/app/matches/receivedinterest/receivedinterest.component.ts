import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../common.service'

@Component({
  selector: 'app-receivedinterest',
  templateUrl: './receivedinterest.component.html',
  styleUrls: ['./receivedinterest.component.css']
})
export class ReceivedinterestComponent implements OnInit {

  constructor(private common: CommonService) { }

    profiles = [];


  ngOnInit() {
  	this.getSentInterest();
  }

  getSentInterest(){
    
    this.common.commonService({}, "GET", "profile/p/interestedinme")
    .subscribe((data:any)=>{
      console.log("data>>>>>>>>>>>>>>>>> ", data)
      this.profiles = data.profile_list;
    },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
    })
  }


}
