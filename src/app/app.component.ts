import { Component } from '@angular/core';
import  {AuthService, SocialUser, FacebookLoginProvider} from 'ng4-social-login'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Shaadikarlo';
  public user: any = SocialUser;
  constructor(private socialAuthService:AuthService){}

  facebookLogin(){
  	this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((userData)=>{
  		this.user = userData
  		console.log("this.user>>>>>>>>>>>>>> ",this.user)
  	})
  }

}
