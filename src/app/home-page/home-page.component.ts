import { Component, OnInit } from '@angular/core';
import  { AuthserviceService } from '../services/authservice.service'
import {environment}  from '../../environments/environment';




@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  profileImage = ''
  serverUrl = environment.serverUrl

  constructor(private auth:AuthserviceService) { }

  ngOnInit() {
  	console.log(this.auth._name)
  	console.log(this.auth._email)
  	console.log(this.auth._photoUrl)

  	this.profileImage = this.auth._photoUrl
  	

  }


}
