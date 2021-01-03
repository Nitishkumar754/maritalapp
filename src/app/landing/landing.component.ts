import { Component, OnInit, ViewChild } from '@angular/core';
import {environment}  from '../../environments/environment';
import {CommonService} from '../common.service';
import {NgForm} from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  title = 'Bihar Matrimony, Shaadi, Marriage, Free Matrimonial Sites, Match Making, Bride Groom'
  serverUrl = environment.serverUrl
  imageUrlArray=[this.serverUrl+'/images/p1.jpg',this.serverUrl+'/images/p2.jpg', this.serverUrl+'/images/p3.jpg', this.serverUrl+'/images/p4.jpg']

  constructor(private common:CommonService, private titleService: Title, private metaService: Meta) { }

  @ViewChild('f') guestForm:NgForm
  search_query = {};
  gender = '';
  min_age = '';
  max_age = '';
  state = '';
  ngOnInit() {

     this.titleService.setTitle(this.title);
    this.metaService.addTags([
      {name: 'keywords', content: 'Matrimonial search, caste search, groom search, bride search, best matrimony finder, shaadi, Bride Personal, Groom Personals, Indian matchmaking, India dating websites, marriage Services, marriage Bureau, matchmaking bureau, vivaah, shaadi com'},
      {name: 'description', content: 'Keyword Search - Find Indian, Bihar Matrimonials for Marriage by keywords, caste search(e.g. koeri, dangi, kurmi, kushwaha, yadav, engineer, doctor) at shaadikarlo.in'},
      {name: 'robots', content: 'index, follow'}
    ]);
    this.get_profiles_for_guest();

  }

  profiles = [];

  get_profiles_for_guest(){

  this.search_query = this.guestForm.form.value.searchData;
  	console.log("search_query is>>>>>>>>> ",this.search_query);
  	this.common.commonService(this.search_query, "POST", "profile/guest/search")
    .subscribe((data:any)=>{
      console.log("data>>>>>>>>>>>>>>>>> ", data)
      this.profiles = data.profiles
      
    },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
    })


  }

}
