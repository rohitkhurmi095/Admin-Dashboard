import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  //router object
  constructor(private _authService:AuthService,private router:Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //return true;

    //pipe => to return Observable type data without using suscribe method
    //isLoggedIn = getter method of loggedIn Observable(Behaviour Subject)
    //isLoggedIn = true if user is loggedIn
    //isLoggedIn = false if user is not loggedIn
    //auth guard returns true/false based on isLoggedIn
    return this._authService.isLoggedIn.pipe(
      map((isLoggedIn:boolean)=>{
        if(!isLoggedIn){
          //navigate to login again
          this.router.navigate(['/auth/login']);
          return false;
        }
        return true;
      })
    )
  }

}
