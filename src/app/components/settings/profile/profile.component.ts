import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  //----- USER DETAILS -----  
  fullName:string;
  firstName:string;
  lastName:string;
  email:string;
  userDetails:any;

  //** PROFILE IMAGE Uplaod **
  fileToUpload:File;
  //To reset image upload field(if uploaded file is not of type image extension)
  @ViewChild('file') elFile:ElementRef;
  
  //default profile image if there is no image to upload
  imagePath:string = "/assets/images/dashboard/user.png";

  //default Upload file Preview Image from assets folder
  editImagePath = '/assets/images/brandlogo/noimage.jpg';
  //--------------------------

  //TABSET Selector
  @ViewChild('nav') elName:any;

  
  //dataService, toastrNotification, formBuilder, router
  constructor(private _dataService:DataService,private _toastr:ToastrService,private router:Router) { }

  //when bindings takes place
  ngOnInit(): void {

    //------------------
    // USER DETAILS
    //------------------
    //we have userDetais stored in localStorage - set in login Component (authService)
    //to get user details in profile component
    //get userDetails from localStorage

    //userDetails (object)
    this.userDetails =  JSON.parse(localStorage.getItem('userDetails'));
    
    //console.log('OBJ userDetails:',this.userDetails);
    /*  email: "aaa@gmail.com" 
        firstName: "Ajeet"
        id: 1
        imagePath: ""
        lastName: "Singh"
        token: "JWT Token herer"
        userType: "Customer"
        userTypeId: 3
    */

    this.firstName = this.userDetails.firstName;
    this.lastName = this.userDetails.lastName;
    this.email = this.userDetails.email;
    this.fullName = `${this.userDetails.firstName} ${this.userDetails.lastName}`;

    //profile image = Global.BASE_IMAGES_PATH + this.userDetails.imagePath
    this.imagePath = (this.userDetails.imagePath == "" || this.userDetails.imagePath == null)? 'assets/images/dashboard/user.png' : Global.BASE_USER_IMAGES_PATH+ this.userDetails.imagePath;
    //--------------------

  }


  //=======================
  // UPLOAD PROFILE IMAGE
  //=======================
  upload(files:any){
    
    //if there is no file to upload
    //------------------------------
    if(files.Length === 0){
      return;
    }

    //if there is file to be uploaded
    //--------------------------------
    //check file type 
    const type = files[0].type; // /image/jpeg

    //if type does not matches image file extension
    if(type.match(/image\/*/) === null){
      this._toastr.error('Only images are supported', 'User Master');
      //reset upload field 
      this.elFile.nativeElement.value = "";
      return;
    }
    //if type matches image file extension  -> Upload + assign to fileToUpload Variable
    this.fileToUpload = files[0];  


    //SHOW IMAGE PREVIEW ON IMAGE UPLOAD
    //------------------------------------
    const reader = new FileReader();

    //read imageAsDataURL (read image as data)
    reader.readAsDataURL(files[0]);

    //assign (Preview Image) editImagePath(string) to reader.result(converted to string) 
    reader.onload = () =>{
      this.editImagePath = reader.result.toString();
    };
  }


 //========================
 // Submit Uploaded Image
 //========================
 onSubmit(){

    //----------------------------
    // Image Upload (Binary Data)
    //----------------------------
    //if there is no fileToUpload
    if(!this.fileToUpload){
      this._toastr.error("Please upload image !!", "User Master");
      return;
    }

    //to upload images -> postImages route
    //To 'Upload Image clientSide' work on formData instance
    //if we upload image using formGroup - we get image value as string
    //2)to send image value as BinaryData -> create formData instance & append values to it
    //formData instance - formData will be passed while calling API 
    const formData = new FormData();
  
    formData.append("Id", this.userDetails.id);
    //if there is file to upload
    if(this.fileToUpload){
      formData.append("Image", this.fileToUpload, this.fileToUpload.name);
    }

    //UPLOADED Image change will not be shown instantly 
    //(as res is updated(we already received the res), logout & receive res again)
    //this change will be shown only when user logout, then login again
    //show = sweetalert2 popup box
    this._dataService.postImages(Global.BASE_API_PATH + "UserMaster/UpdateProfile/",formData).subscribe((res:any) =>{
      if(res.isSuccess){
        //upadte success notification
        this._toastr.success("Profile Updated Successfully !!", "User Master");

        //reset file upload field on update
        this.elFile.nativeElement.value = "";

        //show = sweetalert2 popup box
        //logout to see updated profile image
        //else No => you will see updated profile next time you login again
        Swal.fire({
          title:'Are you sure?',
          text:'Do you want to see this change right now ? !!',
          icon:'warning',
          showCancelButton:true,
          confirmButtonText: 'Yes, right now!',
          cancelButtonText:'No, keep it',
        }).then((result)=>{
          if(result.value){
            //if user want to see this change right now
            //navigate to login page (logout user -> login again)
            this.router.navigate(['auth/login']);
          }else if(result.dismiss === Swal.DismissReason.cancel){
            Swal.fire('Cancelled', 'Your record is safe:)', 'error');
          }
        });

      }else{
        this._toastr.error(res.errors[0], "User Master");
      }
    });
    
  }
}
