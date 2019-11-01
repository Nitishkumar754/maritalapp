import { Component, OnInit } from '@angular/core';
import {CommonService} from '../common.service';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private common:CommonService) { }

  profile : any;
  imageUrlArray:any
  ngOnInit() {
  	this.getProfile();
  }
  lifestyle=true;
  edit_lifestyle=false;
  social=true;
  edit_social=false;

  getProfile(){
  	 this.common.commonService({}, "GET", "user/")
    .subscribe((data:any)=>{
      console.log("data>>>>>>>>>>>>>>>>> ", data)
      this.profile = data.data
      console.log("this.profile>>>>>>>>>>>>>>>>>>>>>>>>>> ", this.profile)
   	this.imageUrlArray=this.profile.profile_images
   	this.imageUrlArray.push(this.profile.profile_image)
   	this.imageUrlArray.reverse()
    },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
    })
  }

  edit(type){
    if(type=='lifestyle'){
      this.lifestyle=false;
      this.edit_lifestyle=true;
    }
    if(type=='social'){
      this.social=false;
      this.edit_social=true;
    }
    

  }

  cancel(type){
    if(type=='lifestyle')
      this.lifestyle=true;
      this.edit_lifestyle=false;

    if(type=='social'){
      this.social=true;
      this.edit_social=false;
    }
  }

}


 
