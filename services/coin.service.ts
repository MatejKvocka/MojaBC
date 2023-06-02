import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CoinService {
  private apiUrl = 'http://localhost:3000/api'; // Update the base API URL

  constructor(private http: HttpClient, private authService: AuthenticationService, private router: Router) { }

  getCoins(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getAuthToken()}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/coins`, { headers: headers }); // Update the endpoint path
  }

  getCoinById(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getAuthToken()}`
    });
    return this.http.get<any>(`${this.apiUrl}/coins/${id}`, { headers: headers }); // Update the endpoint path
  }

  getCoinYears(): Observable<string[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getAuthToken()}`
    });
    return this.http.get<string[]>(`${this.apiUrl}/coins/years`, { headers: headers }); // Update the endpoint path
  }

  getCoinCountries(): Observable<string[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getAuthToken()}`
    });
    return this.http.get<string[]>(`${this.apiUrl}/coins/countries`, { headers: headers }); // Update the endpoint path
  }

  private getHeader(): HttpHeaders {
    const token = this.authService.getAuthToken();
    if (!token) {
      this.router.navigate(['/coins']);
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  collectCoin(userId: string, coinId: string): Observable<any> {
    if (userId) {
      const headers = this.getHeader();
      return this.http.post<any>(
        `${this.apiUrl}/user/${userId}/collect`,
        { coinId: coinId },
        { headers: headers }
      ); // Update the endpoint path
    }
    return throwError('User ID not found');
  }

  removeCoin(userId: string, coinId: string): Observable<any> {
    if (userId) {
      const headers = this.getHeader();
      return this.http.delete<any>(
        `${this.apiUrl}/user/${userId}/collect/${coinId}`,
        { headers: headers }
      ); // Update the endpoint path
    }
    return throwError('User ID not found');
  }

  getCollectedCoins(userId: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getAuthToken()}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}/collectedCoins`, { headers: headers });
  }

  getCollectedCoinStats(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getAuthToken()}`
    });
    return this.http.get<any>(`${this.apiUrl}/user/${userId}/coinStats`, { headers: headers });
  }
}



