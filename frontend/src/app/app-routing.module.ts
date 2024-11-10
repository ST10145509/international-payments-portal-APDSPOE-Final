import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { EmployeeGuard } from './auth/guards/employee.guard';
import { CustomerDashboardComponent } from './customer/dashboard/dashboard.component';
import { EmployeeDashboardComponent } from './employee/dashboard/dashboard.component';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { 
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
    canActivate: [RoleGuard],
    data: { role: 'customer' }
  },
  {
    path: 'employee',
    loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
    canActivate: [RoleGuard],
    data: { role: 'employee' }
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 