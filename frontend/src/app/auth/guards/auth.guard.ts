import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('Auth Guard Check:', {
      currentUser: this.authService.currentUserValue,
      requiredRoles: route.data['roles']
    });
    
    if (!this.authService.currentUserValue) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (route.data['roles'] && !route.data['roles'].includes(this.authService.currentUserValue.role)) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
} 