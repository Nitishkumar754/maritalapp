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

  	this.route.params.subscribe(params => {
   		const id = params['id'];
   		this.user_id = id;
   		this.getProfilePhotos(id);
   }) 
  }


 getProfilePhotos(id){
  
  this.common.commonService({},"POST", `profile/getProfilePhotos?user_id=${id}`)
  .subscribe((data:any)=>{
    this.member_photos = data.photos;
    console.log("this.profile_photos>>>>>>>>> ", this.member_photos);

  },error=>{
    console.log("error",error);
  })
}



}
