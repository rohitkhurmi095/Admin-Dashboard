import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../components/auth/auth.service';

//INTERCEPTOR = middleware (use to manipulate request,response)
//request -> interceptor(write common code here) -> server
//manipulate middleware request: req.clone({})
//check flag req.headers.has('flag');
//remove flag from header : req.clone({headers:req.headers.delete('flag')})
//set headers: req.clone({setHeaders:{} });
//call to next middleware: return next.handle(request);


@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptor implements HttpInterceptor {

  //AuthService Dependency Injection
  constructor(private _authService:AuthService) { }

  //intercept method of HttpInterceptor Interface
  intercept(req:HttpRequest<any>, next:HttpHandler):Observable<HttpEvent<any>>{

    //request to be manipulated
    let request:any;
    //from authService
    let currentUser:any;
    let isLoggedIn:boolean;

    console.log('Header Interceptor called...');

    //call  from _authService - true/false
    this._authService.isLoggedIn.subscribe(res=>{
      isLoggedIn = res; //true(if user is loggedIn)/false

      //if user is loggedIn
      if(isLoggedIn){
        //get currentUser
        this._authService.currentUser.subscribe(res=>{
          currentUser = res; //current user data

          //check for isImage flag in header
          //if isImage flag is there => postImages : dont set header
          //only pass JWT(currentUser.token) + delete isImage flag (not is use)
          if(req.headers.has('isImage')){
            //1.delete isImage flag
            request = req.clone({
              headers:req.headers.delete('isImage')
            });
            //2.pass jwt (currentUser.token)
            request = req.clone({
              setHeaders: {
                'Authorization':`Bearer ${currentUser.token}`
              }
            })
            
          }else{
              //if isImage flag is not present => pass JWT + set header
              //jwt = currentUser.token 
              request = req.clone({
                setHeaders:{
                  'Content-Type':'application/json',
                  'Authorization':`Bearer ${currentUser.token}`
                }
              })
          }
        })

      }else{
        //set only header
        request = req.clone({
          setHeaders:{'Content-Type':'application/json'}
        });
      }
    });

    //call to next middleware  
    return next.handle(request);
  }
}
