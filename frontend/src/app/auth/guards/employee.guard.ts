import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.role === 'employee') {
      return true;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }
} 