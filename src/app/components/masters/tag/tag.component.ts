import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//dbOperations Enum
import { DbOperations } from 'src/app/shared/db-operations';
//Base API URL
import { Global } from 'src/app/shared/global';
//Http Client Operations
import { DataService } from 'src/app/shared/services/data.service';
//Custom Validations
import { NoWhiteSpaceValidator, TextFieldValidator } from '../../../validators/validation.validators';
//AuthService
import { AuthService } from '../../auth/auth.service';

//toaster notification
import { ToastrService } from 'ngx-toastr';
//Sweetalert popupbox
import Swal from 'sweetalert2';


@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit,OnDestroy {

  //formGroup instance
  addForm:FormGroup;

  //dataTable
  objRows:any[] = [];
  objRow:any;

  //Database Operations Enum
  dbOps:DbOperations;
  //buttonText
  buttonText:string;

  //for changing Tabset
  //accing template on html from component
  @ViewChild('nav') elName:any;

  //__________________________________
  //Dynamic Form Validation Messages
  //___________________________________
  //define formControls
  formErrors = {
    name: ''
  };
  //define validation message for each control
  validationMessages = {
    name:{
      required:'Name is required',
      minlength:'Name cannot be less than 3 characters long',
      maxlength:'Name cannot be more than 15 characters long',
      validTextField:'Name must contain only numbers & letters',
      noWhiteSpaceValidator:'Only WhiteSpaces is not allowed'
    }
  }
  //____________________________________

  constructor(private dataService:DataService, private _authService:AuthService,private _toastr:ToastrService, private _fb:FormBuilder ) { }

  ngOnInit(): void {
    this.setFormState();  //form Model
    this.getData();       //Inserting Data from API -> table
  }

 
  //________________
  // FORM MODEL
  //________________
  setFormState(){
    //Default form settings
    this.dbOps = DbOperations.create; //default operation = create
    this.buttonText = "Submit";      //default buttonText = submit

    //form model
    this.addForm = this._fb.group({
      //from API docs
      id:[0],

      //formControl
      name:['', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(15),TextFieldValidator.validTextField,NoWhiteSpaceValidator.noWhiteSpaceValidator])]
    });

    //Dynamic form validations using valueChanges
    this.addForm.valueChanges.subscribe(()=>{
      //call this function on valueChanges
      this.onValueChanges();
    });
  }
  
  //GETTER METHOD -> get formControls
  get f(){
    return this.addForm.controls;
  }



  //_________________________________
  //Dynamic Form Validation Function
  //_________________________________
  onValueChanges(){
    //console.log('value changes');

    //loops through keys of formErrors
    for(const field of Object.keys(this.formErrors)){
      //here field = formControlName = name
      this.formErrors[field] = '';
      //get control
      const control = this.addForm.get(field);

      //if control is there + value changes(dirty) + is invalid
      if(control && control.dirty && !control.valid){
        //validation message assigned to field
        const message = this.validationMessages[field];

        //loop through all errors of control.errors
        for(const key of Object.keys(control.errors)){
          if(key !== 'required'){
            this.formErrors[field] = this.formErrors[field] + message[key] + ' ';
          }
        }
      }
    
    }
  }


  //____________________________________________
  // Inserting data from API -> table (objRows)
  //_____________________________________________
  getData(){
    this.dataService.get(Global.BASE_API_PATH + "TagMaster/GetAll/").subscribe(res => {
      if(res.isSuccess){
        //indert API data -> table rows(objRows[])
        this.objRows = res.data;
      }else{
        this._toastr.error(res.errors[0], 'Tag Master');
      }
    })
  }


  //___________________________________
  //TABLE BINDING + DEFAULT Form State
  //___________________________________
  //called on update/add dbOps
  setForm(){
    //bind api -> table data
    this.getData();
    
    //reset formControls
    this.dbOps = DbOperations.create;
    this.buttonText = "Submit",

    //select default tabset (show table)
    this.elName.select('viewTab');
  }

  
  //_________________
  // CANCEL Button
  //_________________
  cancelForm(){
     //reset form 
     this.addForm.reset({
      id:0 //not passed as formControl
    });

    //reset DbOps + button
    this.dbOps = DbOperations.create;
    this.buttonText = "Submit";

    //reset Tab to viewTab
    this.elName.select('viewTab');
  }

  
  //=================
  // EDIT ACTION
  //=================
  Edit(Id:number){
    this.dbOps = DbOperations.update;
    this.buttonText = "Update";

    //select addForm for Editing
    this.elName.select('addTab');

    //find row with Id
    this.objRow = this.objRows.find(x => x.id === Id);
    
    //updateRow
    this.addForm.controls['id'].setValue(this.objRow.id);
    this.addForm.controls['name'].setValue(this.objRow.name);
  }


  //==================
  // DELETE ACTION
  //==================
  Delete(Id:number){
    //for delete operations passs id as object
    let obj = {id:Id};

    //sweetalert2 popup
    Swal.fire({
      title:'Are you sure?',
      text:'You will not be able to recover this record!',
      icon:'warning',
      showCancelButton:true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText:'No, keep it',
    }).then((result) => {
      if(result.value){

        //call delete API
        this.dataService.post(Global.BASE_API_PATH + "TagMaster/Delete/",obj).subscribe(res =>{
          if(res.isSuccess){
            Swal.fire('Deleted', 'Your record has been deleted', 'success');

            //show table after deleting records
            this.getData();

          }else{
            this._toastr.error(res.errors[0], 'Delete');
          }
        })
      }
      else if(result.dismiss === Swal.DismissReason.cancel){
        Swal.fire('Cancelled', 'Your record is safe:)', 'error');
      }
    });

  }

  //===============
  //SUBMIT Form 
  //===============
  //same button is used for add/update operations depending upon dbOps (enum)
  onSubmit(){

    switch(this.dbOps){

      //Add Form
      case DbOperations.create:
        this.dataService.post(Global.BASE_API_PATH + "TagMaster/Save/",this.addForm.value).subscribe(res =>{
          if(res.isSuccess){
            this._toastr.success('Data Saved Successfully', 'Tag Master');

            //change Tabset after creating tag
            this.elName.select('viewTab');

            //call TableBinding + default formControls function
            this.setForm();

          }else{
            this._toastr.error(res.errors[0], 'Tag Master');
          }
        });
      break;

      //Update Form
      case DbOperations.update:
        this.dataService.post(Global.BASE_API_PATH + "TagMaster/Update/",this.addForm.value).subscribe(res =>{
          if(res.isSuccess){
            this._toastr.success('Data Updatedd Successfully', 'Tag Master');

            //change Tabset after creating tag
            this.elName.select('viewTab');

            //call TableBinding + default formControls function
            this.setForm();

          }else{
            this._toastr.error(res.errors[0], 'Tag Master');
          }
        });
    }

  }


  //---------------------
  // onDelete Interface
  //---------------------
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

  //---------------------------------------------------------
  // RESET FormControls on tabChange from addTab -> viewTab
  //---------------------------------------------------------
  //(navChange) = "onTabChange($event)"
  onTabChange(event:any){
    if(event.activeId === 'viewTab'){
      //reset form 
      this.addForm.reset({
        id:0 //not passed as formControl
      });
      //reset DbOps + button
      this.dbOps = DbOperations.create;
      this.buttonText = "Submit";
    }
  }

}
