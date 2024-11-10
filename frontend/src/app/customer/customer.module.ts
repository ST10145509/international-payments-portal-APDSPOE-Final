import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CustomerDashboardComponent } from './dashboard/dashboard.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: CustomerDashboardComponent,
    children: [
      { path: 'new-payment', component: PaymentFormComponent },
      { path: 'history', component: TransactionHistoryComponent },
      { path: '', redirectTo: 'new-payment', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    CustomerDashboardComponent,
    PaymentFormComponent,
    TransactionHistoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CustomerModule { } 