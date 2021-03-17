import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //current User data
  private currentUserSubject = new BehaviorSubject<any>(null);
  //user is loggedIn or not
  private loggedIn = new BehaviorSubject<boolean>(false);
  //error message
  private message:string; 

  //router object
  constructor(private router:Router) { }

  //getter method - to use outside component
  //asObservable() => subject cannot be modified using next() method
  get currentUser(){
    return this.currentUserSubject.asObservable();
  }
  get isLoggedIn(){
    return this.loggedIn.asObservable();
  }

  //Show Error Message - used in login component
  getMessage():string{
    return this.message;
  }

  //===========
  // LOGIN
  //===========
  //whenever we call API - data object is received
  //objUserDetails = res.data when calling login API
  //id = userId(from API)
  //if data.id ===0 => error
  //if data.id != 0 => success

  login(objUserDetails:any){
   
    if(objUserDetails.id === 0){
      //** Error **
      //remove userDetails from localStorage
      localStorage.removeItem("userDetails");

      //SET currentUserDetails = null & user loggedIn = false
      this.currentUserSubject.next(null);
      this.loggedIn.next(false);
      
      //error Message
      this.message = "Please Enter valid username & password!!";

    }else{
      //** Success **
      //SET currentUserDetails = objUserDeatails & user loggedIn = true
      this.currentUserSubject.next(objUserDetails);
      this.loggedIn.next(true);

      //No Error Message
      this.message = ' '; 
      
      //Set userDetails in localStorage
      localStorage.setItem("userDetails", JSON.stringify(objUserDetails));

      //navigate to dashboard 
      this.router.navigate(['/dashboard/default']);
    }
  }


  //============
  // LOGOUT
  //============
  logout(){
    //CLEAR localStorage
    localStorage.clear();

    //SET currentUserDetails = null & user loggedIn = false
    this.currentUserSubject.next(null);
    this.loggedIn.next(false);
    
    //navigate to login page on logout
    this.router.navigate(['/auth/login']);
  }
  
}
