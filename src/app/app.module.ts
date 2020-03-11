import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocialLoginModule, FacebookLoginProvider, AuthServiceConfig} from 'ng4-social-login';
import { LoginFormComponent } from './login-form/login-form.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {AuthserviceService} from './services/authservice.service';
import {DataService} from './services/dataservice.service';
import {MapperService} from './services/mapperservice.service';
import { HeaderComponent } from './header/header.component';
import { AboutComponent } from './about/about.component';
import { MatchesComponent } from './matches/matches.component';
import { ViewedProfileComponent } from './viewed-profile/viewed-profile.component';
import { FooterComponent } from './footer/footer.component';
import { ContactComponent } from './contact/contact.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';
import { ViewprofileComponent } from './viewprofile/viewprofile.component';
import {SlideshowModule} from 'ng-simple-slideshow';
import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';
import { InboxComponent } from './inbox/inbox.component';
import { MemberComponent } from './member/member.component';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { HttpConfigInterceptor} from './interceptor/httpconfig.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { LandingHeaderComponent } from './landing-header/landing-header.component';
import { ProfileComponent } from './profile/profile.component';
import {AgePipe} from './app.custom_pipe';
import { ImageUploadModule } from "angular2-image-upload";
import { AngularFileUploaderModule } from "angular-file-uploader";
import { SubscriptionComponent } from './subscription/subscription.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SubscriptionOrderComponent } from './subscription-order/subscription-order.component';
import { LogoutComponent } from './logout/logout.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ModalshowComponent } from './modalshow/modalshow.component';
import { SearchedresultComponent } from './searchedresult/searchedresult.component';
import {MyDatePickerModule} from 'mydatepicker';
import { TermsconditionComponent } from './termscondition/termscondition.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { FaqComponent } from './faq/faq.component';
import { ViewedContactsComponent } from './viewed-contacts/viewed-contacts.component';
import { PaginationComponent } from './pagination/pagination.component';
import { RegisterStatusComponent } from './register/register-status/register-status.component';
import { SuccessDirective } from './directives/register-success.directive';
import { RegisterFailureDirective } from './directives/register-failure.directive';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { MomentModule } from 'ngx-moment';

const config = new AuthServiceConfig([{
	id:FacebookLoginProvider.PROVIDER_ID,
	provider: new FacebookLoginProvider('1071935582966920')
}], false);

export function provideConfig(){
	return config
}

const appRoutes: Routes = [
  { path: '', component: MainComponent, data: {}, 

  children:[
  // { path: 'profile/viewprofile/:id', component: ViewprofileComponent, data: {} },
  { path: 'login', component: LoginComponent, data: {} },
  { path: 'about', component: AboutComponent, data: {} },
  { path: 'contact', component: ContactComponent, data: {} },
  { path: 'register', component: RegisterComponent, data: {} },
  { path: '', component: LandingComponent, data: {} },
  { path: 'terms', component: TermsconditionComponent, data: {} },
  { path: 'privacy', component: PrivacyComponent, data: {} },
  { path: 'faq', component: FaqComponent, data: {} },
  { path: 'register/status', component: RegisterStatusComponent, data: {} },
  { path: 'password/forgot', component: ForgotPasswordComponent, data: {} },
  { path: 'password/reset/:link', component: ResetPasswordComponent, data: {} }
  ]
},

  { path: '', component: HomePageComponent, data: {},
  children: [
      // { path: '', redirectTo: 'home', MemberComponent: 'full' },
      { path: '', component:MemberComponent, pathMatch: 'full' },
      { path: 'matches', component: MatchesComponent },
      { path: 'messages', component: InboxComponent },
      { path: 'member', component: MemberComponent },
      { path: 'upgrade', component: SubscriptionComponent },
      { path: 'subscription/order', component: SubscriptionOrderComponent },
      { path: 'checkout/:id', component: CheckoutComponent },
      { path: 'viewed_profile', component: ViewedProfileComponent },
      { path: 'viewed_contacts', component: ViewedContactsComponent },
      { path: 'search', component: SearchComponent, data: {} },
      { path: 'pay', component: CheckoutComponent, data: {} },
      { path: 'e/about', component: AboutComponent, data: {} },
      { path: 'e/contact', component: ContactComponent, data: {} },
      { path: 'e/faq', component: FaqComponent, data: {} },
      { path: 'e/terms', component: TermsconditionComponent, data: {} },
      { path: 'e/privacy', component: PrivacyComponent, data: {} },
      { path: 'e/contact', component: ContactComponent, data: {} },
      { path: 'member_profile/:id', component: ViewprofileComponent, data: {}},
      { path: 'logout', component: LogoutComponent, data: {}},
      { path: 'modal', component: ModalshowComponent, data: {}},
      { path: 'searchresult', component: SearchedresultComponent, data: {}},
      { path: 'profile', component: ProfileComponent, data: {},

      children:[

        {path:'view/:id', component:ProfileComponent, data:{}},
        {path:'view', component:ProfileComponent, data:{}},
        {path:'edit', component:MemberComponent, data:{}}
      ]
       }
    ] 
  },
  // { path: 'about', component: AboutComponent, data: {} },
  // // { path: 'matches', component: MatchesComponent, data: {} },
  // // { path: 'viewed_profile', component: ViewedProfileComponent, data: {} },
  { path: 'contact', component: ContactComponent, data: {} },
  // { path: 'register', component: RegisterComponent, data: {} },
  // // { path: 'search', component: SearchComponent, data: {} },
  // { path: 'profile/viewprofile/:id', component: ViewprofileComponent, data: {} },
  // { path: 'login', component: LoginComponent, data: {} },
  // { path: 'logout', component: MainComponent, data: {} },
  // { path: 'messages', component: InboxComponent, data: {} },
  // { path: 'member', component: MemberComponent, data: {} },
  {
    path: '',
    component: LandingComponent,
    data: { title: 'Heroes List' }
  },
  { path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  { path: '**', component: LandingComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    HomePageComponent,
    HeaderComponent,
    AboutComponent,
    MatchesComponent,
    ViewedProfileComponent,
    FooterComponent,
    ContactComponent,
    RegisterComponent,
    SearchComponent,
    ViewprofileComponent,
    LoginComponent,
    LandingComponent,
    InboxComponent,
    MemberComponent,
    MainComponent,
    LandingHeaderComponent,
    ProfileComponent,
    AgePipe,
    SubscriptionComponent,
    CheckoutComponent,
    SubscriptionOrderComponent,
    LogoutComponent,
    ModalshowComponent,
    SearchedresultComponent,
    TermsconditionComponent,
    PrivacyComponent,
    FaqComponent,
    ViewedContactsComponent,
    PaginationComponent,
    RegisterStatusComponent,
    SuccessDirective,
    RegisterFailureDirective,
    ForgotPasswordComponent,
    ResetPasswordComponent

  ],
  imports: [
  RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,
    FormsModule,
    HttpClientModule,
    SlideshowModule,
    BrowserAnimationsModule,
    ImageUploadModule.forRoot(),
    AngularFileUploaderModule,
    NgbModule,
    MyDatePickerModule,
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        'm': 59
      }
    })
  ],
  exports: [
     
  ],
  providers: [
  {provide:AuthServiceConfig, useFactory:provideConfig},
   AuthserviceService, 
   DataService,
   CookieService,
   { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
