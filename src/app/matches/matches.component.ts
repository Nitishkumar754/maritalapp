import { Component, OnInit } from '@angular/core';
import {environment}  from '../../environments/environment';
import {CommonService} from '../common.service'

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  serverUrl = environment.serverUrl
  members = []
  constructor(private common: CommonService) { }

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
