import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { Transaction } from '../../shared/models/transaction.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth/services/auth.service';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-transaction-verification',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Pending Transactions</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div *ngIf="loading" class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>

        <div *ngIf="!loading && transactions.length === 0" class="no-transactions">
          <mat-icon>info</mat-icon>
          <p>No pending transactions to verify</p>
        </div>

        <mat-accordion *ngIf="!loading && transactions.length > 0">
          <mat-expansion-panel *ngFor="let transaction of transactions">
            <mat-expansion-panel-header>
              <mat-panel-title>
                {{transaction.amount | currency:transaction.currency:'symbol-narrow'}}
              </mat-panel-title>
              <mat-panel-description>
                {{transaction.recipientDetails.name}} - {{transaction.createdAt | date:'medium'}}
              </mat-panel-description>
            </mat-expansion-panel-header>

            <div class="transaction-details">
              <div class="detail-grid">
                <div class="detail-item">
                  <strong>Sender:</strong>
                  {{transaction.customerId.fullName}}
                </div>
                <div class="detail-item">
                  <strong>Account Number:</strong>
                  {{transaction.customerId.accountNumber}}
                </div>
                <div class="detail-item">
                  <strong>Recipient Bank:</strong>
                  {{transaction.recipientDetails.bank}}
                </div>
                <div class="detail-item">
                  <strong>SWIFT Code:</strong>
                  {{transaction.recipientDetails.swiftCode}}
                </div>
                <div class="detail-item">
                  <strong>Recipient Account:</strong>
                  {{transaction.recipientDetails.account}}
                </div>
              </div>

              <mat-form-field class="full-width">
                <mat-label>Verification Notes</mat-label>
                <textarea matInput [(ngModel)]="transaction.verificationNotes" 
                          placeholder="Add any verification notes here..."></textarea>
              </mat-form-field>

              <div class="action-buttons">
                <button mat-raised-button color="primary" 
                        (click)="verifyTransaction(transaction._id, true)"
                        [disabled]="transaction.processing">
                  <mat-icon>check</mat-icon>
                  Approve
                </button>
                <button mat-raised-button color="warn"
                        (click)="verifyTransaction(transaction._id, false)"
                        [disabled]="transaction.processing">
                  <mat-icon>close</mat-icon>
                  Reject
                </button>
              </div>
            </div>
          </mat-expansion-panel>
        </mat-accordion>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    .no-transactions {
      text-align: center;
      padding: 20px;
      color: rgba(0,0,0,0.54);
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }
    }
    .transaction-details {
      padding: 16px 0;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 16px;
    }
    .detail-item {
      strong {
        display: block;
        color: rgba(0,0,0,0.54);
      }
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
    }
  `]
})
export class TransactionVerificationComponent implements OnInit {
  transactions: Transaction[] = [];
  loading = false;

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser.pipe(
      filter(user => user !== null && user.role === 'employee'),
      take(1)
    ).subscribe(() => {
      this.loadPendingTransactions();
    });
  }

  loadPendingTransactions() {
    this.loading = true;
    this.employeeService.getPendingTransactions()
      .subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Failed to load transactions', 'Close', {
            duration: 3000
          });
          this.loading = false;
        }
      });
  }

  verifyTransaction(transactionId: string, isApproved: boolean) {
    const transaction = this.transactions.find(t => t._id === transactionId);
    if (!transaction) return;

    transaction.processing = true;
    this.employeeService.verifyTransaction(transactionId, {
      isValid: isApproved
    }).subscribe({
      next: () => {
        this.snackBar.open(
          `Transaction ${isApproved ? 'approved' : 'rejected'} successfully`, 
          'Close', 
          { duration: 3000 }
        );
        this.loadPendingTransactions();
      },
      error: (error) => {
        transaction.processing = false;
        this.snackBar.open(
          error.message || 'Failed to verify transaction', 
          'Close', 
          { duration: 3000 }
        );
      }
    });
  }
} 