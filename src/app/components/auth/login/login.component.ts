import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';
import { AuthService } from '../auth.service';

//Custom Validators
import {MustMatchValidator,EmailValidator} from '../../../validators/validation.validators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  //loginForm
  loginForm:FormGroup;
  //RegisterForm
  registerForm:FormGroup;

  //form is submitted or not
  submitted:boolean = false;
  //error message from auth service
  strMsg:string;

  //** To access template refrence variable on component => @ViewChild()
  //ngbNavItem = registertab/logintab
  //this.elName.select('ngbNavItem name');
  @ViewChild('nav')  elName:any;


  //toastr,authService,dataService,formBuilder
  constructor(private _authService:AuthService, private _dataService:DataService, private _toastr:ToastrService, private _fb:FormBuilder) { 
    //by defaut error message = " "
    this.strMsg = " ";

    //whenever login Component is called => logout() is called => localStorage is cleared
    this._authService.logout();
  }

  ngOnInit() {
    this.createLoginForm();
    this.createRegisterForm();
  }


  //=============
  // LOGIN FORM 
  //=============
  // In Login Form we applied validations using - toastr notifications 

  createLoginForm(){
    this.loginForm = this._fb.group({
      userName:['', Validators.required],
      password:['', Validators.required]
    });
  }

  //Reset Login Form
  reset(){
    this.loginForm.reset();
    //this.loginForm.get('userName').setValue("");
    //this.loginForm.get('password').setValue("");
  }


  //_____ Submitting Login Form _____
  onLoginSubmit(){
    //If userName is not entered => invalid form
    if(this.loginForm.get('userName').value == ""){
      //error notification
      this._toastr.error("Username is required !!","Login");
      return;
    }
    //If password is not entered => invalid form
    else if(this.loginForm.get('password').value == ""){
      //error notification
      this._toastr.error("Password is required !!","Login");
      return;
    }
    else{
        //if loginForm is valid
        if(this.loginForm.valid){
         
          //call login API + insert user data into login()
          this._dataService.post(Global.BASE_API_PATH + "UserMaster/Login",this.loginForm.value).subscribe(res =>{
            
            if(res.isSuccess){
              //add user credentials to login method -> authService =>LOGIN
              this._authService.login(res.data);

              //check strMessage from authService
              //if strMsg != "" => error
              //if strMsg == "" => no error
              this.strMsg = this._authService.getMessage();
              if (this.strMsg != ' '){
                //reset form + show error message
                this._toastr.error(this.strMsg, "Login");
                this.reset();
              }

            }else{
              //error notification
              this._toastr.error(res.errors[0],"Login");
              //reset form 
              this.reset();
            }
          });

        }else{
          //error notification
          this._toastr.error("Invalid credentials !!","Login");
          this.reset();
        }
    }
  }



  
  //================
  // REGISTER FORM
  //================
  // In Register form we applied validation message on template base on submitted = true/false

  createRegisterForm(){
    this.registerForm = this._fb.group({
      //API fields
      id:[0],
      userTypeId:[1],

      //FormData fields
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      email: ['', Validators.compose([Validators.required, EmailValidator.validEmail])],
      password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$')])],
      confirmPassword: ['',Validators.required]
    },{

      //custom validator to match password & confirmPassword
      //use as: this.form.controls.confirmPassword.mustMatch
      validators: MustMatchValidator('password','confirmPassword'),
    });
  }

  //getter method for registerForm
  get f(){
    return this.registerForm.controls;
  }

  
  //_____ submitting Register Form ______
  onRegisterSubmit(formData:any){
    this.submitted = true;

    //if register form is invalid
    if(this.registerForm.invalid){
      //show error notification
      this._toastr.error('Invalid Data');
      //do nothing
      return;
    }

    //if register form is valid => call API
    //POST /api/UserMaster/Save
    this._dataService.post(Global.BASE_API_PATH + "UserMaster/Save", formData.value).subscribe(res =>{
      if(res.isSuccess){
        //success - notification
        this._toastr.success("Data has been successfully saved !!","Register");

        //Reset form after submit
        this.registerForm.reset();
        this.submitted = false;

        //move to login Tab after register
        this.elName.select('logintab');

      }else{
        //error notification
        this._toastr.error(res.errors[0],"Register");
      }
    });

  }



}
