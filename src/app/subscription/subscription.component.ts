import { Component, OnInit } from '@angular/core';
import {CommonService} from '../common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  subscriptions = [];
  constructor( private common: CommonService, private router:Router) { }

  ngOnInit() {

  	this.get_all_subscription();
  }

  get_all_subscription(){
    
    this.common.commonService({}, "GET", "subscription/all")
    .subscribe((data:any)=>{
      this.subscriptions = data.subscriptions
      
    },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
    })
  }

  go_to_checkout_page(subscription_id){
  	
  		this.router.navigateByUrl(`checkout/${subscription_id}`)
  		// this.router.navigate(['checkout']);
  }


}
