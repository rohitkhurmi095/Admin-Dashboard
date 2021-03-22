import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Tostr notification
import { ToastrService } from 'ngx-toastr';
//sweetalert2 popupBox
import Swal from 'sweetalert2';

//DbOperations enum
import { DbOperations } from 'src/app/shared/db-operations';
//BaseAPIPath
import { Global } from 'src/app/shared/global';
//dataService
import { DataService } from 'src/app/shared/services/data.service';
//authService
import { AuthService } from '../../auth/auth.service';

//Custom Validators
import { TextFieldValidator, NoWhiteSpaceValidator } from '../../../validators/validation.validators';


@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {

  //form Group instance
  addForm:FormGroup;

  //table 
  objRows:any[] = []; //table rows(INSERT API data -> table rows)
  objRow:any;         //single table row (used in edit Operation -> get row with Id)

  //db Operations enum
  dbOps:DbOperations;
  //buttonText
  buttonText:string;

  //to get template reference variable from html -> component (for TABSET navigation)
  @ViewChild('nav') elName:any;


  //_____________________________
  // DYNAMIC VALIDATION MESSAGES
  //_____________________________
  //1) Define FormControls
  formErrors = {
    name: '',
    code: ''
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
    },
    code:{
      required:'Code is required',
      minlength:'Code cannot be less than 3 characters long',
      maxlength:'Code cannot be more than 15 characters long',
      noWhiteSpaceValidator:'Only WhiteSpaces is not allowed'
    }
  }
  //_________________________________


  //DEPENDENCY INJECTION
  //toastr, formBuilder, dataService, authService
  constructor(private _dataService:DataService, private _authService:AuthService, private _toastr:ToastrService, private _fb:FormBuilder) { }

  ngOnInit(): void {
    this.setFormState(); //formModel
    this.getData();     //table data(from API)
  }


  //_________________
  // FORM MODEL
  //_________________
  setFormState(){
    //default DbOps 
    this.dbOps = DbOperations.create;
    //default button Text
    this.buttonText = "Submit";

    //formControl
    this.addForm = this._fb.group({
      //data from API docs
      id:[0],

      //formData
      name:['', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(15),TextFieldValidator.validTextField,NoWhiteSpaceValidator.noWhiteSpaceValidator])],
      code:['', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(15),NoWhiteSpaceValidator.noWhiteSpaceValidator])]
    });

    //DYNAIMC FORM VALIDATIONS
    this.addForm.valueChanges.subscribe(()=>{
      //called for every value change
      this.onValueChanges();
    });
  }


  //------------
  //GETTE METHOD -> get formControls
  //------------
  get f(){
    return this.addForm.controls;
  }

  //________________________
  // DYNAMIC VALIDATOR
  //________________________
  onValueChanges(){
    //console.log('value Changes');

    //if form is invalid
    if(!this.addForm){
      return;
    }

    //loop through keys of formErrors
    for(const field of Object.keys(this.formErrors)){
      this.formErrors[field]='';
      //get control
      const control = this.addForm.get(field);

      //if control is there + valueChanges(dirty) + notValid
      if(control && control.dirty && !control.valid){
        //assign validation message
        const message = this.validationMessage[field];

        //loop through keys of control.errors
        for(const key of Object.keys(control.errors)){
          //bypass required message (already assigned using hasError('required))
          if(key !== 'required'){
            this.formErrors[field] = this.formErrors[field] + message[key] + ' ';
          }
        }
      }
    }
    
  }


  //_________________________________________
  // Insert Data from API -> TABLE (rows[])
  //_________________________________________
  getData(){
    //call API + insert API data -> table
    this._dataService.get(Global.BASE_API_PATH + "ColorMaster/GetAll/").subscribe(res =>{
      if(res.isSuccess){
        this.objRows = res.data;
      }else{
        this._toastr.error(res.errors[0], 'Color Master');
      }
    });
  }

  //___________________________________
  // TABLE BINDING + default FormState
  //____________________________________
  //call on ADD/UPDATE while submitting form 
  setForm(){
    //table binding method
    this.getData();
    //default state
    this.dbOps = DbOperations.create;
    this.buttonText = "Submit";
    //tabset(show table)
    this.elName.select('viewTab');
  }
  
  //______________
  // CANCEL FORM 
  //______________
  cancelForm(){
    this.addForm.reset({
      id:0 //not passed as formContol 
    });
    
    //default state
    this.dbOps = DbOperations.create;
    this.buttonText = "Submit";

    //default tabset
    this.elName.select('viewTab');
  }


  //================
  // EDIT
  //================
  Edit(Id:number){
    this.dbOps = DbOperations.update;
    this.buttonText = "Update";

    //GotO Add form -> edit data
    this.elName.select('addTab');

    //find row with Id
    this.objRow = this.objRows.find(x => x.id === Id);

    //update row
    this.addForm.get('id').setValue(this.objRow.id);
    this.addForm.get('name').setValue(this.objRow.name);
    this.addForm.get('code').setValue(this.objRow.code);
  }

  //================
  // DELETE
  //================
  Delete(Id:number){

    //for delete operation(we need to pass id as object)
    let obj = {
      id:Id
    }

    Swal.fire({
      title:'Are you sure?',
      text:'You will not be able to recover this record!',
      icon:'warning',
      showCancelButton:true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText:'No, keep it'
    }).then((result)=>{
      if(result.value){

        //call delete API
        this._dataService.post(Global.BASE_API_PATH + "ColorMaster/Delete/",obj).subscribe(res=>{
          if(res.isSuccess){
            Swal.fire('Deleted', 'Your record has been deleted', 'success');

            //show table after deleting records
            this.getData();
          }else{
            this._toastr.error(res.errors[0], 'Delete');
          }
        });
      }
      else if(result.dismiss === Swal.DismissReason.cancel){
        Swal.fire('Cancelled', 'Your record is safe:)', 'error');
      }
    });

  }

  //================
  // SUBMIT FORM
  //================
  //here same button is used for 2 purpose (submit/update - buttonText & dbOps changes based on enum DbOpearations)
  onSubmit(){

    switch(this.dbOps){

      //Add Form
      case DbOperations.create:
        this._dataService.post(Global.BASE_API_PATH + "ColorMaster/Save/",this.addForm.value).subscribe(res =>{
        if(res.isSuccess){
          this._toastr.success('Data Updatedd Successfully', 'Color Master');

          //call table binding + default form state
          this.setForm();

          //change Tabset after creating tag
          this.elName.select('viewTab');
        }else{
          this._toastr.error(res.errors[0], 'Color Master');
        }
      });
      break;

      //Update Form
      case DbOperations.update:
        this._dataService.post(Global.BASE_API_PATH + "ColorMaster/Update/",this.addForm.value).subscribe(res =>{
          if(res.isSuccess){
            this._toastr.success('Data Updated Successfully', 'Color Master');

            //call table binding + default form state
            this.setForm();

            //change Tabset after creating tag
            this.elName.select('viewTab');
          }else{
            this._toastr.error(res.errors[0], 'Color Master');
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
    console.log(event);
  }

  //Implement server side pagination heare
  setPage(event:any){
    console.log(event);
  }

  //when tab changes from addTab -> viewTab
  //(navChange)="onTabChange($event)"
  onTabChange(event:any){
    //view tabset
    if(event.activeId === 'viewTab'){
      this.getData();
    }

    //add tabset
    if(event.activeId === 'addTab'){
      //reset form
      this.addForm.reset({
        id:0 //not passed as formControl
      });
      //reset formState
      this.dbOps = DbOperations.create;
      this.buttonText = "Submit";
    }

  }


}
