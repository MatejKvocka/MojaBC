import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserPayload } from 'src/app/models/UserPayload';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  login(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      tap((response) => {
        const token = response.token;
        if (token) {
          this.setAuthToken(token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUserInfo(): Observable<UserPayload | null> {
    const token = localStorage.getItem(this.tokenKey);

    if (!token) return of(null);

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));

    return of({ userId: tokenPayload.userId });
  }

  private setAuthToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
      tap((response) => {
        const token = response.token;
        if (token) {
          this.setAuthToken(token);
        }
      })
    );
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
