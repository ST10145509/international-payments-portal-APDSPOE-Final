import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { Transaction } from '../../shared/models/transaction.model';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-transaction-history',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Transaction History</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div *ngIf="loading" class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>

        <mat-table [dataSource]="dataSource" *ngIf="!loading">
          <ng-container matColumnDef="date">
            <mat-header-cell *matHeaderCellDef> Date </mat-header-cell>
            <mat-cell *matCellDef="let transaction">
              {{transaction.createdAt | date:'medium'}}
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="amount">
            <mat-header-cell *matHeaderCellDef> Amount </mat-header-cell>
            <mat-cell *matCellDef="let transaction">
              {{transaction.amount | currency:transaction.currency}}
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="recipient">
            <mat-header-cell *matHeaderCellDef> Recipient </mat-header-cell>
            <mat-cell *matCellDef="let transaction">
              {{transaction.recipientDetails.name}}
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef> Status </mat-header-cell>
            <mat-cell *matCellDef="let transaction">
              <mat-chip [color]="getStatusColor(transaction.status)">
                {{transaction.status}}
              </mat-chip>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"
                   (click)="openTransactionDetails(row)">
          </mat-row>
        </mat-table>

        <mat-paginator [pageSize]="10"
                      [pageSizeOptions]="[5, 10, 25]"
                      showFirstLastButtons>
        </mat-paginator>
      </mat-card-content>
    </mat-card>

    <!-- Transaction Details Dialog -->
    <ng-template #transactionDetails let-transaction>
      <h2 mat-dialog-title>Transaction Details</h2>
      <mat-dialog-content>
        <div class="details-grid">
          <div class="detail-item">
            <strong>Amount:</strong>
            {{transaction.amount | currency:transaction.currency}}
          </div>
          <div class="detail-item">
            <strong>Status:</strong>
            {{transaction.status}}
          </div>
          <div class="detail-item">
            <strong>Recipient Name:</strong>
            {{transaction.recipientDetails.name}}
          </div>
          <div class="detail-item">
            <strong>Recipient Account:</strong>
            {{transaction.recipientDetails.account}}
          </div>
          <div class="detail-item">
            <strong>SWIFT Code:</strong>
            {{transaction.recipientDetails.swiftCode}}
          </div>
          <div class="detail-item">
            <strong>Bank:</strong>
            {{transaction.recipientDetails.bank}}
          </div>
          <div class="detail-item" *ngIf="transaction.verificationDetails?.notes">
            <strong>Verification Notes:</strong>
            {{transaction.verificationDetails.notes}}
          </div>
          <div class="detail-item">
            <strong>Date:</strong>
            {{transaction.createdAt | date:'medium'}}
          </div>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Close</button>
      </mat-dialog-actions>
    </ng-template>
  `,
  styles: [`
    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    mat-table {
      width: 100%;
    }
    mat-row {
      cursor: pointer;
      &:hover {
        background: rgba(0,0,0,0.04);
      }
    }
    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      padding: 16px;
    }
    .detail-item {
      strong {
        display: block;
        color: rgba(0,0,0,0.6);
      }
    }
  `]
})
export class TransactionHistoryComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Transaction>;
  displayedColumns = ['date', 'amount', 'recipient', 'status'];
  loading = false;

  @ViewChild('transactionDetails') transactionDetails!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private paymentService: PaymentService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Transaction>([]);
  }

  ngOnInit() {
    this.loadTransactions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadTransactions() {
    this.loading = true;
    this.paymentService.getCustomerTransactions()
      .subscribe({
        next: (transactions) => {
          this.dataSource.data = transactions;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading transactions:', error);
          this.loading = false;
        }
      });
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      pending: 'warn',
      verified: 'accent',
      completed: 'primary',
      rejected: 'warn'
    };
    return colors[status] || 'default';
  }

  openTransactionDetails(transaction: Transaction) {
    this.dialog.open(this.transactionDetails, {
      data: transaction,
      width: '600px'
    });
  }
} 