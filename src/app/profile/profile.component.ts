import { Component, OnInit, ViewChild } from '@angular/core';
import {CommonService} from '../common.service';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import {environment}  from '../../environments/environment';
import {CookieService} from 'angular2-cookie/core';
import {NgForm} from  '@angular/forms';

import {MapperService} from '../services/mapperservice.service';

import { Title, Meta } from '@angular/platform-browser';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private common:CommonService, private _cookieService:CookieService, 
    private mapperservice:MapperService, private titleService: Title, private metaService: Meta) { }
  @ViewChild('f') profileForm:NgForm

  serverUrl = environment.serverUrl
  profile : any;
  imageUrlArray = [];

  complexion = [];
  blood_group = [];
  religion = [];
  caste_list = [];
  raasi_list = [];
  drink_list = [];
  smoke_list = [];
  marital_list = [];
  body_type_list = [];

  occupation_list = [];
  higher_education = [];
  income_list = [];
  profile_manager_list = [];
  profile_photos = [];
  title = 'Bihar Matrimony, Shaadi, Marriage, Free Matrimonial Sites, Match Making, Bride Groom'

  error_message='';
  success_message='';
  display_link_box=false;
  shared_link = '';
  districts = [];
  state_list = [];
  height_list = [];
  // partner preferences dropdwon list
  marital_status_dropdown_list = [];
  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      {name: 'keywords', content: 'Matrimonial search, best matrimony finder, shaadi, Bride Personal, Groom Personals, Indian matchmaking, India dating websites, marriage Services, marriage Bureau, matchmaking bureau, vivaah, shaadi com'},
      {name: 'description', content: 'Keyword Search - Find Indian, Bihar Matrimonials for Marriage by keywords, caste search(e.g. koeri, dangi, kurmi, kushwaha, yadav, engineer, doctor) at shaadikarlo.in'},
      {name: 'robots', content: 'index, follow'}
    ]);

  	this.getProfile();
    this.getProfilePhotos();

    this.complexion = this.mapperservice.complexion;
    this.blood_group = this.mapperservice.blood_group;
    this.religion = this.mapperservice.religion;
    this.caste_list = this.mapperservice.caste;
    this.raasi_list = this.mapperservice.raasi;
    this.drink_list = this.mapperservice.drink;
    this.smoke_list = this.mapperservice.smoke;
    this.marital_list = this.mapperservice.marital_list;
    this.body_type_list = this.mapperservice.body_list;
    this.occupation_list = this.mapperservice.occupation_type;
    this.higher_education = this.mapperservice.higher_education;
    this.income_list = this.mapperservice.annual_income;
    this.profile_manager_list = this.mapperservice.profile_managed_by;
    this.state_list = this.mapperservice.state;
    this.height_list = this.mapperservice.height_list;


    this.marital_status_dropdown_list = [
                              {"id":1,"itemName":"Never Married"},
                              {"id":2,"itemName":"Married"},
                              {"id":3,"itemName":"Divorced"},
                              {"id":4,"itemName":"Doesn't Matter"}
                            ];
        this.selectedItems = [
                            ];
        this.dropdownSettings = { 
                                  singleSelection: false, 
                                  text:"Marital Status",
                                  selectAllText:'Select All',
                                  unSelectAllText:'UnSelect All',
                                  enableSearchFilter: true,
                                  classes:"myclass dropdwon-class"
                                };          

  }
  lifestyle=true;
  edit_lifestyle=false;
  social=true;
  edit_social=false;
  edit_description = false;
  description = true;
  family = true;
  edit_family = false;
  partner = true;
  edit_partner = false;
  token: string = this._cookieService.get('token');
  profile_image_url= ''
  education = true;
  edit_education = false

  afuConfig = {
    uploadAPI: {
      url:this.serverUrl+"api/profile/image/upload",
       headers: {
     "Authorization" : 'Bearer '+ this.token
      }
    },
    
    formatsAllowed: ".jpg,.jpeg,.png",
    maxSize: "10",
};

DocUpload(event){
 this.getProfile();
 this.getProfilePhotos();

}
  filesToUpload: Array<File> = [];

  getProfile(edit_type=null){
  	 this.common.commonService({}, "POST", "user/")
    .subscribe((data:any)=>{
      this.profile = data.data;


      this.edit_social = false;
      this.social = true;
      this.edit_lifestyle = false;
      this.lifestyle = true;
      this.description  = true;
      this.edit_description = false;
      this.family = true;
      this.edit_family = false;
      this.partner = true;
      this.edit_partner = false;

      this.education = true;
      this.edit_education = false;

      for(var i=0; i < this.profile && this.profile.profile_images.length; i++){
          console.log(this.profile.profile_images[i]);
         
          this.imageUrlArray = this.profile.profile_images
         
           
          
      }
    this.imageUrlArray = this.profile.profile_images;

    if(this.imageUrlArray.length==0){
             this.imageUrlArray.push(this.profile.profile_image);
    }

   	this.imageUrlArray.reverse()
    
    },
    error=>{
      console.log(error)
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
    if(type == 'description'){
      this.description = false;
      this.edit_description = true;
    }

    if(type == 'family'){
      this.family = false;
      this.edit_family = true;
    }
     if(type == 'partner'){
      this.partner = false;
      this.edit_partner = true;
    }

    if(type == 'education'){
      this.education = false;
      this.edit_education = true;
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
     if(type=='description'){
      this.description=true;
      this.edit_description=false;
    }
    if(type=='family'){
      this.family=true;
      this.edit_family=false;
    }
    if(type=='partner'){
      this.partner=true;
      this.edit_partner=false;
    }
  }


updateLifestyle(edit_type){

  var request_body = this.get_request_body(this.profileForm);
  this.common.commonService(request_body,"POST", 'profile/update')
  .subscribe((data:any)=>{
    this.getProfile(edit_type=edit_type);

  },error=>{
    console.log(error);
  })
}

get_request_body(f){

  var request_body = {}
  var form_data = f.form.value.profileData
  var form_attribute  = Object.keys(form_data);
  form_attribute.forEach((key) => request_body[key] = form_data[key])

  return request_body;
}


// Multiselect dropdwon codes headers

dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};
    
    onItemSelect(item:any){
        console.log(item);
        console.log(this.selectedItems);
    }
    OnItemDeSelect(item:any){
        console.log(item);
        console.log(this.selectedItems);
    }
    onSelectAll(items: any){
        console.log(items);
    }
    onDeSelectAll(items: any){
        console.log(items);
    }


//


getProfilePhotos(){
  
  this.common.commonService({},"POST", 'profile/getProfilePhotos')
  .subscribe((data:any)=>{
    this.profile_photos = data.photos;
    console.log("this.profile_photos>>>>>>>>> ", this.profile_photos);

  },error=>{
    console.log("error",error);
  })
}


deletePhoto(url){
  this.common.commonService({url:url},"POST", 'profile/deletePhoto')
  .subscribe((data:any)=>{
    
    this.getProfilePhotos();

  },error=>{
    console.log("error",error);
  })
}

getProfileShareLink(id){
    this.error_message = '';
    this.success_message = '';
    this.shared_link = '';
    

    this.common.commonService({},"POST", "profile/getProfileShareLink/"+id)
    .subscribe((response:any)=>{
      this.success_message = ""
      console.log("response>>>>>>>>>>>>>>> ", response);
      this.shared_link = response.shared_link;
      this.display_link_box = true;

    },error => {
       console.log("this is error>>>>>>>>>>>>>>> ", error.error);
       this.error_message = error.error.message;

      })

  }


  selected_state_name(key){
  
  var mystate_code = this.profileForm.value.profileData.state;
  console.log("mystate_code>>>> ",mystate_code);
  var state_district = this.mapperservice.state_district;
  for (let [key, value] of Object.entries(state_district['states'])) {
  if(value['state_code']==mystate_code){
      this.districts = value['districts']
        
    }
  }

  }

}

