import { Component, OnInit } from '@angular/core';
import {environment}  from '../../environments/environment';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  serverUrl = environment.serverUrl
  imageUrlArray=[this.serverUrl+'/images/p1.jpg',this.serverUrl+'/images/p2.jpg', this.serverUrl+'/images/p3.jpg', this.serverUrl+'/images/p4.jpg']

  constructor() { }

  ngOnInit() {
  }

}
