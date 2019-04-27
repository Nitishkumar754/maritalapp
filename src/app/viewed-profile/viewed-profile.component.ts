import { Component, OnInit } from '@angular/core';
import {environment}  from '../../environments/environment';

@Component({
  selector: 'app-viewed-profile',
  templateUrl: './viewed-profile.component.html',
  styleUrls: ['./viewed-profile.component.css']
})
export class ViewedProfileComponent implements OnInit {
	serverUrl = environment.serverUrl

  constructor() { }

  ngOnInit() {
  }

}
