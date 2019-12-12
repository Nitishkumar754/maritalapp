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
	
  	 this.common.commonService({}, "GET", "profile/"+id)
	   .subscribe((profile:any)=>{

	   	this.profile  = profile.data
	   	console.log("this.profile>>>>>>>>>>>>>>>>>>>>>>>>>> ", this.profile)
	   	this.imageUrlArray=this.profile.profile_images
	   	this.imageUrlArray.push(this.profile.profile_image)
	   	this.imageUrlArray.reverse()

	   })
	}

}
