import { Component, OnInit } from '@angular/core';
import {CommonService} from '../common.service';

@Component({
  selector: 'app-viewed-contacts',
  templateUrl: './viewed-contacts.component.html',
  styleUrls: ['./viewed-contacts.component.css']
})
export class ViewedContactsComponent implements OnInit {

  constructor(private common: CommonService) { }
  viewed_contacts = []
  ngOnInit() {

  	this.get_viewed_contacts();
  }

  get_viewed_contacts(){
  	
  	this.common.commonService({}, "GET", "profile/get/viewedcontacts")
    .subscribe((data:any)=>{
    	console.log("data>>>>>>>>>>> ",data);
      this.viewed_contacts = data.viewed_contacts
      
    },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
    })
  }

}
