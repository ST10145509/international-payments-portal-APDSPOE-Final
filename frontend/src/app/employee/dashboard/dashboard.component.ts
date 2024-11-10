import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-employee-dashboard',
  template: `
    <mat-sidenav-container>
      <mat-sidenav mode="side" opened>
        <mat-nav-list>
          <a mat-list-item routerLink="verify" routerLinkActive="active">
            <mat-icon>verified_user</mat-icon>
            Verify Transactions
          </a>
          <a mat-list-item routerLink="swift" routerLinkActive="active">
            <mat-icon>send</mat-icon>
            SWIFT Submissions
          </a>
          <a mat-list-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            Logout
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span>Employee Portal - International Payments</span>
          <span class="spacer"></span>
          <span>{{currentUser?.fullName}}</span>
        </mat-toolbar>

        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    mat-sidenav-container {
      height: 100vh;
    }
    mat-sidenav {
      width: 250px;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .content {
      padding: 20px;
    }
    .active {
      background-color: rgba(0,0,0,0.1);
    }
  `]
})
export class EmployeeDashboardComponent implements OnInit {
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      console.log('EmployeeDashboard user subscription:', user);
      this.currentUser = user;
      
      if (user === null || (user && user.role !== 'employee')) {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
} 