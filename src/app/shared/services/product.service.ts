import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";
import { apiBaseUrl } from "../appConfig";
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

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

  getProducts(): Observable<any> {
    const url = this.baseUrl + "/product";
    return this.http
    .get<any>(url)
    .pipe(
      tap(_ => this.log(`${JSON.stringify(_)}`)),
      catchError(this.handleError<any>("getProducts"))
    );
  }

  getProductById(productId:string):Observable<any> {
    const url = `${this.baseUrl}/product/${productId}`;
    console.log("URL",url);
    
    return this.http
    .get<any>(url)
    .pipe(
      tap(_ => this.log(`Fetched Product with productId = ${productId}`)),
      catchError(this.handleError<any>(`getProduct id= ${productId}`))
    );

  }

  updateProduct(product:Product): Observable<any> {
    const url = `${this.baseUrl}/product`;
    return this.http
    .put<any>(url,product,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Updated product with productId ${product._id}`)),
      catchError(this.handleError<any>('updateProduct'))
    );
  }

  addProduct(product: Product): Observable<any>{
    const url = `${this.baseUrl}/product`;
    return this.http
    .post<any>(url,product,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Added product.`)),
      catchError(this.handleError<any>('addProduct'))
    );
  }

  deleteProduct(productId:string):Observable<any> {
    const url = `${this.baseUrl}/product/${productId}`;
    return this.http
    .delete<any>(url)
    .pipe(
      tap(_ => this.log(`Deleted product with productId = ${productId}`)),
      catchError(this.handleError<any>(`deleteProduct id= ${productId}`))
    );

  }


}
