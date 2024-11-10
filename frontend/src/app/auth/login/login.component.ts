import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Account Number</mat-label>
              <input matInput formControlName="accountNumber" type="text">
              <mat-icon matPrefix>account_circle</mat-icon>
              <mat-error *ngIf="f['accountNumber'].errors?.['required']">
                Account number is required
              </mat-error>
              <mat-error *ngIf="f['accountNumber'].errors?.['pattern']">
                Please enter a valid account number
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
              <mat-icon matPrefix>lock</mat-icon>
              <mat-icon matSuffix (click)="hidePassword = !hidePassword">
                {{hidePassword ? 'visibility_off' : 'visibility'}}
              </mat-icon>
              <mat-error *ngIf="f['password'].errors?.['required']">
                Password is required
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-raised-button color="primary" [disabled]="loginForm.invalid || loading">
                <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
                <span>Login</span>
              </button>
              <a mat-button routerLink="/auth/register">Need an account? Register</a>
            </div>

            <div *ngIf="error" class="error-message">{{error}}</div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background-color: #f5f5f5;
    }

    mat-card {
      max-width: 400px;
      width: 100%;
      margin: 20px;
    }

    mat-card-header {
      margin-bottom: 20px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    mat-form-field {
      width: 100%;
    }

    .form-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
      margin-top: 16px;
    }

    .form-actions button {
      width: 200px;
      height: 40px;
    }

    .form-actions a {
      color: #666;
    }

    .error-message {
      text-align: center;
      color: #f44336;
      margin-top: 16px;
    }

    mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';
  returnUrl!: string;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      accountNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', Validators.required]
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      
      this.authService.login(credentials.accountNumber, credentials.password).subscribe({
        next: (user) => {
          console.log('Login successful:', user);
          // Navigate based on role and wait for navigation to complete
          const route = user.role === 'employee' ? '/employee/dashboard' : '/customer/dashboard';
          this.router.navigate([route]).then(() => {
            // Navigation complete
            console.log('Navigation complete');
          });
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.error = 'Invalid credentials';
        }
      });
    }
  }
} 