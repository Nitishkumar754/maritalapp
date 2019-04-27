import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private http: HttpClient) { }

  public _name = '';
  public _email = '';
  public _photoUrl=''
  public _user = {}
 
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

  myFacebookLoginService(body){
    console.log("body2 >>>>>>>>>>>>>> ", body)
      return this.http.get('http://localhost/api/auth/facebook');
  }
  myLocalLoginService(body){
    console.log("body>>>>>>>>>>>>>>>  ",body)
    return  this.http.post("http://localhost:4000/login", body, {})
  }


}
