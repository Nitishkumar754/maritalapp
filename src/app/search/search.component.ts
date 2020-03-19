import { Component, OnInit, ViewChild } from '@angular/core';
import {CommonService} from '../common.service';
import {DataService} from '../services/dataservice.service';
import {Router} from '@angular/router';
import {MapperService} from '../services/mapperservice.service';
import {NgForm} from '@angular/forms';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})


export class SearchComponent implements OnInit {

  searched_profile = [];
  indian_state = [];
  districts = [];
  caste_list = [];
  religion = [];

  //dropdown related
  marital_status_list = [];
  dropdownSettings = {}; 
  selectedItems = [];

  @ViewChild('f') searchForm:NgForm

  constructor(private common:CommonService, private dataservice:DataService, private router:Router, private mapperservice:MapperService) { }

  ngOnInit() {
    this.indian_state = this.mapperservice.state;
    this.districts = this.mapperservice.state_district['states']['3']['districts'];
    this.caste_list = this.mapperservice.caste;
    this.religion = this.mapperservice.religion;

    this.marital_status_list = this.mapperservice.marital_list;
  
    this.dropdownSettings = { 
                                  singleSelection: false, 
                                  text:"Select Marital Status",
                                  selectAllText:'Select All',
                                  unSelectAllText:'UnSelect All',
                                  enableSearchFilter: true,
                                  classes:"myclass custom-class"
                                };   

  }


  search_query = {}
  query_params = {}
  searchQuery = {}

  userRegularSearch(){
    console.log("form_data>>>>>>>> ",this.searchForm.form.value)
    var query_data = this.searchForm.form.value.queryData;
     
     for (let [key, value] of Object.entries(query_data)) {
       
       if(key == 'marital_status'){
         this.searchQuery[key] = []
        
         for(var i=0;i<Object.keys(value).length;i++){
           this.searchQuery[key].push(value[i].id)
          
         }

       }
       else{
         if(value){
         this.searchQuery[key]=value;
         }
       }
      
}
  console.log("searchQuery>>>>>>>>>>> ",this.searchQuery);

  	console.log("query_data>>>>>>>>>>>>>> ",query_data);

  	this.router.navigate(['searchresult'],{ queryParams: this.searchQuery });
  	
  	
  }

  selected_state_name(){
 
    console.log(" this.searchForm>>>>>>>>> ", this.searchForm);
    var mystate_code = this.searchForm.form.value.queryData.state;
    console.log("mystate_code>>>>>>>>>>> ",mystate_code);
    var state_district = this.mapperservice.state_district;
    for (let [key, value] of Object.entries(state_district['states'])) {
    if(value['state_code']==mystate_code){

      this.districts = value['districts']
        console.log("districts>>>>>>>> ",this.districts);

  }
  }

}


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

}