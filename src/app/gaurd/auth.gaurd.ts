import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/authentication.service';
import { UI_CONSTANT } from '../common/constants/ui-constants';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUserToken = this.authenticationService.currentUserToken;
        if (currentUserToken) {
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { [UI_CONSTANT.ConstValue.ReturnUrl]: state.url }});
        return false;
    }
}