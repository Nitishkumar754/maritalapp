import { Component, OnInit } from '@angular/core';

import { WindowRef } from '../../windowRef.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [WindowRef]
})
export class CheckoutComponent implements OnInit {

  constructor(private winRef: WindowRef) { }

  ngOnInit() {
  }


  payWithRazor(){ 
      let options:any = {
          "key": "rzp_test_0TDe2Q1HQmkcZ2",
          "amount": 100,
          "name": "Company Name",
          "description": "dummy data",
          "image": "./assets/images/logo.png",
          "modal": {
            "escape": false
          }, 
          "prefill": {
            "name": "Nitish Kumar",
            "contact": "9020912410",
            "email": "nitish@fisdom.com",
            "method": 'card',
            'card[number]': "5104015555555558",
            'card[expiry]': "12/2020",
            'card[cvv]': "123"
          },
          "notes": {
            "address": "my address"
          },
          "theme": {
            "color": "#6fbc29"
          }
        };
        options.handler = ((response) => {
            options['payment_response_id'] = response.razorpay_payment_id;
            // this.paymentService.payWithRazor({cart: {}, payment: options});
        });
        options.modal.ondismiss = (() => {
            // this.loginService.SetLoader = false;
        });
        let rzp = new this.winRef.nativeWindow.Razorpay(options);
        rzp.open();
    }  

}
