import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

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
  selector: 'app-brandlogo',
  templateUrl: './brandlogo.component.html',
  styleUrls: ['./brandlogo.component.scss']
})
export class BrandlogoComponent implements OnInit,OnDestroy {

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



  //===================
  // for Image Upload
  //====================
  //default Preview Image from assets folder
  //variable for uploaded Image src 
  editImagePath = '/assets/images/brandlogo/noimage.jpg';

  //uploaded image will be saved in this variable
  fileToUpload: File; 

  //viewChild => access templateRef(#file) variable in component
  //used to reset uploaded field incase it is not of imageType 
  @ViewChild('file') elFile:ElementRef;
  //---------------------

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

    //if form is invalid
    if(!this.addForm){
      return;
    }

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


  //============================
  // IMAGE UPLOAD (BrandLogo)
  //============================
  upload(files:any){

    //1)if there is no file to uploaded
    if(files.Length === 0){
      return;
    }

    //console.log(files);    //FileList {0: File, length: 1}
    //console.log(files[0]); //File {name:'',size:'',LastModified:'',LastModifiedDate:'',time}

    //2)If there is file to be uploaded => UPLOAD FILE
    //-------------------------------------------------
    //get file type
    const type = files[0].type; // /image/jpeg

    //check fileType matches image extension => image type(using regx: /image\/*/)
    //IF FILE IS NOT IMAGE type
    if(type.match(/image\/*/) === null){
      this._toastr.error('Only images are supported', 'BrandLogo Master');
      //reset(Empty) image upload field again
      this.elFile.nativeElement.value = ' ';
      return;
    }
    //IF FILE IS IMAGE -> Upload + assign to fileToUpload Variable
    this.fileToUpload = files[0];


    //3) SHOW IMAGE PREVIEW ON IMAGE UPLOAD
    //--------------------------------------
    const reader = new FileReader();
    //read imageAsDataURL (read image as data)
    reader.readAsDataURL(files[0]);

    //call onload() event of reader => to load image
    reader.onload = () =>{
      //console.log(reader.result); //data:image/png;base64,image token(long)
      //console.log("Uploaded Image Src: ",reader.result.toString());

      //assign imagePath(string) to reader.result(converted to string) 
      this.editImagePath = reader.result.toString();
    };
    
  }


  //____________________________________________
  // Inserting data from API -> table (objRows)
  //_____________________________________________
  getData(){
    this.dataService.get(Global.BASE_API_PATH + "BrandLogo/GetAll/").subscribe(res => {
      if(res.isSuccess){
        //indert API data -> table rows(objRows[])
        this.objRows = res.data;

        //to check response data from API to display in table
        console.log("BRAND LOGO :" ,res.data);
      }else{
        this._toastr.error(res.errors[0], 'BrandLogo Master');
      }
    })
  }


  //___________________________________
  //TABLE BINDING + DEFAULT Form State
  //___________________________________
  //called on update/add dbOps
  setForm(){
    //reset formControls
    this.dbOps = DbOperations.create;
    this.buttonText = "Submit",

    //bind api -> table data
    this.getData();
    
    //select default tabset (show table)
    //this.elName.select('viewTab');

    //reset image state
    this.editImagePath = 'assets/images/brandlogo/noimage.jpg';
    this.fileToUpload = null;
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
    
    //reset image state
    this.editImagePath = 'assets/images/brandlogo/noimage.jpg';
    this.fileToUpload = null;
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
    this.addForm.get('id').setValue(this.objRow.id);
    this.addForm.get('name').setValue(this.objRow.name);

    //image (imagePath in API)
    this.editImagePath = this.objRow.imagePath;
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
        this.dataService.post(Global.BASE_API_PATH + "BrandLogo/Delete/",obj).subscribe(res =>{
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

  /*::::: NOTE( CORS ERROR) ::::: */
  /*CROS Cross Origin Issue - unable to connect with database When API is called -> request is unable to reach API server
    usually in Case when some API method requires 2 parameters (name,image) but in angular application we called Post method & passed single parameter to it (name)
    Here for images Upload/Update - postImages() - no header Content-Type instead of post()
    DONT stringify image -> bytes will be lost (Make new Post route:postImages)*/
  
  onSubmit(){

    //SET BinaryData for Image Upload
    //-----------------------------
    //IMAGE UPLOAD (BINARY DATA)
    //-----------------------------
    //if create(ADD) operation & no image to upload
    //1)if we try to perform post operation without image
    if(this.dbOps === DbOperations.create && !this.fileToUpload){
      this._toastr.error('Please Upload Image !!', 'BrandLogo Master');
      return;
    }

    //To 'Upload Image clientSide' work on formData instance
    //if we upload image using formGroup - we get image value as string
    //2)to send image value as BinaryData -> create formData instance & append values to it
    //formData instance
    const formData = new FormData();
    //append values to formData => Binary Data
    formData.append('Id', this.addForm.controls['id'].value);
    formData.append('Name', this.addForm.controls['name'].value);

    //If there is file to be Uploaded(used in Edit operation) - pass name of file('uploaded file')
    if(this.fileToUpload){
      formData.append('Image', this.fileToUpload, this.fileToUpload.name);
    }
    //-------------------------------

    switch(this.dbOps){

      //Add Form
      case DbOperations.create:
        this.dataService.postImages(Global.BASE_API_PATH + "BrandLogo/Save/",formData).subscribe((res:any) =>{
          if(res.isSuccess){
            this._toastr.success('Data Saved Successfully', 'BrandLogo Master');

            //change Tabset after creating tag
            this.elName.select('viewTab');

            //call TableBinding + default formControls function
            this.setForm();

          }else{
            this._toastr.error(res.errors[0], 'BrandLogo Master');
          }
        });
      break;

      //Update Form
      case DbOperations.update:
        this.dataService.postImages(Global.BASE_API_PATH + "BrandLogo/Update/",formData).subscribe((res:any) =>{
          if(res.isSuccess){
            this._toastr.success('Data Updated Successfully', 'BrandLogo Master');

            //change Tabset after creating tag
            this.elName.select('viewTab');

            //call TableBinding + default formControls function
            this.setForm();

          }else{
            this._toastr.error(res.errors[0], 'BrandLogo Master');
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
    //image
    this.fileToUpload = null;
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
  //change formState onChanging Tabset
  //(navChange) = "onTabChange($event)"
  onTabChange(event:any){
    //view tabset - display table
    if(event.activeId === 'viewTab'){
      this.getData();
    }

    //add tabset - reset form
    if(event.activeId === 'addTab'){
      //reset form 
      this.addForm.reset({
        id:0 //not passed as formControl
      });
      //reset DbOps + button
      this.dbOps = DbOperations.create;
      this.buttonText = "Submit";
      
      //reset image state
      this.editImagePath = 'assets/images/brandlogo/noimage.jpg';
      this.fileToUpload = null;
    }
  }

}
