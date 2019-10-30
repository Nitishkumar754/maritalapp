import { Component, OnInit } from '@angular/core';
import {environment}  from '../../environments/environment';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  serverUrl = environment.serverUrl
  imageUrlArray=['http://localhost:4000/images/p1.jpg','http://localhost:4000/images/p2.jpg', 'http://localhost:4000/images/p3.jpg', 'http://localhost:4000/images/p4.jpg']

  constructor() { }

  ngOnInit() {
  }

}
