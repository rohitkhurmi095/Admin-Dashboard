import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//toastr notifications
import { ToastrService } from 'ngx-toastr';
//custom validators
import { NoWhiteSpaceValidator, NumericFieldValidator, TextFieldValidator } from '../../../../validators/validation.validators';
//DbOpearations enum
import { DbOperations } from '../../../../shared/db-operations';
//BASE API Path
import { Global } from '../../../../shared/global';
//DataService
import { DataService } from '../../../../shared/services/data.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit,OnDestroy {

  //product form instance
  productForm:FormGroup;
  submitted:boolean = false;

  //productId (to be recieved from Product-list table : to edit product details (Form))
  productId:number = 0;
  //to edit single product row details
  ObjRow:any;

  //DbOperations Enum
  dbOps:DbOperations;
  //buttonText
  buttonText:string;

  //----- File Upload + Product PREVIEW Images-----
  //here we need to upload multiple files

  //uploaded file will be assigned to this variable
  fileToUpload:File[] = [];

  //used to reset file upload field if file is not image type
  @ViewChild('file') elFile:ElementRef;

  //Big Image(preview)
  bigImage = '/assets/images/products/big.jpg';

  //small images (5) preview
  url = [
    {img: '/assets/images/products/noimage.jpg'},
    {img: '/assets/images/products/noimage.jpg'},
    {img: '/assets/images/products/noimage.jpg'},
    {img: '/assets/images/products/noimage.jpg'},
    {img: '/assets/images/products/noimage.jpg'},
  ]
  //-----------------------

  //Product Quantity Counter
  counter:number = 0;

  //----- SELECTOR ------
  //call color,size,tag,user master API + assign data to these objects to use in selector
  objSizes :any[] = [];
  objCategories :any[] = [];
  objColors :any[] = [];
  objTags :any[] = [];
  //---------------------


  //_____________________________
  // DYNAMIC Validation Messages
  //_____________________________
  //------------------
  //formControlNames
  //------------------
  formErrors = {
     //selectors
     sizeId:'',
     colorId:'',
     categoryId:'',
     tagId:'',
     //inputs**
     name: '',
     title: '',
     code: '',
     price: '',
     salePrice: '',
     discount: '',
  };
  //--------------------
  //validationMessages
  //--------------------
  validationMessage = {
     //selectors**
     sizeId:{ required: 'Size is required'},
     colorId:{ required: 'Color is required'},
     categoryId:{required: 'Category is required'},
     tagId:{required: 'Tag is required'},
     
     //inputs**
     name: {
      required: 'Name is required',
      minlength: "Name can not be less then 3 characters long",
      maxlength: "Name can not be more then 15 characters long",
      validTextField: 'Name must be contains only numbers and letters',
      noWhiteSpaceValidator: 'Only white space is not allowed'
     },
     title: {
      required: 'Title is required',
      minlength: "Title can not be less then 3 characters long",
      maxlength: "Title can not be more then 15 characters long",
      validTextField: 'Title must be contains only numbers and letters',
      noWhiteSpaceValidator: 'Only white space is not allowed'
     },
     code: {
      required: 'Code is required',
      minlength: "Code can not be less then 3 characters long",
      maxlength: "Code can not be more then 10 characters long",
      validTextField: 'Code must be contains only numbers and letters',
      noWhiteSpaceValidator: 'Only white space is not allowed'
     },
     price: {
      required: 'Price is required',
      minlength: "Price can not be less then 1 characters long",
      maxlength: "Price can not be more then 10 characters long",
      validNumericField: 'Price must be contains only numbers',
      noWhiteSpaceValidator: 'Only white space is not allowed'
     },
     salePrice: {
      required: 'Sale Price is required',
      minlength: "Sale Price can not be less then 1 characters long",
      maxlength: "Sale Price can not be more then 10 characters long",
      validNumericField: 'Sale Price must be contains only numbers',
      noWhiteSpaceValidator: 'Only white space is not allowed'
     },
     discount: {
      required: 'Discount is required',
      minlength: "Discount can not be less then 1 characters long",
      maxlength: "Discount can not be more then 10 characters long",
      validNumericField: 'Discount must be contains only numbers',
      noWhiteSpaceValidator: 'Only white space is not allowed'
     },
  }
  //-----------------------------------------------------------


  //DEPENDENCY RESOLUTION
  //dataService,toastr notificaiton,formBuilder,activated Route
  constructor(private _dataService:DataService,private _toastr:ToastrService,private _fb:FormBuilder,private route:ActivatedRoute,private router:Router) { 
    
    //receive queryParams(userId:Id(of row to be Edited)) -> using activated Route
    //receive userId from /products/physical/product-list table : by suscribing queryParam
    this.route.queryParams.subscribe(params =>{
      //console.log(params['productId']);
      this.productId = params['productId'];
    });
  }



  //When Bindings takes place
  ngOnInit(): void {

    //form Model
    this.setFormState();
    
    //SELECTORS (color,category,size,tag)
    this.getSizes();
    this.getCategories();
    this.getColors();
    this.getTags();


    //NOTE **
    //If productId is received then only fill Edit Form values(default values)
    //===============
    // EDIT 
    //===============
    //CHECK if productId is received (not null & > 0)
    if(this.productId != null && this.productId > 0){
      this.dbOps = DbOperations.update;
      this.buttonText = "Update"

      //func to Edit + update rows
      this.getProductById();
    }
    
  }


  //==============
  // Form Model
  //==============
  setFormState(){
    //default operations
    this.dbOps = DbOperations.create;
    this.buttonText = "Submit";

    this.productForm = this._fb.group({
      //from API docs**
      id:[0],
      
      //formControls**
      name: ['',Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15),TextFieldValidator.validTextField,NoWhiteSpaceValidator.noWhiteSpaceValidator])],
      title: ['',Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15),TextFieldValidator.validTextField,NoWhiteSpaceValidator.noWhiteSpaceValidator])],
      code: ['',Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10),TextFieldValidator.validTextField,NoWhiteSpaceValidator.noWhiteSpaceValidator])],
      price: ['',Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15),NumericFieldValidator.validNumericField,NoWhiteSpaceValidator.noWhiteSpaceValidator])],
      salePrice: ['',Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15),NumericFieldValidator.validNumericField,NoWhiteSpaceValidator.noWhiteSpaceValidator])],
      discount: ['',Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15),NumericFieldValidator.validNumericField,NoWhiteSpaceValidator.noWhiteSpaceValidator])],      
      //for selectors
      sizeId:['',Validators.required],
      colorId:['',Validators.required],
      categoryId:['',Validators.required],
      tagId:['',Validators.required],
      //counter
      quantity:[''],
      //tickBoxes(radio button)
      isSale:[''],
      isNew:[''],
      //textarea
      shortDetails: [''],
      //ngx-ckEditor -  EDITOR
      description:['']
    });

    //Note: by default there should be atleast 1 product
    this.productForm.controls['quantity'].setValue(1);

    
    //Dynamic Validations
    this.productForm.valueChanges.subscribe(()=>{
      //called for every value change
      this.onValueChanges();
    });

  }

  //----------------
  // GETTER METHOD -get formControls
  //----------------
  get f(){
    return this.productForm.controls;
  }


  //__________________________
  // DYNAMIC FORM VALIDATOR
  //__________________________
  onValueChanges(){
    //console.log('Value Changes');

    //if form is invalid
    if(!this.productForm){
      return;
    }

    //if form is valid
    //loop through field of formErrors
    for(const field of Object.keys(this.formErrors)){
      //here field = formControlName (eg:name)
      this.formErrors[field] = '';
      //get control
      const control = this.productForm.get(field);

      //check if control is there + valueChanges(dirty) + invalid
      if(control && control.dirty && !control.valid){
        //assign validation message to control
        const message = this.validationMessage[field];

        //loop through keys of control.error
        for(const key of Object.keys(control.errors)){
          //key = error
          //bypass required validation message (already checked)
          if(key != 'required'){
            this.formErrors[field] = this.formErrors[field] + message[key] + ' ';
          }
        }
      }
      
    }
  
  }



  //==================================
  // FILE UPLOADER (Multiple Files[])
  //==================================
  // i = index while looping url[{img:'',...5times}]
  //(change)="upload(file.files,i)" -> user files[0]
  //(change)="upload($event,i)" -> use event.target.files[0]
  upload(event:any,i:number){
    
    //if there is no file to upload
    //------------------------------
    if(event.target.files.Length === 0){
      return;
    }

    //if there is file to be uploaded
    //--------------------------------
    //check file type
    const type = event.target.files[0].type;

    //if type does not matches image file type extension => reset upload field
    if(type.match(/image\/*/) == null){
      this._toastr.error('Only images are supported', 'Product Master');

      //reset upload field
      this.elFile.nativeElement.value = '';
      return;
    }
    //if type matches image file type extension => upload file (Assing to fileToUpload variable)
    this.fileToUpload[i] = event.target.files[0];

    //show IMAGE PREVIEW ON UPLOAD
    //-----------------------------
    const reader = new FileReader();
    
    //read imageAsDataURL (read image as data)
    reader.readAsDataURL(event.target.files[0]);

    //call onload() event of reader => to load image
    reader.onload = () =>{
      this.url[i].img = reader.result.toString();
    }

  }



  //===============================
  //GET SINGLE PRODUCT (row) BY ID (received from product-list table(another component))
  //===============================
  //** TO EDIT PRODUCT **
  getProductById(){
    this._dataService.get(Global.BASE_API_PATH + "ProductMaster/GetbyId/" + this.productId).subscribe(res=>{
      if(res.isSuccess){

        //GET SINGLE PRODUCT (row) BY ID (received from product-list table(another component))
        this.ObjRow = res.data;
        //console.log('SINGLE ROW',this.ObjRow);

        //----------------------------------
        //UPDATE Single row (using setValue)
        //Update Edit Form with Current row Values(received from API by Id)
        //----------------------------------
        //** FORM FIELDS **
        //from Api docs
        this.productForm.controls['id'].setValue(this.ObjRow.id);
        //formControls
        this.productForm.controls['name'].setValue(this.ObjRow.name);
        this.productForm.controls['title'].setValue(this.ObjRow.title);
        this.productForm.controls['code'].setValue(this.ObjRow.code);
        this.productForm.controls['price'].setValue(this.ObjRow.price);      
        this.productForm.controls['salePrice'].setValue(this.ObjRow.salePrice);
        this.productForm.controls['discount'].setValue(this.ObjRow.discount);

        //set counter value to quantity
        this.productForm.controls['quantity'].setValue(this.ObjRow.quantity);
        //so that counter value starts from current quantity
        this.counter = this.ObjRow.quantity; 

        this.productForm.controls['colorId'].setValue(this.ObjRow.colorId);
        this.productForm.controls['sizeId'].setValue(this.ObjRow.sizeId);
        this.productForm.controls['tagId'].setValue(this.ObjRow.tagId);
        this.productForm.controls['categoryId'].setValue(this.ObjRow.categoryId);

        this.productForm.controls['isSale'].setValue(this.ObjRow.isSale);
        this.productForm.controls['isNew'].setValue(this.ObjRow.isNew);

        this.productForm.controls['shortDetails'].setValue(this.ObjRow.shortDetails);
        this.productForm.controls['description'].setValue(this.ObjRow.description);

        //** IMAGES  ** (5 images)
        //Update Product Images
        //get all image mapped to product using productId
        //we used seprate API route to get Images: /api/ProductMaster/GetProductPicturebyId/{Id}
        this._dataService.get(Global.BASE_API_PATH + "ProductMaster/GetProductPicturebyId/" + this.productId).subscribe(res=>{
          if(res.isSuccess){

            if(res.data.length > 0){
              //console.log('PRODUCT IMAGES: ',res.data);
              //images
              /*for(let i=0;i<res.data.length;i++){
                this.url = [
                  let index = res.data[i];
                  {img: index != null ? Global.BASE_IMAGES_PATH + index : 'assets/images/products/noimage.jpg'}
                ]
              }*/

              this.url = [
                {img: res.data[0] != null ? Global.BASE_IMAGES_PATH + res.data[0].name : 'assets/images/products/noimage.jpg'},
                {img: res.data[1] != null ? Global.BASE_IMAGES_PATH + res.data[1].name : 'assets/images/products/noimage.jpg'},
                {img: res.data[2] != null ? Global.BASE_IMAGES_PATH + res.data[2].name : 'assets/images/products/noimage.jpg'},
                {img: res.data[3] != null ? Global.BASE_IMAGES_PATH + res.data[3].name : 'assets/images/products/noimage.jpg'},
                {img: res.data[4] != null ? Global.BASE_IMAGES_PATH + res.data[4].name : 'assets/images/products/noimage.jpg'},
              ]
            };

          }else{
            this._toastr.error(res.errors[0], 'Product Master');
          }
        }); 

      }else{
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }


  //===============================
  // SUBMIT FORM (ADD/UPDATE Form)
  //===============================
  //same button is used for ADD/UPDATE based on DbOpeation enum (dbOps)
  onSubmit(){
    this.submitted = true;

    //if not 5 images (similar case as !this.file to upload)
    if(this.dbOps === DbOperations.create && this.fileToUpload.length < 5){
      this._toastr.error("Please Upload 5 image per product!!", 'Product Master');
      return;
    }

    //________________________
    // formData (BINARY DATA)
    //_________________________
    //if we pass formData using formGroup => string data
    //pass formData using formData instance => Binary Data (For image upload - postImages)
    //formData instance
    const formData = new FormData();

    //APPEND DATA to formData instance -> pass while calling API
    //from api docs
    formData.append("Id",this.productForm.controls['id'].value);

    //formFields
    formData.append("Name",this.productForm.controls['name'].value);
    formData.append("Title",this.productForm.controls['title'].value);
    formData.append("Code", this.productForm.controls['code'].value);
    formData.append("Price",this.productForm.controls['price'].value);
    formData.append("SalePrice",this.productForm.controls['salePrice'].value);
    formData.append("Discount",this.productForm.controls['discount'].value);
    
    formData.append("SizeId",this.productForm.controls['sizeId'].value);
    formData.append("TagId",this.productForm.controls['tagId'].value);
    formData.append("ColorId",this.productForm.controls['colorId'].value);
    formData.append("CategoryId",this.productForm.controls['categoryId'].value);
    
    formData.append("Quantity",this.productForm.controls['quantity'].value);
    
    formData.append("IsSale",this.productForm.controls['isSale'].value);
    formData.append("IsNew",this.productForm.controls['isNew'].value);
    
    formData.append("ShortDetails",this.productForm.controls['shortDetails'].value);
    formData.append("Description",this.productForm.controls['description'].value);

    //if file to upload
    //fileToUpload = []
    if(this.fileToUpload){
      for(let i=0; i<this.fileToUpload.length; i++){
        let ToUpload = this.fileToUpload[i]; //break reference
        formData.append("Image", ToUpload, ToUpload.name);

        //**NOT SAME as ABOVE
        //array is ref. type variable (last value index will be assigned to all elements)
        //formData.append("Image", this.fileToUpload[i], this.fileToUpload[i].name);
      }
    }


    //if form is valid - Submit
    //---------------------------
    switch (this.dbOps) {

      //ADD FORM
      case DbOperations.create:
        this._dataService.postImages(Global.BASE_API_PATH + "ProductMaster/Save/", formData).subscribe((res:any)=>{
          if(res.isSuccess){
            //success notification
            this._toastr.success("Data Saved successfully !!", "Product Master");

            //RESET Form + submitted = false after adding record
            this.productForm.reset();
            this.submitted = false;

            //after adding product navigate to prouct-list table(another component)
            this.router.navigate(['/products/physical/product-list']);

          }else{
              //error notification
              this._toastr.error(res.errors[0], 'Product Master');
          }
        });
      break;
    
      //UPDATE FORM
      case DbOperations.update:
        this._dataService.postImages(Global.BASE_API_PATH + "ProductMaster/Update/", formData).subscribe((res:any)=>{
          if(res.isSuccess){
            //success notification
            this._toastr.success("Data Update successfully !!", "Product Master");

            //RESET Form + submitted = false after adding record
            this.productForm.reset();
            this.submitted = false;

            //after updating product navigate to prouct-list table(another component)
            this.router.navigate(['/products/physical/product-list']);
            
          }else{
            //error notification
            this._toastr.error(res.errors[0], 'Product Master');
          }
        });
        break
    }

  }


  //_______________
  // CANCEL FORM
  //_______________
  cancelForm(){
    //reset default state
    this.dbOps = DbOperations.create;
    this.buttonText = "Submit";
    //reset form
    this.productForm.reset({
      id:0 //not passed as formControl
    });
 
    //after canceling form -> show product-details table
    //navigate to -> '/products/physical/product-list'
    this.router.navigate(['/products/physical/product-list']);
  }


  //------------------------------------
  // INCREMENT/DECREMENT Quantity Counter
  //-------------------------------------
  increment(){
    //increment count
    this.counter = this.counter + 1;
    //update quantity
    this.productForm.controls['quantity'].setValue(this.counter);
  }

  decrement(){
    //decrement count
    this.counter = this.counter - 1;
    //update quantity
    this.productForm.controls['quantity'].setValue(this.counter);
  }



  //________________________________
  // SELECTOR for SIZE MASTER 
  //________________________________
  //call Size master API(Masters) 
  getSizes(){
    this._dataService.get(Global.BASE_API_PATH + "SizeMaster/GetAll/").subscribe(res=>{
      if(res.isSuccess){
        //objSizes[] -> assign all Sizes
        this.objSizes = res.data;
      }else{
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }

  
  //________________________________
  // SELECTOR for CATEGORY MASTER 
  //________________________________
  //call Category master API(Masters) 
  getCategories(){
    this._dataService.get(Global.BASE_API_PATH + "Category/GetAll/").subscribe(res=>{
      if(res.isSuccess){
        //objCategories[] -> assign all categpries
        this.objCategories = res.data;
      }else{
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }

  
  //________________________________
  // SELECTOR for COLOR MASTER 
  //________________________________
  //call Color master API(Masters) 
  getColors(){
    this._dataService.get(Global.BASE_API_PATH + "ColorMaster/GetAll/").subscribe(res=>{
      if(res.isSuccess){
        //objColor[] -> assign all Colors
        this.objColors = res.data;
      }else{
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }
  
  //________________________________
  // SELECTOR for TAG MASTER 
  //________________________________
  //call Tag master API(Masters) 
  getTags(){
    this._dataService.get(Global.BASE_API_PATH + "TagMaster/GetAll/").subscribe(res=>{
      if(res.isSuccess){
        //objTag[] -> assign all tags
        this.objTags = res.data;
      }else{
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }

  //===========================
  //DESTROY variable after used
  //============================
  //when user leaves the page
  ngOnDestroy(){
    this.ObjRow = null;
    this.fileToUpload = null;
    this.objCategories = null;
    this.objColors = null;
    this.objSizes = null;
    this.objTags = null
  }

} 



