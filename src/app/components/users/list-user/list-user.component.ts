import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//toastr notifications
import { ToastrService } from 'ngx-toastr';
//BASE API URL
import { Global } from 'src/app/shared/global';
//dataService
import { DataService } from 'src/app/shared/services/data.service';
//popupbox
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit,OnDestroy {
 
  //Table
  objRows:any[]=[];
  //objRow:any; (used in EDIT in create-user component)
 
  constructor(private _dataService:DataService, private _toastr:ToastrService, private router:Router) { }

  ngOnInit(): void {
    this.getData(); //get table data from API
  }

  //====================================
  // INSERT DATA FROM API -> TABLE ROWS
  //=====================================
  getData(){
    this._dataService.get(Global.BASE_API_PATH + "UserMaster/GetAll/").subscribe(res=>{
      if(res.isSuccess){
        //insert API data -> table rows
        this.objRows = res.data;

        //to know table response columns 
        //console.log('USER MASTER: ',res.data);
      }else{
        this._toastr.error(res.errors[0], 'User Master');
      }
    });
  }

  //============
  // EDIT
  //============
  //We dont have Edit(Add) form & table on the same component
  //so from table component we pass the id of row to be edited -> to -> Edit Form component using router.nagivate()
  //receive the id on the Edit form Component using activatedRoute instance -> To Edit Form Values
  Edit(Id:number){

    //console.log('Edit row with Id: ', Id);
    
    //we dont have Edit Form here - it is available on '/users/create-user'
    //navigate to this url by passing Id  or row to be edited as queryParam
    //fill default values before editing + update operations on EditForm Component

    //navigate to Edit Form
    this.router.navigate(['/users/create-user'], {
      queryParams:{
        //Id of row received in Edit
        userId:Id
      }
    });

  }

  //=============
  // DELETE
  //=============
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
        this._dataService.post(Global.BASE_API_PATH + "UserMaster/Delete/",obj).subscribe(res=>{
          if(res.isSuccess){
            Swal.fire('Deleted', 'Your record has been deleted', 'success');

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

   
  //Remove variable declertion values after used
  //when user leaves the page
  ngOnDestroy(){
    this.objRows = [];
  }


  //Implement server side sorting here
  onSort(event:any){
    //console.log(event);
  }

  //Implement server side pagination here
  setPage(event:any){
    //console.log(event);
  }
}
