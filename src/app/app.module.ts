import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocialLoginModule, FacebookLoginProvider, AuthServiceConfig} from 'ng4-social-login';
import { LoginFormComponent } from './login-form/login-form.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HttpClientModule } from '@angular/common/http';

import {AuthserviceService} from './services/authservice.service';
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



const config = new AuthServiceConfig([{
	id:FacebookLoginProvider.PROVIDER_ID,
	provider: new FacebookLoginProvider('1071935582966920')
}], false);

export function provideConfig(){
	return config
}

const appRoutes: Routes = [
  { path: 'home', component: HomePageComponent, data: {} },
  { path: 'about', component: AboutComponent, data: {} },
  { path: 'matches', component: MatchesComponent, data: {} },
  { path: 'viewed_profile', component: ViewedProfileComponent, data: {} },
  { path: 'contact', component: ContactComponent, data: {} },
  { path: 'register', component: RegisterComponent, data: {} },
  { path: 'search', component: SearchComponent, data: {} },
  { path: 'profile/viewprofile', component: ViewprofileComponent, data: {} },
  {
    path: '',
    component: LoginFormComponent,
    data: { title: 'Heroes List' }
  },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: '**', component: LoginFormComponent }
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
    ViewprofileComponent

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
    SlideshowModule
  ],
  providers: [{provide:AuthServiceConfig, useFactory:provideConfig}, AuthserviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
