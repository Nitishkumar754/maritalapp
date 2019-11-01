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

  constructor(private common:CommonService) {}

  ngOnInit() {
  	this.getMembers();
  }

  

  getMembers(){
    
    this.common.commonService({}, "GET", "profile/all")
    .subscribe((data:any)=>{
      console.log("data>>>>>>>>>>>>>>>>> ", data)
      this.members = data.data
    },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
    })
  }



}
