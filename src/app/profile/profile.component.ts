import { Component, OnInit } from '@angular/core';
import {CommonService} from '../common.service';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import {environment}  from '../../environments/environment';
import {CookieService} from 'angular2-cookie/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private common:CommonService, private _cookieService:CookieService,) { }

  serverUrl = environment.serverUrl
  profile : any;
  imageUrlArray = [];
  ngOnInit() {
  	this.getProfile();
  }
  lifestyle=true;
  edit_lifestyle=false;
  social=true;
  edit_social=false;
  token: string = this._cookieService.get('token');
  profile_image_url= ''

  afuConfig = {
    uploadAPI: {
      url:this.serverUrl+"api/profile/image/upload",
       headers: {
     "Authorization" : 'Bearer '+ this.token
      }
    },
    formatsAllowed: ".jpg,.jpeg,.png",
    maxSize: "2",
};





  filesToUpload: Array<File> = [];

  getProfile(){
  	 this.common.commonService({}, "GET", "user/")
    .subscribe((data:any)=>{
      console.log("data>>>>>>>>>>>>>>>>> ", data)
      this.profile = data.data
      console.log("this.profile>>>>>>>>>>>>>>>>>>>>>>>>>> ", this.profile)
      for(var i=0; i < this.profile && this.profile.profile_images.length; i++){
          console.log(this.profile.profile_images[i]);

          if (this.profile.profile_images[i].substring(0, 4)!='http'){
             this.imageUrlArray.push(this.serverUrl+"static/images/"+this.profile.profile_images[i]);
          }
         
          else{
              this.imageUrlArray.push(this.profile.profile_images[i])
          }
      }
     
   	this.imageUrlArray.reverse()
     console.log("this.imageUrlArray>>>>>>>>>>>>> ", this.imageUrlArray);
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

  onUploadFinished($event){
    console.log("$event1>>>>>>>>>>>>>> ",$event);
    console.log("$event1>>>>>>>>>>>>>> ",$event.src);
    // alert("finished");
  }
  onRemoved($event){
    console.log("$event>2>>>>>>>>>>>>> ",$event);
    // alert("removed")
  }

  onUploadStateChanged($event){
    console.log("$event3>>>>>>>>>>>>>> ",$event);
    // alert("state changed");

    // this.filesToUpload = <Array<File>>fileInput.target.files;
  }


fileChangeEvent(fileInput: any) {
    // this.filesToUpload = <Array<File>>fileInput.target.files;
    //this.product.photo = fileInput.target.files[0]['name'];

}

}

