import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment}  from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private http: HttpClient) { }

  public _name = '';
  public _email = '';
  public _photoUrl=''
  public _user = {}
  public data : any
  public token : '';

  serverUrl = environment.serverUrl
 
  set name(name: string) {
    this._name = (name && name.trim()) || '<no name set>';
  }
 
  get name(): string { return this._name; }

  set user(user:any){
  	this._user = user || {}
  }

  get user(): any {return this._user;}


  set photoUrl(photoUrl: string) {
    this._photoUrl = photoUrl || ''
  }
 
  get photoUrl(): string { return this._photoUrl; }


  // set addToken(tokenValue) {
  //     this.token = tokenValue;
  // }

  // get getToken() {

  //     return this.token;
  // }


  myFacebookLoginService(body){
    console.log("body2 >>>>>>>>>>>>>> ", body)
      return this.http.get(this.serverUrl+'api/auth/facebook');
  }

  myLocalLoginService(body){
    console.log("body1>>>>>>>>>>>>>>>  ",body)
    return this.http.post(this.serverUrl+"auth/login", body, {})
  //    .subscribe((data:any)=>{
  //     console.log("data>>>>>>>>>>>>>>>>> ", data)
  //     if(data && data.hasOwnProperty('token')){
  //       var Token = data.token
  //       localStorage.setItem('MAtoken', JSON.stringify({ token: Token }));
  //       var currentUser = JSON.parse(localStorage.getItem('MAtoken'));
  //       return true
  //     }
  //     return false
  // },
  //   error=>{
  //     console.log("error is >>>>>>>>>>>>>>>>>>> ", error)
  //     return false
  //   })
}


registerService(body){
  console.log("register body>>>>>>>>>>>>> ",body);
  return this.http.post(this.serverUrl+"api/user/register", body, {})
 
}

verifyOtp(body){
  
  return this.http.post(this.serverUrl+"api/user/verifyOtp", body, {})
 
}



}



// import { Pipe, PipeTransform } from '@angular/core';
// import * as moment from 'moment';
// @Pipe({
//     name: 'age'
// })
// export class AgePipe implements PipeTransform {

//     transform(value: Date): string {
//         let today = moment();
//                 let birthdate = moment(value);
//                 let years = today.diff(birthdate, 'years');
//                 let html:string = years + " yr ";

//                 html += today.subtract(years, 'years').diff(birthdate, 'months') + " mo";

//         return html;
//     }

// }