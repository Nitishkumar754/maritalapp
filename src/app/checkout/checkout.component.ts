import { Component, OnInit } from '@angular/core';

import { WindowRef } from '../../windowRef.service';
import {CommonService} from '../common.service';
import {Router, ActivatedRoute }  from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [WindowRef]
})
export class CheckoutComponent implements OnInit {

  subscription:any;
  constructor(private winRef: WindowRef, private common:CommonService, private route: ActivatedRoute,
  private router: Router) { }

  successMessage = '';
  errorMessage = '';
  suggestionMessage = 'Click Free subscription button to get promotional plan';
  
  ngOnInit() {

  	 this.route.params.subscribe(params => {
   		const subscription_id = params['id'];
   		this.getSubscription(subscription_id);
   })
  }


  getSubscription(subs_id){

  	this.common.commonService({}, "GET", "subscription/"+subs_id)
    .subscribe((data:any)=>{
      this.subscription = data.subscription
    },
    error=>{
      console.log(error)
    })

  }


  makePayment(subs_id){ 
  	this.common.commonService({'subscription_id':subs_id}, "POST", "paymenttransaction/create")
    .subscribe((data:any)=>{
      // this.members = data.data

      	var user = data.data.user;
      	var subscription = data.data.subscription
      	var payment = data.data.razorpay_data
      	 let options:any = {
          "key": "rzp_test_0TDe2Q1HQmkcZ2",
          "amount": payment.amount,
          "name": user.name,
          "order_id":payment.id,
          "description": "dummy data",
          "image": "./assets/images/logo.png",
          "modal": {
            "escape": false
          }, 
          "prefill": {
            "name": user.name,
            "contact": user.mobile_number,
            "email": user.email,
            // "method": 'card',
            // 'card[number]': "5104015555555558",
            // 'card[expiry]': "12/2020",
            // 'card[cvv]': "123"
          },
          "notes": {
            "address": "my address"
          },
          "theme": {
            "color": "#6fbc29"
          }
        };
        options.handler = ((response) => {
        	console.log("this is payment response>>>>>>>>>>>>>>>>>>>> ", response);
            options['payment_response_id'] = response.razorpay_payment_id;
            // this.common.payWithRazor({cart: {}, payment: options});

            this.common.commonService(response, "POST", "paymenttransaction/verify/payment")
		    .subscribe((data:any)=>{
		      console.log("subscription data>>>>>>>>>>>>>>>>> ", data)
		      this.subscription = data.subscription
		    },
		    error=>{
		      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
		    })

        });
        options.modal.ondismiss = (() => {
            // this.loginService.SetLoader = false;
        });
        let rzp = new this.winRef.nativeWindow.Razorpay(options);
        rzp.open();

    },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
    })
  }

    //   let options:any = {
    //       "key": "rzp_test_0TDe2Q1HQmkcZ2",
    //       "amount": 100,
    //       "name": "Company Name",
    //       "description": "dummy data",
    //       "image": "./assets/images/logo.png",
    //       "modal": {
    //         "escape": false
    //       }, 
    //       "prefill": {
    //         "name": "Nitish Kumar",
    //         "contact": "9020912410",
    //         "email": "nitish@fisdom.com",
    //         "method": 'card',
    //         'card[number]': "5104015555555558",
    //         'card[expiry]': "12/2020",
    //         'card[cvv]': "123"
    //       },
    //       "notes": {
    //         "address": "my address"
    //       },
    //       "theme": {
    //         "color": "#6fbc29"
    //       }
    //     };
    //     options.handler = ((response) => {
    //         options['payment_response_id'] = response.razorpay_payment_id;
    //         // this.paymentService.payWithRazor({cart: {}, payment: options});
    //     });
    //     options.modal.ondismiss = (() => {
    //         // this.loginService.SetLoader = false;
    //     });
    //     let rzp = new this.winRef.nativeWindow.Razorpay(options);
    //     rzp.open();
    // } 


   
    freeSubscription(subs_id){
      this.successMessage = '';
      this.errorMessage = '';
      this.common.commonService({subs_id:subs_id}, "POST", "subscription/order/create/promotional/order")
        .subscribe((data:any)=>{
          console.log("subscription>>>>>>>>>>>>>>>>> ", data)
          this.successMessage = data.message;
          this.suggestionMessage  = '';
          setTimeout(()=>{
            this.router.navigate(['subscription/order']);
          },3000)
          

        },
        error=>{
          console.log("error is >>>>>>>>>>>>>>>>>>> ", error);
          this.errorMessage = error.error.message;
          this.suggestionMessage = '';

        })
    }
}
