import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { Currencies } from '../interface/currencies';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExcangeApiService {
  apiURL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1';

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getCurrencies(): Observable<Currencies> {
    return this.http
      .get<Currencies>(this.apiURL + '/latest/currencies.json')
      .pipe(retry(1), catchError(this.handleError));
  }

  getAllRates(fromCurrency: string, timeStamp: string): Observable<any> {
    return this.http
      .get<any>(this.apiURL + `/${timeStamp}/currencies/${fromCurrency}.json`)
      .pipe(retry(1), catchError(this.handleError));
  }

  getRate(fromCurrency: string, toCurrency: string): Observable<Currencies> {
    return this.http
      .get<Currencies>(
        this.apiURL + `/latest/currencies/${fromCurrency}/${toCurrency}.json`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
