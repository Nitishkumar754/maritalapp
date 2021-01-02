import { Component, OnInit } from '@angular/core';

import {Router, ActivatedRoute }  from '@angular/router';
import {CommonService} from '../../common.service'


@Component({
  selector: 'app-member-photos',
  templateUrl: './member-photos.component.html',
  styleUrls: ['./member-photos.component.css']
})
export class MemberPhotosComponent implements OnInit {

  constructor(private route: ActivatedRoute,
  private router: Router, private common:CommonService) { }

  member_photos = [];
  user_id='';
  ngOnInit() {
  let shared = undefined;
  let id = undefined;
  	this.route.params.subscribe(params => {
   		id = params['id'];
   		this.user_id = id;
   }) 

  	this.route.queryParams.subscribe(queryParams => {
       shared = queryParams['shared'];
       console.log("shared **** ",shared);
   }) 

  	this.getProfilePhotos(id, shared);


  }


 getProfilePhotos(id, shared){

 if(shared){

 	this.common.commonService({},"POST", `profile/guest/getProfilePhotos?user_id=${id}`)
	  .subscribe((data:any)=>{
	    this.member_photos = data.photos;
	    console.log("this.profile_photos>>>>>>>>> ", this.member_photos);

	  },error=>{
	    console.log("error",error);
	  })
 }
 else{

 	this.common.commonService({},"POST", `profile/getProfilePhotos?user_id=${id}`)
	  .subscribe((data:any)=>{
	    this.member_photos = data.photos;
	    console.log("this.profile_photos>>>>>>>>> ", this.member_photos);

	  },error=>{
	    console.log("error",error);
	  })
 }
  
}

}
