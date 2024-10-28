import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/authentication.service';
import { AuthGuard } from './auth.gaurd';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {

  constructor(
    private router: Router,
    private authGuard: AuthGuard,
    private authService: AuthService
  ) { }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
   console.log('loggaurd');
   if (this.authService.isAuthenticated()) {
    return false;
   } else {
     return true;
   }

  }
}