import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment}  from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  serverUrl = environment.serverUrl
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

  commonService(body, method, endurl){
   
    let url = this.serverUrl+"api/"+endurl;
    console.log("method", method);
    console.log("requestedUrl ", url);
    console.log("requestedBody", body);

    if(method=='get' || method=='GET'){
    	return this.http.get(url);
    }
    else{
    	return this.http.post(url, body);
    }

    
      
  }
  myLocalLoginService(body){
    console.log("body>>>>>>>>>>>>>>>1  ",body)
    return  this.http.post(this.serverUrl+"auth/login", body, {})
  }
}
