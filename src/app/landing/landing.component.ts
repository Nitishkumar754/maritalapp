import { Component, OnInit, ViewChild } from '@angular/core';
import {environment}  from '../../environments/environment';
import {CommonService} from '../common.service';
import {NgForm} from '@angular/forms';



@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  serverUrl = environment.serverUrl
  imageUrlArray=[this.serverUrl+'/images/p1.jpg',this.serverUrl+'/images/p2.jpg', this.serverUrl+'/images/p3.jpg', this.serverUrl+'/images/p4.jpg']

  constructor(private common:CommonService) { }

  @ViewChild('f') signupForm:NgForm
  search_query = {};
  ngOnInit() {
  }

  profiles = [];

  get_profiles_for_guest(){

  this.search_query = this.signupForm.form.value.searchData;
  	console.log("search_query is>>>>>>>>> ",this.search_query);
  	this.common.commonService({}, "POST", "profile/guest/search")
    .subscribe((data:any)=>{
      console.log("data>>>>>>>>>>>>>>>>> ", data)
      this.profiles = data.profiles
      
    },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
    })


  }

}
