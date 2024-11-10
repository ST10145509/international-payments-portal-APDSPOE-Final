import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Register</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="fullName">
              <mat-error *ngIf="f['fullName'].errors?.['required']">Full name is required</mat-error>
              <mat-error *ngIf="f['fullName'].errors?.['pattern']">Only letters and spaces allowed</mat-error>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>ID Number</mat-label>
                <input matInput formControlName="idNumber">
                <mat-error *ngIf="f['idNumber'].errors?.['required']">ID number is required</mat-error>
                <mat-error *ngIf="f['idNumber'].errors?.['pattern']">Must be exactly 13 digits</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Account Number</mat-label>
                <input matInput formControlName="accountNumber">
                <mat-error *ngIf="f['accountNumber'].errors?.['required']">Account number is required</mat-error>
                <mat-error *ngIf="f['accountNumber'].errors?.['pattern']">Must be exactly 10 digits</mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email">
              <mat-error *ngIf="f['email'].errors?.['required']">Email is required</mat-error>
              <mat-error *ngIf="f['email'].errors?.['email']">Please enter a valid email address</mat-error>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput type="password" formControlName="password">
                <mat-error *ngIf="f['password'].errors?.['required']">Password is required</mat-error>
                <mat-error *ngIf="f['password'].errors?.['minlength']">Must be at least 8 characters</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Confirm Password</mat-label>
                <input matInput type="password" formControlName="confirmPassword">
                <mat-error *ngIf="f['confirmPassword'].errors?.['required']">Confirm password is required</mat-error>
                <mat-error *ngIf="f['confirmPassword'].errors?.['passwordMismatch']">Passwords do not match</mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-raised-button color="primary" [disabled]="registerForm.invalid || loading">
                <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
                <span>Register</span>
              </button>
              <a mat-button routerLink="/auth/login">Already have an account? Login</a>
            </div>

            <div *ngIf="error" class="error-message">{{error}}</div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background-color: #f5f5f5;
    }

    mat-card {
      max-width: 600px;
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

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }
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
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,50}$')]],
      idNumber: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
      accountNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = '';

    const registrationData = { ...this.registerForm.value };
    delete registrationData.confirmPassword;

    console.log('Form data:', registrationData);

    this.authService.register(registrationData).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (err: Error) => {
        this.error = err.message || 'Registration failed';
        this.loading = false;
      }
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    return null;
  }
} 