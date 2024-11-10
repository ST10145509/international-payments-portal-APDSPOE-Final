import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { Transaction } from '../../shared/models/transaction.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-swift-submission',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>SWIFT Submission</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div *ngIf="loading" class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>

        <div *ngIf="!loading && verifiedTransactions.length === 0" class="no-transactions">
          <mat-icon>info</mat-icon>
          <p>No verified transactions ready for SWIFT submission</p>
        </div>

        <div *ngIf="!loading && verifiedTransactions.length > 0">
          <mat-table [dataSource]="verifiedTransactions">
            <!-- Selection Column -->
            <ng-container matColumnDef="select">
              <mat-header-cell *matHeaderCellDef>
                <mat-checkbox 
                  (change)="$event ? masterToggle() : null"
                  [checked]="selection.hasValue() && isAllSelected()"
                  [indeterminate]="selection.hasValue() && !isAllSelected()"
                  [disabled]="submitting">
                </mat-checkbox>
              </mat-header-cell>
              <mat-cell *matCellDef="let row">
                <mat-checkbox 
                  (click)="$event.stopPropagation()"
                  (change)="$event ? selection.toggle(row) : null"
                  [checked]="selection.isSelected(row)"
                  [disabled]="submitting">
                </mat-checkbox>
              </mat-cell>
            </ng-container>

            <!-- Amount Column -->
            <ng-container matColumnDef="amount">
              <mat-header-cell *matHeaderCellDef> Amount </mat-header-cell>
              <mat-cell *matCellDef="let transaction">
                 {{transaction.amount | currency:transaction.currency:'symbol-narrow'}}
              </mat-cell>
            </ng-container>

            <!-- Recipient Column -->
            <ng-container matColumnDef="recipient">
              <mat-header-cell *matHeaderCellDef> Recipient </mat-header-cell>
              <mat-cell *matCellDef="let transaction">
                {{transaction.recipientDetails.name}}
              </mat-cell>
            </ng-container>

            <!-- SWIFT Code Column -->
            <ng-container matColumnDef="swift">
              <mat-header-cell *matHeaderCellDef> SWIFT Code </mat-header-cell>
              <mat-cell *matCellDef="let transaction">
                {{transaction.recipientDetails.swiftCode}}
              </mat-cell>
            </ng-container>

            <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
            <mat-row *matRowDef="let row; columns: displayedColumns;"
                     (click)="selection.toggle(row)"
                     [class.disabled]="submitting">
            </mat-row>
          </mat-table>

          <div class="action-bar">
            <button mat-raised-button color="primary"
                    [disabled]="!selection.hasValue() || submitting"
                    (click)="submitToSwift()">
              <mat-spinner diameter="20" *ngIf="submitting"></mat-spinner>
              <span *ngIf="!submitting">
                <mat-icon>send</mat-icon>
                Submit to SWIFT
              </span>
            </button>
          </div>
        </div>
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
    }
    .action-bar {
      padding: 16px;
      display: flex;
      justify-content: flex-end;
    }
    mat-table {
      width: 100%;
    }
    .mat-row.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
    button mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }
  `]
})
export class SwiftSubmissionComponent implements OnInit {
  verifiedTransactions: Transaction[] = [];
  displayedColumns = ['select', 'amount', 'recipient', 'swift'];
  selection = new SelectionModel<Transaction>(true, []);
  loading = false;
  submitting = false;

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadVerifiedTransactions();
  }

  loadVerifiedTransactions() {
    this.loading = true;
    this.employeeService.getVerifiedTransactions()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (transactions) => {
          this.verifiedTransactions = transactions;
          this.selection.clear();
        },
        error: (error) => {
          this.snackBar.open(
            error.message || 'Failed to load transactions', 
            'Close', 
            { duration: 3000 }
          );
        }
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.verifiedTransactions.length;
    return numSelected === numRows && numRows > 0;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.verifiedTransactions.forEach(row => this.selection.select(row));
    }
  }

  submitToSwift() {
    if (!this.selection.hasValue() || this.submitting) return;

    this.submitting = true;
    const selectedTransactions = this.selection.selected.map(t => t._id);

    this.employeeService.submitToSwift(selectedTransactions)
      .pipe(finalize(() => this.submitting = false))
      .subscribe({
        next: (response) => {
          this.snackBar.open(response.message, 'Close', {
            duration: 3000
          });
          this.selection.clear();
          this.loadVerifiedTransactions();
        },
        error: (error) => {
          this.snackBar.open(
            error.message || 'Failed to submit transactions to SWIFT', 
            'Close', 
            { duration: 3000 }
          );
        }
      });
  }
} 