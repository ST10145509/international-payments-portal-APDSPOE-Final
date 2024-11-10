import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-customer-dashboard',
  template: `
    <mat-sidenav-container>
      <mat-sidenav mode="side" opened>
        <mat-nav-list>
          <a mat-list-item routerLink="new-payment" routerLinkActive="active">
            <mat-icon>payment</mat-icon>
            New Payment
          </a>
          <a mat-list-item routerLink="history" routerLinkActive="active">
            <mat-icon>history</mat-icon>
            Transaction History
          </a>
          <a mat-list-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            Logout
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span>International Payments Portal</span>
          <span class="spacer"></span>
          <span>Welcome, {{currentUser?.fullName}}</span>
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
    mat-nav-list a {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .active {
      background-color: rgba(0,0,0,0.1);
    }
  `]
})
export class CustomerDashboardComponent implements OnInit {
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      console.log('CustomerDashboard user subscription:', user);
      this.currentUser = user;
      
      if (user === null || (user && user.role !== 'customer')) {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }
} 