import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-register-status',
  templateUrl: './register-status.component.html',
  styleUrls: ['./register-status.component.css']
})
export class RegisterStatusComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  status = ''
  ngOnInit() {
  	this.status = this.route.snapshot.queryParams["status"];

  	// this.get_email_verification_status_page(this.status);
  	
  }

  get_email_verification_status_page(status){
  	if(status=='success'){
  		
  	}
  	else{
  		
  	}
  }


}
