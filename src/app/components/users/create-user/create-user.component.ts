import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DbOperations } from 'src/app/shared/db-operations';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';

//custom Validations
import { EmailValidator,MustMatchValidator} from '../../../validators/validation.validators';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit,OnDestroy{

  //Form Group Instance
  addForm:FormGroup;
  submitted:boolean = false;

  //DbOperation enum
  dbOps:DbOperations;
  //buttonText
  buttonText:string;
 
  //To Edit Single Row
  objRow:any;
  //userId (received from userDetails table('/user/list-user))
  //to get single row by id (to edit user details)
  userId = 0;

  //For USER TYPES SELECTOR
  //userTypes (received from userType master API)
  objUserTypes:any[] = [];



  //Activated Route(to receive Id param from userDetails table - to edit row)
  //tostr notification, formBuilder instance, dataService
  constructor(private route:ActivatedRoute,private router:Router, private _dataService:DataService,private _toastr:ToastrService,private _fb:FormBuilder) {
    
    //receive userId from /user/list-user table : by suscribing queryParams
    this.route.queryParams.subscribe(params =>{
      //console.log(params["userId"]);
      this.userId = params.userId;
    });
  
  }

  ngOnInit(): void {
    this.setFormState(); //form Model
    this.getUserTypes(); //User Types Selector


    //NOTE **
    //If userId is received then only fill Edit Form values(default values)
    //=============
    // Edit 
    //=============
    // we have userId from userDetails table (another component received via activatedRoute)
    //use this userId to get single user by Id -> to auto fill edit field for that row
    if(this.userId != null && this.userId > 0){
      this.dbOps = DbOperations.update;
      this.buttonText = "Update";

      //call Edit form values filler
      this.getUserById();
    }

  }

  //___________________
  // FORM MODEL
  //___________________
  setFormState(){
    //default form state
    this.dbOps = DbOperations.create;
    this.buttonText = "Submit";

    this.addForm = this._fb.group({
      //API fields
      id:[0],

      //FormData fields
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      email: ['', Validators.compose([Validators.required, EmailValidator.validEmail])],
      userTypeId:['',Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$')])],
      confirmPassword: ['',Validators.required]
    },{

      //custom validator to match password & confirmPassword
      //use as: this.form.controls.confirmPassword.mustMatch
      validators: MustMatchValidator('password','confirmPassword'),
    });

  }


  //---------------
  // Getter Method - get formControls
  //----------------
  get f(){
    return this.addForm.controls;
  }


  //_________________________________________________
  //SELECTOR for userType (admin,customer etc...)
  //_________________________________________________
  //call userType master API(Masters) (not user Master)
  getUserTypes(){
    this._dataService.get(Global.BASE_API_PATH + "UserType/GetAll/").subscribe(res=>{
      if(res.isSuccess){
        //userTypes SELECTOR 
        //assign userTypes to objUserType(user type selector)
        this.objUserTypes = res.data

      }else{
        this._toastr.error(res.errors[0], 'User Master');
      }
    })
  }


  //__________________________________________
  //Get single row(userDetails) by Id(userId)
  //__________________________________________
  //call getUser by Id API
  getUserById(){
    this._dataService.get(Global.BASE_API_PATH + "UserMaster/GetbyId/" + this.userId).subscribe(res=>{
      if(res.isSuccess){
        //Single Row
        this.objRow = res.data;

        //Update Edit Form with Current row Values(received from API by Id)
        //(Except password & confirmPassword fields)
        //----------------------------------------------
        //from Api docs
        this.addForm.controls['id'].setValue(this.objRow.id);

        //formControls
        this.addForm.controls['firstName'].setValue(this.objRow.firstName);
        this.addForm.controls['lastName'].setValue(this.objRow.lastName);
        this.addForm.controls['email'].setValue(this.objRow.email);
        this.addForm.controls['userTypeId'].setValue(this.objRow.userTypeId);
      
      }else{
        this._toastr.error(res.errors[0], 'User Master');
      }
    });
  }



 //====================================
  //Submit Form - ADD/UPDATE Operations
  //====================================
  //Same button is used for create/update operations based on enum (this.dbOps)
  onSubmit(){
    this.submitted = true;

    //if addForm is INVALID - Dont Submit
    //------------------------------------
    if(this.addForm.invalid){
      this._toastr.error('Invalid Data !!');
      return;
    }

    //if addForm is VALID - SUBMIT
    //-----------------------------
   

    //perform ADD/EDIT operation
    switch(this.dbOps){
      
      //ADD formValues
      case DbOperations.create:
        this._dataService.post(Global.BASE_API_PATH + 'UserMaster/Save/', this.addForm.value).subscribe(res=>{
          if(res.isSuccess){
            //success notification
            this._toastr.success("Data Saved successfully", "User Master");

            //after submitting form  (Reset Form + submitted = false again)
            this.addForm.reset();
            this.submitted = false;
              
            //show userDetails Table ('/users/list-user') - after creating recored
            this.router.navigate(['/users/list-user']);
           
          }else{
            //error notification
            this._toastr.error(res.errors[0], 'UserType Master');
          }
        });
      break;

      //Edit (UPDATE) formValues
      case DbOperations.update:
        this._dataService.post(Global.BASE_API_PATH + 'UserMaster/Update/', this.addForm.value).subscribe(res=>{
          if(res.isSuccess){
            //success notification
            this._toastr.success("Data Updated Successfully", 'User Master');

            //after submitting form (Reset Form + submitted = false again)
            this.addForm.reset();
            this.submitted = false;

            //show userDetails Table ('/users/list-user') - after updating recored
            this.router.navigate(['/users/list-user']);
            
          }else{
            //error notification
            this._toastr.error(res.errors[0], 'User Master');
          }
        });
   
    }
  }


  //DESTROY VARIABLES AFTER USED
  ngOnDestroy(){
    this.objUserTypes = [];
  }

}
