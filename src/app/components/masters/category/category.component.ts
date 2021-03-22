import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//toastr notification
import { ToastrService } from 'ngx-toastr';
//sweetalert2 popupbox
import Swal from 'sweetalert2';

//dbOpeartion enum
import { DbOperations } from '../../../shared/db-operations';
//BASE_API_PATH
import { Global } from '../../../shared/global';
//http Operations
import { DataService } from '../../../shared/services/data.service';
//Custom Validations
import { NoWhiteSpaceValidator, NumericFieldValidator, TextFieldValidator } from '../../../validators/validation.validators';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit,OnDestroy {

  //formGroup instance
  addForm:FormGroup;

  //Table
  objRows:any[] = []; //table rows
  objRow:any; //get single row for Edit operation

  //DbOperations Enum
  dbOps:DbOperations
  //buttonText
  buttonText:string;

  //-------- IMAGE UPLOAD ------------
  //default image preview
  editImagePath:string = '/assets/images/categories/noimage.jpg';

  //uploaded image will be assigned to this variable
  fileToUpload:File;

  //file Selector (used to reset upload field if it is not of image type)
  @ViewChild('file') elFile:ElementRef;
  //----------------------------------

  //ngb Nav TABSET SELECTOR
  @ViewChild('nav') elName:any;


  //______________________________
  // DYNAMIC VALIDATION MESSAGES
  //______________________________
  //formControlNames
  formErrors = {
    name: '',
    title: '',
    isSave: '',
    link: '',
  };
  //validationMessage for each ControlName
  validationMessage = {
    name:{
      required:'Name is required',
      minlength:'Name cannot be less than 3 characters long',
      maxlength:'Name cannot be more than 15 characters long',
      validTextField:'Name must contain only numbers & letters',
      noWhiteSpaceValidator:'Only WhiteSpaces is not allowed'
    },
    title:{
      required:'Title is required',
      minlength:'Title cannot be less than 3 characters long',
      maxlength:'Title cannot be more than 15 characters long',
      validTextField:'Title must contain only numbers & letters',
      noWhiteSpaceValidator:'Only WhiteSpaces is not allowed'
    },
    isSave:{
      required:'Save Value is required',
      minlength:'Save Value cannot be less than 1 characters long',
      maxlength:'Save Value cannot be more than 2 characters long',
      validNumericField:'Save Value must contain only numbers',
      noWhiteSpaceValidator:'Only WhiteSpaces is not allowed'
    },
    link:{
      required:'Link is required',
      minlength:'Link cannot be less than 10 characters long',
      maxlength:'Link cannot be more than 100 characters long',
      noWhiteSpaceValidator:'Only WhiteSpaces is not allowed'
    }
  }


  //Dependency Injection
  constructor(private _dataService:DataService,private _toastr:ToastrService,private _fb:FormBuilder) { }

  ngOnInit(): void {
    this.setFormState(); //FormModel
    this.getData(); //Binding Table data from API
  }

  //________________
  // FORM MODEL
  //________________
  setFormState(){
    //default form settings
    this.dbOps = DbOperations.create;
    this.buttonText = "Submit";

    //Form Model
    this.addForm = this._fb.group({
      //form API docs
      id:[0],

      //formControls
      name:['',Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(15),TextFieldValidator.validTextField,NoWhiteSpaceValidator.noWhiteSpaceValidator])],
      title:['',Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(15),TextFieldValidator.validTextField,NoWhiteSpaceValidator.noWhiteSpaceValidator])],
      isSave:['',Validators.compose([Validators.required,Validators.minLength(1),Validators.maxLength(2),NumericFieldValidator.validNumericField,NoWhiteSpaceValidator.noWhiteSpaceValidator])],
      link:['',Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(100),NoWhiteSpaceValidator.noWhiteSpaceValidator])]
    });


    //DYNAMIC FORM VALIDATION
    this.addForm.valueChanges.subscribe(()=>{
      //called for every ValueChange
      this.onValueChanges();
    });
  }

  //______________________________________________
  // VALUE CHANGES (Dynamic Validatior Function)
  //______________________________________________
  onValueChanges(){
    //console.log('value Changes');

    //if form is invalid
    if(!this.addForm){
      return;
    }

    //if form is valid
    //loop through Keys of formErrors
    for(const field of Object.keys(this.formErrors)){
      //here field = formControlName
      this.formErrors[field] = ' ';

      //get control instance
      const control = this.addForm.get(field);

      //check if control there , valueChanges, is invalid
      if(control && control.dirty && !control.valid){
        //ASSIGN message FormControls
        const message = this.validationMessage[field];

        //loop through keys of control.errors
        for(const key of Object.keys(control.errors)){

          //skip required validation (already done)
          if(key !== 'required'){
            this.formErrors[field] = this.formErrors[field] + message[key] + ' ';
          }
        }
      }
    }

  }

  //------------------
  // GETTER METHOD -> get formControl
  //------------------
  get f(){
    return this.addForm.controls;
  }

  //_______________________________
  // INSERT data from API -> table
  //_______________________________
  getData(){
    //call API
    this._dataService.get(Global.BASE_API_PATH + "Category/GetAll/").subscribe(res=>{
      if(res.isSuccess){
        //insert data -> table rows
        this.objRows = res.data;

        //console.log('CATEGORY MASTER: ',res.data);
      }else{
        this._toastr.error(res.errors[0], 'Category Master');
      }
    });
  }

  //____________________________________
  // TABLE BINDING + Default FormState
  //_____________________________________
  // Table Binding + deafult formState
  // called after ADD/UPDATE
  setForm(){
    this.dbOps = DbOperations.create;
    this.buttonText = "Submit";

    //file(reset image state) - Image
    this.editImagePath = '/assets/images/categories/noimage.jpg';
    this.fileToUpload = null;

    //get TableData(show Table)
    this.getData();
  }


  //========================
  // UPLOAD FILE FUNCTION
  //========================
  //To Preview file on Upload -> fileReader()
  //To read file as Binary Data -> fileData()

  upload(files:any){

    //Check if there is no file to  upload 
    //-------------------------------------
    if(files.Length === 0){
      return;
    }

    //console.log(files);    //FileList {0: File, length: 1}
    //console.log(files[0]); //File {name:'',size:'',LastModified:'',LastModifiedDate:'',time}

    //if there is file to upload
    //---------------------------
    //assign file type to type variable
    const type = files[0].type;

    //if file is not of type image extension => reset fileUpload field to null
     //check file type (match with image extension regx)
     if(type.match(/image\/*/) === null){
      this._toastr.error('Only images are supported', 'BrandLogo Master');
      this.elFile.nativeElement.value = '';
      return;
    }

    //if file is of type image extension => assign file to fileToUpload variable
    this.fileToUpload = files[0];

    //SHOW Image Preview on Upload (formReader())
    //-----------------------------
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



  //____________________ 
  // CANCEL FORM
  //____________________
  cancelForm(){
    this.addForm.reset({
      id:0 //not passed as formControl
    });
    //default formState
    this.dbOps = DbOperations.create;
    this.buttonText = "Submit";

    //file(reset image state)
    this.editImagePath = '/assets/images/categories/noimage.jpg';
    this.fileToUpload = null;

    //select ViewTab(show table) after cancelling form
    this.elName.select('viewTab');
  }


  //================
  // EDIT
  //================
  Edit(Id:number){
    this.dbOps = DbOperations.update;
    this.buttonText = "Update";

    //goto addTabset -> edit form(same as addForm)
    this.elName.select('addTab');

    //get row with Id
    this.objRow = this.objRows.find(x => x.id === Id);

    //UPDATE that row
    this.addForm.controls['id'].setValue(this.objRow.id);
    this.addForm.controls['name'].setValue(this.objRow.name);
    this.addForm.controls['title'].setValue(this.objRow.title);
    this.addForm.controls['isSave'].setValue(this.objRow.isSave);
    this.addForm.controls['link'].setValue(this.objRow.link);

    //update file preview (imagePath from API)
    this.editImagePath = this.objRow.imagePath;
  }

  //================
  // DELETE
  //================
  Delete(Id:number){
    //for delete operations(we need to pass Id as object)
    const obj = {
      id:Id
    };

    //Swal notification
    Swal.fire({
      title:'Are you sure?',
      text:'You will not be able to recover this record!',
      icon:'warning',
      showCancelButton:true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText:'No, keep it',
    }).then((result) =>{
      if(result.value){

        //call DELETE API
        this._dataService.post(Global.BASE_API_PATH + "Category/Delete/",obj).subscribe(res=>{
          if(res.isSuccess){
            Swal.fire('Deleted', 'Your record has been deleted', 'success');

            //select viewTab
            //this.elName.select('viewTab');

            //after deleting record -> show table
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

  //==============
  // onSubmit()
  //==============
  //same button is used for add/update operations depending upon dbOps (enum)
  
  /*::::: NOTE( CORS ERROR) ::::: */
  /*CROS Cross Origin Issue - unable to connect with database When API is called -> request is unable to reach API server
    usually in Case when some API method requires 2 parameters (name,image) but in angular application we called Post method & passed single parameter to it (name)
    Here for images Upload/Update - postImages() - no header Content-Type instead of post()
    DONT stringify image -> bytes will be lost (Make new Post route:postImages)*/
  /* for images we use postImages() route + pass binary data to it*/
  
  onSubmit(){

    //SET BinaryData for Image Upload
    //_____________________________
    //IMAGE UPLOAD (BINARY DATA)
    //_____________________________
    //if ADD(create operation) & there is no file to upload
    if(this.dbOps === DbOperations.create && !this.fileToUpload){
      this._toastr.error('Please Upload Image !!', 'Category Master');
      return;
    }


    //FORMDATA (BINARY DATA)
    //------------------------
    //To 'Upload Image clientSide' work on formData instance
    //if we upload image using formGroup - we get image value as string
    //2)to send image value as BinaryData -> create formData instance & append values to it
    //formData instance
    const formData = new FormData();

    //append values to formData => Binary Data
    formData.append("Id", this.addForm.controls['id'].value);
    formData.append("Name", this.addForm.controls['name'].value);
    formData.append("Title", this.addForm.controls['title'].value);
    formData.append("isSave", this.addForm.controls['isSave'].value);
    formData.append("Link", this.addForm.controls["link"].value);

    //IMAGE(appending file to formData(binary data))
    //If there is file to be Uploaded(used in Edit operation) - pass name of file('uploaded file')
    if(this.fileToUpload){
      formData.append("Image",this.fileToUpload, this.fileToUpload.name);
    };
    //___________________________________

    switch(this.dbOps){

      //ADD Form
      case DbOperations.create:
        this._dataService.postImages(Global.BASE_API_PATH + "Category/Save/", formData).subscribe((res:any)=>{
          if(res.isSuccess){
            //toastr notification
            this._toastr.success('Data Saved Successfully', 'Category Master');

            //call Table Binding + deafult formState
            this.setForm();

            //change to viewTab after updating record
            this.elName.select('viewTab');
          }else{
            this._toastr.error(res.errors[0], 'Category Master');
          }
        });
      break;

      //UPDATE Form
      case DbOperations.update:
        this._dataService.postImages(Global.BASE_API_PATH + "Category/Update/", formData).subscribe((res:any)=>{
          if(res.isSuccess){
            //toastr notification
            this._toastr.success('Data Updated Successfully', 'Category Master');

            //call Table Binding + deafult formState
            this.setForm();

            //change to viewTab after updating record
            this.elName.select('viewTab');
          }else{
            this._toastr.error(res.errors[0], 'Category Master');
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

  //Implement server side pagination here
  setPage(event:any){
    //console.log(event);
  }

  //------------------------------------------------
  //When changing from addTab -> viewTab reset form
  //------------------------------------------------
  //change formState onChanging Tabset
  //(navChange) = "onTabChange($event)"
  onTabChange(event:any){
    //viewTab TABSET
    if(event.activeId === 'viewTab'){
      this.getData();
    }

    //addTab TABSET
    if(event.activeId === 'addTab'){
      //reset form
      this.addForm.reset({
        id:0 //not passed as formControl
      });
      //reset form state
      this.dbOps = DbOperations.create;
      this.buttonText = "Submit";

      //reset image state
      this.editImagePath = '/assets/images/categories/noimage.jpg';
      this.fileToUpload = null;
    }
  }
}
