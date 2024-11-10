import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-payment-form',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>New International Payment</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>Amount</mat-label>
            <input matInput type="number" formControlName="amount">
            <mat-error *ngIf="f['amount'].errors?.['required']">Amount is required</mat-error>
            <mat-error *ngIf="f['amount'].errors?.['min']">Amount must be greater than 0</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Currency</mat-label>
            <mat-select formControlName="currency">
              <mat-option value="USD">USD - US Dollar</mat-option>
              <mat-option value="EUR">EUR - Euro</mat-option>
              <mat-option value="GBP">GBP - British Pound</mat-option>
              <mat-option value="ZAR">ZAR - South African Rand</mat-option>
            </mat-select>
            <mat-error *ngIf="f['currency'].errors?.['required']">Currency is required</mat-error>
          </mat-form-field>

          <div formGroupName="recipientDetails">
            <mat-form-field appearance="outline">
              <mat-label>Recipient Name</mat-label>
              <input matInput formControlName="name">
              <mat-error *ngIf="f['recipientDetails'].get('name')?.errors?.['required']">
                Recipient name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Account Number</mat-label>
              <input matInput formControlName="account">
              <mat-error *ngIf="f['recipientDetails'].get('account')?.errors?.['required']">
                Account number is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>SWIFT/BIC Code</mat-label>
              <input matInput formControlName="swiftCode">
              <mat-error *ngIf="f['recipientDetails'].get('swiftCode')?.errors?.['required']">
                SWIFT code is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Bank Name</mat-label>
              <input matInput formControlName="bank">
              <mat-error *ngIf="f['recipientDetails'].get('bank')?.errors?.['required']">
                Bank name is required
              </mat-error>
            </mat-form-field>
          </div>

          <button mat-raised-button color="primary" type="submit" [disabled]="paymentForm.invalid || loading">
            <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
            Submit Payment
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 500px;
      margin: 0 auto;
    }
    button {
      margin-top: 1rem;
    }
  `]
})
export class PaymentFormComponent implements OnInit {
  paymentForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      currency: ['', Validators.required],
      recipientDetails: this.fb.group({
        name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]{2,50}$/)]],
        account: ['', [Validators.required, Validators.pattern(/^[0-9]{8,20}$/)]],
        swiftCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
        bank: ['', Validators.required]
      })
    });
  }

  get f() { return this.paymentForm.controls; }

  onSubmit() {
    if (this.paymentForm.invalid) return;

    console.log('Form data being sent:', this.paymentForm.value);
    this.loading = true;
    this.paymentService.createPayment(this.paymentForm.value)
      .subscribe({
        next: (response) => {
          console.log('Payment response:', response);
          this.snackBar.open('Payment submitted successfully', 'Close', { duration: 3000 });
          this.loading = false;
          this.router.navigate(['../history'], { relativeTo: this.route });
        },
        error: (error: HttpErrorResponse) => {
          console.log('Error response:', error);
          this.loading = false;
          if (error.status === 401) {
            this.snackBar.open('Session expired. Please login again.', 'Close', { duration: 3000 });
            this.router.navigate(['/auth/login']);
          } else {
            this.snackBar.open(error.error.message || 'Failed to submit payment', 'Close', { duration: 3000 });
          }
        }
      });
  }
} 