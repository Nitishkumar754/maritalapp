import { Component, OnInit } from '@angular/core';
import {environment}  from '../../environments/environment';
import {Router, ActivatedRoute }  from '@angular/router';
import {CommonService} from '../common.service'


@Component({
  selector: 'app-shared-profile',
  templateUrl: './shared_profile.component.html',
  styleUrls: ['./shared_profile.component.css']
})
export class SharedProfileComponent implements OnInit {
	
  imageUrlArray:any
  profile:any
  constructor(private route: ActivatedRoute,
  private router: Router, private common:CommonService) { }

  
  ngOnInit() {
    this.route.params.subscribe(params => {
       const id = params['id'];
       this.get_shared_profile_details(id);
   }) 

  }

   get_shared_profile_details(id){
     this.common.commonService({}, "POST", "profile/shared/"+id)
     .subscribe((profile:any)=>{

       this.profile  = profile.data
       this.imageUrlArray = this.profile.profile_images;
    })  

  
}

view_photos(id){
    this.router.navigate([`/photos`, id]);
  }

}
