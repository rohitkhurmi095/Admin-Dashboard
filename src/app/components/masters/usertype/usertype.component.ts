import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Toastr notifications
import { ToastrService } from 'ngx-toastr';
import { NoWhiteSpaceValidator, TextFieldValidator } from 'src/app/validators/validation.validators';
//sweetalert2 popup box
import Swal from 'sweetalert2';

//dbOperations enum
import {DbOperations} from '../../../shared/db-operations';
//BASE API URL
import {Global} from '../../../shared/global';
//Http Operations
import {DataService} from '../../../shared/services/data.service';


@Component({
  selector: 'app-usertype',
  templateUrl: './usertype.component.html',
  styleUrls: ['./usertype.component.scss']
})
export class UsertypeComponent implements OnInit {

    //Form Instance
    addform:FormGroup;

    //DbOperations - Enum(to use same button for add/delete operations based on conditions)
    dbOps:DbOperations;
    //buttonText 
    buttonText:string;
  
    //FOR TABLE(rows)
    objRows: any[] = []; //insert API data -> rowsObj[] (table rows)
    objRow:any; //to get single row - for edit(update) operations
  
    //To select tabset after create/update operations
    @ViewChild('nav') elName:any;
  
  
    //_____________________________
    // DYNAMIC VALIDATION MESSAGES
    //_____________________________
    //1) Define FormControls
    formErrors = {
      name: ''
    };
    //Define type of validation message on each control
    //note: errors.minlength (errors obj property in lowercase not uppercase)
    validationMessage = {
      name:{
        required:'Name is required',
        minlength:'Name cannot be less than 3 characters long',
        maxlength:'Name cannot be more than 15 characters long',
        validTextField:'Name must contain only numbers & letters',
        noWhiteSpaceValidator:'Only WhiteSpaces is not allowed'
      }
    }
    //_________________________________


    //DEPENDENCY INJECTION
  //toastr notification, formBuilder, dataService(Http Operations)
  constructor(private _dataService:DataService, private _toastr:ToastrService,private _fb:FormBuilder) { }

  //when bindings takes place
  ngOnInit(): void {
    this.setFormState(); //FormData
    this.getData();      //Binding Table from API
  }

  //____________
  //FORM STATE
  //____________
  setFormState(){
    //default form State (ADD Tabset)
    this.dbOps = DbOperations.create; //enum operation
    this.buttonText = "Submit";      //button text
    
    this.addform = this._fb.group({
      //form api docs
      id: [0],
      //form data
      name:['',Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(15),TextFieldValidator.validTextField,NoWhiteSpaceValidator.noWhiteSpaceValidator])]
    });

    //::::: DYNAMIC VALIDATIONS HANDLER :::::
    //Dynamic validations - handle using valueChanges,statusChanges
    //valueChanges: change in value in formInput -> get chnaged value 
    //statusChanges: change value in form - notifies the updated status(valid/invalid)
    this.addform.valueChanges.subscribe(()=>{
      //called for every value change
      this.onValueChange();
    });
  }

  //______________________________
  // Applying Dynamic Validations
  //______________________________
  onValueChange(){
    //console.log('value changes');

    //if form is invalid(undefined)
    if(!this.addform){
      return;
    }

    //loop through keys(name) of formErrors
    for(const field of Object.keys(this.formErrors)){
      //here field = formControlName = name
      this.formErrors[field] = '';

      //get control
      const control = this.addform.get(field);

    //if control is there & control value changes(Dirty) & control is invalid
      if(control && control.dirty && control.invalid){
        //validation message assigned to field
        const message = this.validationMessage[field];
        
        //loop through all errors -> controls.errors
        for(let key of Object.keys(control.errors)){
          if(key !== 'required'){
            this.formErrors[field] = this.formErrors[field] + message[key] + ' ';
          }
        }
      }
    }


  }

  //________________
  //GETTER METHOD
  //________________
  //getter method : get formControls
  get f(){
    return this.addform.controls;
  }


  //______________________________________________
  //Insert DATA from API -> Table rows(objRows[])
  //_______________________________________________
  getData(){
    //call API 
    this._dataService.get(Global.BASE_API_PATH + "UserType/GetAll/").subscribe(res=>{

      //SUCCESS
      if(res.isSuccess){
        //Insert data from API -> table rows[]
        this.objRows = res.data;
      }else{
        //Error
        this._toastr.error(res.errors[0], "Size Master");
      }
    
    });
  }


  //_____________________________________
  //BINDING TABLE + default form settings
  //______________________________________
  //call on update/add record
  setForm(){
    this.getData();

    this.dbOps = DbOperations.create;
    this.buttonText = "Submit";
    this.elName.select('viewTab');
  }

  //___________________
  //CANCEL FORM method
  //___________________
  cancelForm(){
    this.addform.reset({
      id:0 //id is passed from API docs not as formData
    });

    //reset form State
    this.dbOps = DbOperations.create;
    this.buttonText = "Submit";

    //reset Tabset to viewTab(default)
    this.elName.select('viewTab');
  }


  //===================
  //EDIT Form Function
  //===================
  Edit(Id:number){
    //DbOpearations, buttonText for Edit
    this.dbOps = DbOperations.update;
    this.buttonText = "Update";

    //SELECT addTab (Tabset) on Edit => EDIT FORM
    this.elName.select('addTab');

    //Find rowObj(Row) from rowsObj(Rows) with matching Id -> for Edit
    this.objRow = this.objRows.find(x => x.id === Id);

    //Update the Row with Id found
    this.addform.controls['id'].setValue(this.objRow.id);
    this.addform.controls['name'].setValue(this.objRow.name); 
  }


  //=====================
  //DELETE Form function
  //=====================
  Delete(Id:number){

    //For delete operation we need to pass id as Object
    const obj = {
      id: Id
    }

    //Sweet alert2 poppup box
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'

    }).then((result)=>{
      if(result.value){

        //call API 
        this._dataService.post(Global.BASE_API_PATH + 'UserType/Delete/',obj).subscribe(res=>{
          //SUCCESS
          if(res.isSuccess){
              //Record Deleted
              Swal.fire('Deleted', 'Your record has been deleted', 'success');

              //show table after deleting record
              this.getData();
          }else{
            //error notification
            this._toastr.error(res.errors[0], 'Delete');
          }
        })
      }
      //handling dismissals
      else if(result.dismiss === Swal.DismissReason.cancel){
        Swal.fire('Cancelled', 'Your record is safe:)', 'error');
      }
    });

  }


  //====================================
  //Submit Form - ADD/UPDATE Operations
  //====================================
  //Same button is used for create/update operations based on enum (this.dbOps)
  onSubmit(){

    switch(this.dbOps){
      
      //ADD formValues
      case DbOperations.create:
        this._dataService.post(Global.BASE_API_PATH + 'UserType/Save/', this.addform.value).subscribe(res=>{
          if(res.isSuccess){
            //success notification
            this._toastr.success("Data added successfully", "UserType Master");

            //after adding formData -> select viewTab
            this.elName.select('viewTab');

            //call -> Binding Table + default formContorls
            this.setForm();
          }else{
            //error notification
            this._toastr.error(res.errors[0], 'UserType Master');
          }
        });
      break;

      //Edit (UPDATE) formValues
      case DbOperations.update:
        this._dataService.post(Global.BASE_API_PATH + 'UserType/Update/', this.addform.value).subscribe(res=>{
          if(res.isSuccess){
            //success notification
            this._toastr.success("Data Updated Successfully", 'UserType Master');

            //after updating form -> select viewTab
            this.elName.select('viewTab');

            //call -> Binding Table + default formContorls
            this.setForm();
          }else{
            //error notification
            this._toastr.error(res.errors[0], 'UserType Master');
          }
        });
   
    }
  }

  //DESTROY VARIABLE AFTER USED
  //when user leaves the page
  ngOnDestroy(){
    this.objRow = null;
    this.objRows = [];
  }
  
  //Implement server side sorting here
  onSort(event:any){
    //console.log(event);
  }

  //implement server side pagination here
  setPage(event:any){
    //console.log(event);
  }


  //-----------------------------------------------
  //RESET FORM when changed from AddTab -> viewTab
  //-----------------------------------------------
  // (navChange)="onTabChange($event)" -set on ngbNav Tabset
  onTabChange(event:any){
    //view tabset
    if(event.activeId === 'viewTab'){
      this.getData();
    }

    //add tabset
    if(event.activeId === 'addTab'){
      this.addform.reset({
        id:0 //not passed as formData
      });
      //set default controls
      this.dbOps = DbOperations.create;
      this.buttonText = "Submit";
    }
  }

}
