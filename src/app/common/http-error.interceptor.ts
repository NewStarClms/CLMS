import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
  } from '@angular/common/http';
import { Injectable } from '@angular/core';
  import { Observable, throwError } from 'rxjs';
  import { retry, catchError } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
  export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
      private messageService: NotificationService,
      private authenticationService: AuthService,
      private router: Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // console.log('req', request);
      return next.handle(request)
        .pipe(
          retry(1),
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            let errorcode = 0;
            if (error?.error instanceof ErrorEvent) {
              // client-side error
              errorMessage = `Error: ${error.error.message}`;
            } else {
              errorMessage =`${error?.error?.message}`;
              // server-side error
              errorcode = error.status;
              console.log('errror-', error);
            }
            if(error.status === 401){
              console.log('20200');
              if(this.authenticationService.isExpiredToken()){
               this.authenticationService.logout();
               errorMessage = 'Login Token Expired, Please try again.';
               this.messageService.showError(errorMessage,null);
              }
              this.router.navigate(['/login']);
              errorMessage = 'Invalid Login Details, Please try again';
              this.messageService.showError(errorMessage,null);
            }else{
            this.messageService.showError(errorMessage,null);
            }
            return throwError(errorMessage);
          })
        )
    }
  }