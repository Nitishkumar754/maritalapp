import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Login }    from '../login';
import  {AuthService, SocialUser, FacebookLoginProvider} from 'ng4-social-login'

import { AuthserviceService } from '../services/authservice.service'




@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(private socialAuthService:AuthService, private router: Router, private auth: AuthserviceService) { }

  ngOnInit() {
  }

  private profile:any
  private payload:any

  public user: any = SocialUser;

  powers = ['Really Smart', 'Super Flexible',
            'Super Hot', 'Weather Changer'];

  model = new Login(18, 'Dr IQ', this.powers[0], 'Chuck Overstreet');

  submitted = false;
  @Input() username: string;
  @Input() password: string;

  onSubmit() { this.submitted = true; }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

  // facebookLogin(){
  // 	this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((userData)=>{
  // 		this.user = userData
  // 		console.log("this.user>>>>>>>>>>>>>> ",this.user)
  //     this.auth._name= "nitish kumar";
  //     this.auth._email = this.user.email;
  //     this.auth._user = this.user;
  //     this.auth._photoUrl = this.user.photoUrl;
      
  //     this.auth.myFacebookLoginService({"request_body":userData})
  //   .subscribe((data: any) => this.profile = {

  //       message: data['message']
       
  //   });

  // 		this.router.navigateByUrl('/home');
  		
  // 	})
  // }

  // fbLogin(){
  //   this.auth.myFacebookLoginService({

  //   })
  //   .subscribe((data:any)=> {
  //     console.log("data>>>>>>>>>>>>>>>>>>> ", data)
  //     message:data['message']
  //   },error=>{
  //     console.log("got error>>>>>>>>>>>>>>>>>>>>", error)
  //   });

  // }


  localLogin(){
    console.log("username>>>>>>>>>>>>>>>>>>>> ", this.username)
    console.log("password>>>>>>>>>>>>>>>>>>>> ", this.password)
    this.payload = {"username":this.username, "password": this.password}
    this.auth.myLocalLoginService(this.payload)
    .subscribe((data:any)=>{
      console.log("data>>>>>>>>>>>>>>>>> ", data)
      
      
      if(data && data.status==true){
        console.log("reidirecting.....")
        this.router.navigate(['home']);
      }
    },
    error=>{
      console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
    })
  }

  values = '';
  onKey(value: string) {
    this.values += value + ' | ';
  }

}


