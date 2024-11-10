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

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email">
              <mat-error *ngIf="f['email'].errors?.['required']">Email is required</mat-error>
              <mat-error *ngIf="f['email'].errors?.['email']">Please enter a valid email address</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password">
              <mat-error *ngIf="f['password'].errors?.['required']">Password is required</mat-error>
              <mat-error *ngIf="f['password'].errors?.['minlength']">Must be at least 8 characters</mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" [disabled]="registerForm.invalid || loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              Register
            </button>

            <div *ngIf="error" class="error-message">{{error}}</div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
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
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = '';

    console.log('Form data:', this.registerForm.value);

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (err: Error) => {
        this.error = err.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
} 