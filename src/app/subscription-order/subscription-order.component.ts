import { Component, OnInit } from '@angular/core';
import {CommonService} from '../common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-order',
  templateUrl: './subscription-order.component.html',
  styleUrls: ['./subscription-order.component.css']
})
export class SubscriptionOrderComponent implements OnInit {

  constructor(private common: CommonService, private router:Router) { }
  subscription_orders = [];
  ngOnInit() {
  	this.get_subscription_orders();
  }

  get_subscription_orders(){
    
    this.common.commonService({}, "GET", "subscription/order/mine")
    .subscribe((data:any)=>{
      this.subscription_orders = data.subscription_order
      console.log("subscription_orders>>>>>>>>>>>>> ", this.subscription_orders);
      
    },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
    })
  }
}
