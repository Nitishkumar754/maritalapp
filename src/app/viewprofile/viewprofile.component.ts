import { Component, OnInit } from '@angular/core';
import {environment}  from '../../environments/environment';
import {Router, ActivatedRoute }  from '@angular/router';
import {CommonService} from '../common.service'


@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.component.html',
  styleUrls: ['./viewprofile.component.css']
})
export class ViewprofileComponent implements OnInit {
  serverUrl = environment.serverUrl
  profile:any
  imageUrlArray:any
  premium_data:any
  error_message:''
  success_message = ''
  is_premium_data = false
  
  // imageUrlArray=['http://localhost:4000/images/p1.jpg','http://localhost:4000/images/p2.jpg', 'http://localhost:4000/images/p3.jpg', 'http://localhost:4000/images/p4.jpg']
  constructor(private route: ActivatedRoute,
  private router: Router, private common:CommonService) {
   }

  ngOnInit() {
  	
   this.route.params.subscribe(params => {
   		const id = params['id'];
   		this.getProfile(id);
   }) 
  }


getProfile(id){
	
  	 this.common.commonService({}, "GET", "profile/u/"+id)
	   .subscribe((profile:any)=>{

	   	this.profile  = profile.data
	   	console.log("this.profile>>>>>>>>>>>>>>>>>>>>>>>>>> ", this.profile)
	   	this.imageUrlArray=this.profile.profile_images
	   	// this.imageUrlArray.push(this.profile.profile_image)
       if(this.imageUrlArray.length==0){
             this.imageUrlArray.push(this.profile.profile_image);
         }
	   	this.imageUrlArray.reverse()

	   })
	}

  get_premium_data(id){
    this.error_message = '';
    this.success_message = '';
    this.common.commonService({},"GET", "user/subscribe/data/"+id)
    .subscribe((data:any)=>{
      this.premium_data = data.data;
      this.is_premium_data = true

      console.log("premium_data>>>>>>>>>>>>>>> ", this.premium_data);
    },error => {
       console.log("this is error>>>>>>>>>>>>>>> ", error.error);
       this.error_message = error.error.message;

      })
  }


  shortlist_profile(id){
    this.error_message = '';
    this.success_message = '';

    this.common.commonService({},"POST", "profile/shortlist/"+id)
    .subscribe((response:any)=>{
      this.success_message = "Profile Shortlisted "
      console.log("response>>>>>>>>>>>>>>> ", response);
    },error => {
       console.log("this is error>>>>>>>>>>>>>>> ", error.error);
       this.error_message = error.error.message;

      })
  }

  show_interest(id){

    this.error_message = '';
    this.success_message = '';
    
    this.common.commonService({},"POST", "profile/interest/"+id)
    .subscribe((response:any)=>{
      this.success_message = "Interest Sent "
      console.log("response>>>>>>>>>>>>>>> ", response);
    },error => {
       console.log("this is error>>>>>>>>>>>>>>> ", error.error);
       this.error_message = error.error.message;

      })
  }

}
