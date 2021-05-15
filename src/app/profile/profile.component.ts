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
  complexion_config = {};
  bloodGroupList = [];
  religion = [];
  
  raasiList = [];
  drink_list = [];
  smoke_list = [];
  marital_list = [];
  body_type_list = [];

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
  height_config = {};
  //occupation
  occupation_list = [];

  occupation_config = {};
  //education
  education_list = [];
  education_config

  //religion
  religion_config = {};
  religion_list = [];
  //caste
  caste_list = [];
  caste_config = {};
  state_config = {};
  marital_status_config = {};
  district_config = {};
  // partner preferences dropdwon list
  marital_status_dropdown_list = [];
  stateDistrict = {};

  bodyType_config = {};
  smoke_config = {};
  drink_config = {};
  gedner_config = {};
  bloodGroup_config = {};
  foodType_config = {};
  raasi_config = {};
  gender_list = []; 
  bodyTypeList = [];
  foodHabitList = [];
  foodHabit_config = {};

  resetVar = false;
  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      {name: 'keywords', content: 'Matrimonial search, best matrimony finder, shaadi, Bride Personal, Groom Personals, Indian matchmaking, India dating websites, marriage Services, marriage Bureau, matchmaking bureau, vivaah, shaadi com'},
      {name: 'description', content: 'Keyword Search - Find Indian, Bihar Matrimonials for Marriage by keywords, caste search(e.g. koeri, dangi, kurmi, kushwaha, yadav, engineer, doctor) at shaadikarlo.in'},
      {name: 'robots', content: 'index, follow'}
    ]);

  	this.getProfile();
    this.getProfilePhotos();
    this.getMapper();

    this.complexion = this.mapperservice.complexion;
    this.bloodGroupList = this.mapperservice.blood_group;
    this.religion = this.mapperservice.religion;
    this.caste_list = this.mapperservice.caste;
    this.drink_list = this.mapperservice.drink;
    this.smoke_list = this.mapperservice.smoke;
    this.marital_list = this.mapperservice.marital_list;
    this.body_type_list = this.mapperservice.body_list;
    this.occupation_list = this.mapperservice.occupation_type;
    this.higher_education = this.mapperservice.higher_education;
    this.income_list = this.mapperservice.annual_income;
    this.profile_manager_list = this.mapperservice.profile_managed_by;
    // this.state_list = this.mapperservice.state;
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

  this.state_config = {
    displayFn:(item: any) => { return item.value; }, 
    displayKey:"description", 
    search:true, 
    height: '300px', 
    placeholder:'Select State', 
    customComparator: ()=>{}, 
    limitTo: 0, 
    moreText: 'more', 
    noResultsFound: 'No results found!', 
    searchPlaceholder:'Search', 
    searchOnKey: 'key', 
    clearOnSelection: false, 
    inputDirection: 'ltr' 
  }

  this.district_config = {
    displayFn:(item: any) => { return item.value; }, 
    displayKey:"description", 
    search:true, 
    height: '300px', 
    placeholder:'Select Destrict', 
    customComparator: ()=>{}, 
    limitTo: 0, 
    moreText: 'more', 
    noResultsFound: 'No results found!', 
    searchPlaceholder:'Search', 
    searchOnKey: 'key', 
    clearOnSelection: false, 
    inputDirection: 'ltr' 
  }
  this.marital_status_config = {
    displayFn:(item: any) => { return item.value; }, 
    displayKey:"description", 
    search:true, 
    height: '300px', 
    placeholder:'Select Marital Status', 
    customComparator: ()=>{}, 
    limitTo: 0, 
    moreText: 'more', 
    noResultsFound: 'No results found!', 
    searchPlaceholder:'Search', 
    searchOnKey: 'key', 
    clearOnSelection: false, 
    inputDirection: 'ltr' 
  }

  this.height_config = {
    displayFn:(item: any) => { return item.value; }, 
    displayKey:"description", 
    search:true, 
    height: '300px', 
    placeholder:'Select Height', 
    customComparator: ()=>{}, 
    limitTo: 0, 
    moreText: 'more', 
    noResultsFound: 'No results found!', 
    searchPlaceholder:'Search', 
    searchOnKey: 'key', 
    clearOnSelection: false, 
    inputDirection: 'ltr' 
  }

this.complexion_config = {
    displayFn:(item: any) => { return item.value; }, 
    displayKey:"description", 
    search:true, 
    height: '300px', 
    placeholder:'Complexion', 
    customComparator: ()=>{}, 
    limitTo: 0, 
    moreText: 'more', 
    noResultsFound: 'No results found!', 
    searchPlaceholder:'Search', 
    searchOnKey: 'key', 
    clearOnSelection: false, 
    inputDirection: 'ltr' 
  }

  this.smoke_config = {
    displayFn:(item: any) => { return item.value; }, 
    displayKey:"description", 
    search:true, 
    height: '300px', 
    placeholder:'Select Smoke Habit', 
    customComparator: ()=>{}, 
    limitTo: 0, 
    moreText: 'more', 
    noResultsFound: 'No results found!', 
    searchPlaceholder:'Search', 
    searchOnKey: 'key', 
    clearOnSelection: false, 
    inputDirection: 'ltr' 
  }
  this.drink_config = {
    displayFn:(item: any) => { return item.value; }, 
    displayKey:"description", 
    search:true, 
    height: '300px', 
    placeholder:'Select Drink Habit', 
    customComparator: ()=>{}, 
    limitTo: 0, 
    moreText: 'more', 
    noResultsFound: 'No results found!', 
    searchPlaceholder:'Search', 
    searchOnKey: 'key', 
    clearOnSelection: false, 
    inputDirection: 'ltr' 
  }
  this.bodyType_config = {
    displayFn:(item: any) => { return item.value; }, 
    displayKey:"description", 
    search:true, 
    height: '300px', 
    placeholder:'Body Type', 
    customComparator: ()=>{}, 
    limitTo: 0, 
    moreText: 'more', 
    noResultsFound: 'No results found!', 
    searchPlaceholder:'Search', 
    searchOnKey: 'key', 
    clearOnSelection: false, 
    inputDirection: 'ltr' 
  }

  this.foodHabit_config = {
    displayFn:(item: any) => { return item.value; }, 
    displayKey:"description", 
    search:true, 
    height: '300px', 
    placeholder:'Food Habit', 
    customComparator: ()=>{}, 
    limitTo: 0, 
    moreText: 'more', 
    noResultsFound: 'No results found!', 
    searchPlaceholder:'Search', 
    searchOnKey: 'key', 
    clearOnSelection: false, 
    inputDirection: 'ltr' 
  }

  this.bloodGroup_config = {
    displayFn:(item: any) => { return item.value; }, 
    displayKey:"description", 
    search:true, 
    height: '300px', 
    placeholder:'Blood Group', 
    customComparator: ()=>{}, 
    limitTo: 0, 
    moreText: 'more', 
    noResultsFound: 'No results found!', 
    searchPlaceholder:'Search', 
    searchOnKey: 'key', 
    clearOnSelection: false, 
    inputDirection: 'ltr' 
  }

  this.education_config = {
        displayFn:(item: any) => { return item.education; }, 
        displayKey:"description", 
        search:true, 
        height: '300px', 
        placeholder:'Highest Education', 
        customComparator: ()=>{}, 
        limitTo: 0, 
        moreText: 'more', 
        noResultsFound: 'No results found!', 
        searchPlaceholder:'Search', 
        searchOnKey: 'education', 
        clearOnSelection: false, 
        inputDirection: 'ltr' 
  }

      this.occupation_config = {
        displayFn:(item: any) => { return item.occupation; }, 
        displayKey:"description", 
        search:true, 
        height: '300px', 
        placeholder:'Occupation', 
        customComparator: ()=>{}, 
        limitTo: 0, 
        moreText: 'more', 
        noResultsFound: 'No results found!', 
        searchPlaceholder:'Search', 
        searchOnKey: 'occupation', 
        clearOnSelection: false, 
        inputDirection: 'ltr' 
      }

      this.caste_config = {
        displayFn:(item: any) => { return item.caste; }, 
        displayKey:"description", 
        search:true, 
        height: '300px', 
        placeholder:'Caste', 
        customComparator: ()=>{}, 
        limitTo: 0, 
        moreText: 'more', 
        noResultsFound: 'No results found!', 
        searchPlaceholder:'Search', 
        searchOnKey: 'caste', 
        clearOnSelection: false, 
        inputDirection: 'ltr' 
      }

      this.religion_config = {
        displayFn:(item: any) => { return item.religion; }, 
        displayKey:"description", 
        search:true, 
        height: '300px', 
        placeholder:'Religion', 
        customComparator: ()=>{}, 
        limitTo: 0, 
        moreText: 'more', 
        noResultsFound: 'No results found!', 
        searchPlaceholder:'Search', 
        searchOnKey: 'religion', 
        clearOnSelection: false, 
        inputDirection: 'ltr' 
      }

    this.raasi_config = {
    displayFn:(item: any) => { return item.value; }, 
    displayKey:"description", 
    search:true, 
    height: '300px', 
    placeholder:'Select Raasi', 
    customComparator: ()=>{}, 
    limitTo: 0, 
    moreText: 'more', 
    noResultsFound: 'No results found!', 
    searchPlaceholder:'Search', 
    searchOnKey: 'key', 
    clearOnSelection: false, 
    inputDirection: 'ltr' 
  }




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

      this.imageUrlArray = this.profile.profile_images;

      if(this.imageUrlArray.length==0){
          if(this.profile.gender === 'f') this.imageUrlArray.push('assets/images/female.png');
          if(this.profile.gender === 'm') this.imageUrlArray.push('assets/images/male.png');
      }

   	// this.imageUrlArray.reverse()
    
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
  form_attribute.forEach((key) => {
    if(['higher_education', 'occupation', 'religion', 'caste', 
      'district', 'state', 'height', 'marital_status', 
      'complexion', 'smoke', 'drink', 'blood_group', 'raasi', 
      'diet', 'body_type', 'father_occupation', 'mother_occupation'].includes(key)){
      request_body[key] = form_data[key]["key"];
    }
    else{
      request_body[key] = form_data[key]
    }

  })
  return request_body;
}


// Multiselect dropdwon codes headers

dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};
    
    onItemSelect(item:any){
    }
    OnItemDeSelect(item:any){
    }
    onSelectAll(items: any){
    }
    onDeSelectAll(items: any){
    }


//


getProfilePhotos(){
  
  this.common.commonService({},"POST", 'profile/getProfilePhotos')
  .subscribe((data:any)=>{
    this.profile_photos = data.photos;

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
  console.log("mystate_code>>>> ",mystate_code.key);
  var stateDistrict = this.stateDistrict;
  let districts = [];
  this.districts = [];
  for (let [key, value] of Object.entries(stateDistrict)) {
  if(value['state_code'].toLowerCase()==mystate_code.key.toLowerCase()){
      districts = value['districts'];
      districts.map(district=>{
        this.districts.push({key:district.toLowerCase(), value:district});
      })

    }
  }
  console.log("this.districts ***", this.districts);
  }

  getMapper(){
    this.common.commonService({education:true, 
      occupation:true, 
      caste:true, 
      religion:true, 
      state:true, 
      stateDistrict:true, 
      district:true,
      marital:true,
      gender:true,
      height:true,
      raasi:true,
      smoke:true,
      drink:true,
      foodType:true,
      bloodGroup:true,
      complexion:true,
      bodyType:true
    }, "POST", "common/getMapper")
    .subscribe((data:any)=>{
      this.education_list = data.mapper.education;
      this.occupation_list = data.mapper.occupation;
      this.caste_list = data.mapper.caste_list;
      this.religion_list = data.mapper.religion_list;
      this.state_list = data.mapper.states;
      this.stateDistrict = data.mapper.stateDistrict;
      this.districts = data.mapper.districts;
      this.marital_list = data.mapper.maritalList;
      this.height_list = data.mapper.heights;
      this.complexion = data.mapper.complexions;
      this.smoke_list = data.mapper.smoke;
      this.drink_list = data.mapper.drink;
      this.gender_list = data.mapper.gender;
      this.bloodGroupList = data.mapper.bloodGroup;
      this.bodyTypeList = data.mapper.bodyType;
      this.foodHabitList = data.mapper.foodTypes;
      this.raasiList = data.mapper.raasi;

    },
    error=>{
      console.log(error)
    })
  }

  selectionChanged(value){
    console.log("value", value);
  }

}

