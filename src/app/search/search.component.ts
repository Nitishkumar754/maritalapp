import { Component, OnInit } from '@angular/core';
import {CommonService} from '../common.service';
import {DataService} from '../services/dataservice.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})


export class SearchComponent implements OnInit {

  searched_profile = [];
  constructor(private common:CommonService, private dataservice:DataService, private router:Router) { }

  ngOnInit() {
  }

  search_query = {}
  query_params = {}

  userRegularSearch(){
  	console.log("search_query>>>>>>>>>>>>>> ",this.search_query);

  	this.router.navigate(['searchresult'],{ queryParams: this.search_query });
  	
  	
  }

}
