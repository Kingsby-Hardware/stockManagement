import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";
import { apiBaseUrl } from "../appConfig";
import { Product } from '../models/product';
import { Sales } from '../models/Sales';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(
    private http: HttpClient,
  ) { }
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }
  private baseUrl = apiBaseUrl;

  private log(message: string) {
    console.log(message);
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      
      this.log(`${operation} failed: ${error.message}`);
      
      return of(result as T);
    };
  }

  getSales(): Observable<any> {
    const url = this.baseUrl + "/sale";
    return this.http
    .get<any>(url)
    .pipe(
      tap(_ => this.log(`${JSON.stringify(_)}`)),
      catchError(this.handleError<any>("getSales"))
    );
  }

  getSaleById(saleId:string):Observable<any> {
    const url = `${this.baseUrl}/sale/${saleId}`;
    console.log("URL",url);
    
    return this.http
    .get<any>(url)
    .pipe(
      tap(_ => this.log(`Fetched Sale with saleId = ${saleId}`)),
      catchError(this.handleError<any>(`getSale id= ${saleId}`))
    );

  }

  updateSale(sale:Sales): Observable<any> {
    const url = `${this.baseUrl}/sale`;
    return this.http
    .put<any>(url,sale,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Updated sale with saleId ${sale._id}`)),
      catchError(this.handleError<any>('updateSale'))
    );
  }

  addSale(sale: Sales): Observable<any>{
    const url = `${this.baseUrl}/sale`;
    return this.http
    .post<any>(url,sale,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Added sale.`)),
      catchError(this.handleError<any>('addSale'))
    );
  }

  deleteSale(saleId:string):Observable<any> {
    const url = `${this.baseUrl}/sale/${saleId}`;
    return this.http
    .delete<any>(url)
    .pipe(
      tap(_ => this.log(`Deleted sale with saleId = ${saleId}`)),
      catchError(this.handleError<any>(`deleteSale id= ${saleId}`))
    );
  }
}
