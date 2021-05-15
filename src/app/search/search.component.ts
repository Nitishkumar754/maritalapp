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

  //height Search
  min_height_list = [];
  max_height_list = [];
  min_height_config = {};
  max_height_config = {};
  maxHeight = '';
  minHeight = '';

  //age
  min_age_config = {};
  max_age_config = {};
  min_age_list_dropdown = [];
  max_age_list_dropdown = [];
  minAge = '';
  maxAge = '';

  //religion
  religion_search_list = [];
  religion_config = {};
  search_religion= ''
  //caste
  caste_search_list = [];
  caste_config = {};
  search_caste = '';

  //state
  state_search='';
  state_config = {};
  //district
  district_search ='';
  districtsObj = {};
  district_list = [];
  district_config = {};

  //occupation
  occupation_list = [];
  occupation_search="";
  occupation_config={};
  //education
  education_list = [];
  education_search='';
  education_config={};
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


    this.min_height_list = this.mapperservice.min_height_list_dropdown;   
    this.max_height_list = this.mapperservice.max_height_list_dropdown;
    this.min_age_list_dropdown = this.mapperservice.min_age_list_dropdown;
    this.max_age_list_dropdown = this.mapperservice.max_age_list_dropdown;
    this.religion_search_list = this.mapperservice.religion_search_list;
    this.caste_search_list = this.mapperservice.caste_search_list;
    this.districtsObj = this.mapperservice.state_district;
    // this.district_list = this.districtsObj["states"].map(function(value, index){
    //   return value.districts;
    // })

    
    this.getMapper();
    



    for(let i=0;i< this.districtsObj["states"].length;i++){
      // console.log("states", this.districtsObj["states"][i].districts)
      for(let j=0;j<this.districtsObj["states"][i].districts.length;j++){
        this.district_list.push({id:this.districtsObj["states"][i].districts[j], 
          value:this.districtsObj["states"][i].districts[j],
          district:this.districtsObj["states"][i].districts[j]
        })
      }
    }
    // console.log("district_list", this.district_list);
    // this.district_list = 
    this.min_height_config = {
        displayFn:(item: any) => { return item.minHeight; }, //to support flexible text displaying for each item
        displayKey:"description", //if objects array passed which key to be displayed defaults to description
        search:true, //true/false for the search functionlity defaults to false,
        height: '300px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
        placeholder:'Min Height', // text to be displayed when no item is selected defaults to Select,
        customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
        limitTo: 0, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
        moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
        noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
        searchPlaceholder:'Search', // label thats displayed in search input,
        searchOnKey: 'text', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
        clearOnSelection: false, // clears search criteria when an option is selected if set to true, default is false
        inputDirection: 'ltr' // the direction of the search input can be rtl or ltr(default)
      }


      this.max_height_config = {
        displayFn:(item: any) => { return item.maxHeight; }, 
        displayKey:"description", 
        search:true, 
        height: '300px', 
        placeholder:'Max Height', 
        customComparator: ()=>{}, 
        limitTo: 0, 
        moreText: 'more', 
        noResultsFound: 'No results found!',
        searchPlaceholder:'Search', 
        searchOnKey: 'text', 
        clearOnSelection: false, 
        inputDirection: 'ltr' 
      }

      this.min_age_config = {
        displayFn:(item: any) => { return item.minAge; }, 
        displayKey:"description", 
        search:true, 
        height: '300px',
        placeholder:'Min Age', 
        customComparator: ()=>{}, 
        limitTo: 0, 
        moreText: 'more', 
        noResultsFound: 'No results found!', 
        searchPlaceholder:'Search', 
        searchOnKey: 'minAge', 
        clearOnSelection: false, 
        inputDirection: 'ltr' 
      }

      this.max_age_config = {
        displayFn:(item: any) => { return item.maxAge; }, 
        displayKey:"description", 
        search:true, 
        height: '300px', 
        placeholder:'Max Age', 
        customComparator: ()=>{}, 
        limitTo: 0, 
        moreText: 'more', 
        noResultsFound: 'No results found!', 
        searchPlaceholder:'Search', 
        searchOnKey: 'text', 
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

      this.state_config = {
        displayFn:(item: any) => { return item.state; }, 
        displayKey:"description", 
        search:true, 
        height: '300px', 
        placeholder:'State', 
        customComparator: ()=>{}, 
        limitTo: 0, 
        moreText: 'more', 
        noResultsFound: 'No results found!', 
        searchPlaceholder:'Search', 
        searchOnKey: 'state', 
        clearOnSelection: false, 
        inputDirection: 'ltr' 
      }

      this.district_config = {
        displayFn:(item: any) => { return item.district; }, 
        displayKey:"description", 
        search:true, 
        height: '300px', 
        placeholder:'District', 
        customComparator: ()=>{}, 
        limitTo: 0, 
        moreText: 'more', 
        noResultsFound: 'No results found!', 
        searchPlaceholder:'Search', 
        searchOnKey: 'district', 
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
  console.log("searchQuery ",this.searchQueryObj);

  	console.log("query_data ",query_data);

  	this.router.navigate(['searchresult'],{ queryParams: this.searchQueryObj });
  	
  	
  }

  selected_state_name(){
 
    var mystate_code = this.searchForm.form.value.queryData.state;
    console.log("mystate_code>>>>>>>>>>> ",mystate_code);
    var state_district = this.mapperservice.state_district;
    for (let [key, value] of Object.entries(state_district['states'])) {
    if(value['state_code']==mystate_code){

      this.districts = value['districts']

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

  isDisabled = true;

  toggleDisabled() {
    this.isDisabled = !this.isDisabled;
  }
  nextPage(){
    
  }

previousPage:any


    loadPage(page: number) {
     alert(page);
    var query = {pageNumber:page-1, pageCount:10}
    if (page !== this.previousPage) {
      this.previousPage = page;
      // this.loadData(page);
      // this.getMembers(query);
    }
  }


  searchQueryObj = {};

  selectionChanged(search){
    search = search.value;

    if(search && search["state"]){
      this.searchQueryObj["state"] = search.key;
    }

    if(search && search["district"]){
      this.searchQueryObj["district"] = search.id;
    }
    if(search["minAge"]) this.searchQueryObj["minAge"] = search["minAge"];
    
    if(search["maxAge"]) this.searchQueryObj["maxAge"] = search["maxAge"];

    if(search["minHeight"]) this.searchQueryObj["minHeight"] = search["minHeight"];
    
    if(search["maxHeight"]) this.searchQueryObj["maxHeight"] = search["maxHeight"];

    if(search["religion"]) this.searchQueryObj["religion"] = search["religion"];

    if(Array.isArray(search)){
      if(search[0].caste) this.searchQueryObj["caste"] = search.map(obj=> obj.id)
      if(search[0].district) this.searchQueryObj["district"] = search.map(obj=> obj.id.toLowerCase())
      if(search[0].education) this.searchQueryObj["education"] = search.map(obj=> obj.key)
      if(search[0].occupation) this.searchQueryObj["occupation"] = search.map(obj=> obj.key)

    }
    if(search["state"]) this.searchQueryObj["state"] = search["key"];


    console.log("searchQueryObj", this.searchQueryObj);

  }


  getMapper(){
    this.common.commonService({education:true, occupation:true}, "POST", "common/getMapper")
    .subscribe((data:any)=>{
      this.education_list = data.mapper.education;
      this.occupation_list = data.mapper.occupation;
    },
    error=>{
      console.log(error)
    })
  }
}