import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  register(userData: {
    fullName: string;
    idNumber: string;
    accountNumber: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData)
      .pipe(
        map(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        }),
        catchError(error => {
          console.error('Registration error:', error);
          throw error;
        })
      );
  }

  login(accountNumber: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { accountNumber, password })
      .pipe(
        map(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        }),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
} 