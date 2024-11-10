import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Transaction } from '../../shared/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  getPendingTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`);
  }

  getVerifiedTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/verified`);
  }

  verifyTransaction(transactionId: string, verificationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify/${transactionId}`, verificationData);
  }

  submitToSwift(transactionIds: string[]): Observable<{success: boolean, message: string}> {
    return this.http.post<{success: boolean, message: string}>(
      `${this.apiUrl}/submit-swift`, 
      { transactions: transactionIds }
    );
  }
}
