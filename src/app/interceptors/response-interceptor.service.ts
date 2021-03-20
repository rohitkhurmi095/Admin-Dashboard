import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResponseInterceptor implements HttpInterceptor {

  constructor() { }

  //intercept method of httpInterceptor Interface
  intercept(req:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{

    console.log('Response Interceptor called...');

    //get Observable type req without suscribing => pipe
    return next.handle(req).pipe(
      //retry 3 times
      retry(3),
      map(res => {
        if(res instanceof HttpResponse){
          console.log(res);
          return res;
        }
      }),
      catchError((error:HttpErrorResponse)=>{
        let errorMessage = '';

        //error contains error
        console.log(error);

        if(error.error instanceof ErrorEvent){
          errorMessage = `Error ${error.message}`;
        }else{
          errorMessage = `Error Code : ${error.status}, Message : ${error.message}`;
        }

        //throw error
        return throwError(errorMessage);
      })
    )

  }

}
