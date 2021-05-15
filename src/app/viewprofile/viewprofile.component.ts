import { Component, OnInit } from '@angular/core';
import {environment}  from '../../environments/environment';
import {Router, ActivatedRoute }  from '@angular/router';
import {CommonService} from '../common.service'
import {CookieService} from 'ngx-cookie';


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
  shared_link = ''
  display_link_box = false;
  display_subs_btn = false;
  
  // imageUrlArray=['http://localhost:4000/images/p1.jpg','http://localhost:4000/images/p2.jpg', 'http://localhost:4000/images/p3.jpg', 'http://localhost:4000/images/p4.jpg']
  constructor(private route: ActivatedRoute,
  private router: Router, private common:CommonService, private _cookieService:CookieService) {
   }

   token: string = this._cookieService.get('token');
  ngOnInit() {
  	
   this.route.params.subscribe(params => {
   		const id = params['id'];
   		this.getProfile(id);
   }) 
  }


getProfile(id){
	
  	 this.common.commonService({}, "POST", "profile/u/"+id)
	   .subscribe((profile:any)=>{

	   	this.profile  = profile.data
	   	this.imageUrlArray=this.profile.profile_images
       if(this.imageUrlArray.length==0){
          if(this.profile.gender === 'f') this.imageUrlArray.push('assets/images/female.png');
          if(this.profile.gender === 'm') this.imageUrlArray.push('assets/images/male.png');
         }
	     })
	}

  get_premium_data(id){
    this.error_message = '';
    this.success_message = '';
    this.common.commonService({},"GET", "user/subscribe/data/"+id)
    .subscribe((data:any)=>{
      this.premium_data = data.data;
      this.is_premium_data = true

    },error => {
       this.display_subs_btn=true;
       this.error_message = error.error.message;

      })
  }


  shortlist_profile(id){
    this.error_message = '';
    this.success_message = '';

    this.common.commonService({},"POST", "profile/shortlist/"+id)
    .subscribe((response:any)=>{
      this.success_message = "Profile Shortlisted "
    },error => {
       this.error_message = error.error.message;

      })
  }

  show_interest(id){

    this.error_message = '';
    this.success_message = '';
    
    this.common.commonService({},"POST", "profile/interest/"+id)
    .subscribe((response:any)=>{
      this.success_message = "Interest Sent "
    },error => {
       console.log(error.error);
       this.error_message = error.error.message;

      })
  }


  getProfileShareLink(id){
    this.error_message = '';
    this.success_message = '';
    this.shared_link = '';
    

    this.common.commonService({},"POST", "profile/getProfileShareLink/"+id)
    .subscribe((response:any)=>{
      this.success_message = ""
      this.shared_link = response.shared_link;
      this.display_link_box = true;

    },error => {
       console.log(error.error);
       this.error_message = error.error.message;

      })

  }


  

  view_photos(id){
    if(this.token){
      this.router.navigate([`/e/photos`, id]);
    }
    else{
      this.router.navigate([`/photos`, id]);
    }
    
  }

}
