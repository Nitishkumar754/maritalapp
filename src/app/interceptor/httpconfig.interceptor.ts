import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpHeaders,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// import {CookieService} from 'angular2-cookie/core';
import { CookieService } from 'ngx-cookie';

import { Router } from '@angular/router';
import * as moment from 'moment';


@Injectable({
    providedIn: 'root'
})
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private _cookieService:CookieService, private router: Router) { }

    getCookie(key: string){
    return this._cookieService.get(key);
  	}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const token: string = localStorage.getItem('token');
        let token: string = this._cookieService.get('token');

         let expireTime = moment().add(1, 'months').toDate();

        if(!token){
            token = window.localStorage.getItem('token');
        }
        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        }

        // if (!request.headers.has('Content-Type')) {
        //     request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        // }


        request = request.clone({ headers: request.headers.set('Accept', 'application/json')});

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event.body);
                    // this.errorDialogService.openDialog(event);

                    if (event.body.token){
                    	this._cookieService.put('token', event.body.token, {expires:expireTime});
                        window.localStorage.setItem('token', event.body.token);
                    }
                    
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
            	console.log("response error>>>>>>>>>>>>>>> ",error);
            	if(error.status===401){
            		this._cookieService.remove('token');
            		this.router.navigate(['login']);
            	}
                let data = {};
                data = {
                    reason: error && error.error && error.error.reason ? error.error.reason : '',
                    status: error.status
                };
                // this.errorDialogService.openDialog(data);
                return throwError(error);
            }));
    }
}