import { Component, OnInit } from '@angular/core';
import {environment}  from '../../environments/environment';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  serverUrl = environment.serverUrl
  constructor() { }

  ngOnInit() {
  }

}
