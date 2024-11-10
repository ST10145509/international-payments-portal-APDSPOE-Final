import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  template: `
    <div class="welcome-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Welcome to International Payments Portal</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div class="welcome-message">
            <mat-icon>public</mat-icon>
            <p>Your trusted platform for secure international money transfers</p>
            <p class="subtitle">Fast, secure, and reliable payments across borders</p>
          </div>

          <div class="action-buttons">
            <button mat-raised-button color="primary" (click)="navigate('login')">
              <mat-icon>login</mat-icon>
              Login
            </button>
            <button mat-raised-button color="accent" (click)="navigate('register')">
              <mat-icon>person_add</mat-icon>
              Register
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .welcome-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background: linear-gradient(135deg, #1976d2 0%, #64b5f6 100%);
    }

    mat-card {
      max-width: 500px;
      width: 100%;
      margin: 20px;
      text-align: center;
    }

    .welcome-message {
      padding: 40px 20px;
      color: #333;
    }

    .welcome-message mat-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #1976d2;
      margin-bottom: 20px;
    }

    .welcome-message p {
      font-size: 1.2rem;
      margin: 10px 0;
    }

    .welcome-message .subtitle {
      color: #666;
      font-size: 1rem;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-top: 20px;
    }

    .action-buttons button {
      width: 150px;
      height: 45px;
    }

    button mat-icon {
      margin-right: 8px;
    }
  `]
})
export class WelcomeComponent {
  constructor(private router: Router) {}

  navigate(route: string) {
    this.router.navigate([`/auth/${route}`]);
  }
} 