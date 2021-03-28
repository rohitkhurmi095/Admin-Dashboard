import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit,OnDestroy {

  //TABLE
  objRows:any[] = []; //table rows
  objRow:any;        //to edit single row

  //dataService,toastr notification,router
  constructor(private _dataService:DataService,private _toastr:ToastrService, private router:Router) { }

  ngOnInit(): void {
    this.getData(); //show table binding
  }


  //__________________________________________
  //Bind API Data -> Table (rows (objRows[]))
  //__________________________________________
  getData(){
    this._dataService.get(Global.BASE_API_PATH + "ProductMaster/GetAll/").subscribe(res=>{
      if(res.isSuccess){
        //insert API data -> products table rows
        this.objRows = res.data;

        //to know table columns(data from API)
        //console.log('PRODUCT LIST',res.data);
      }else{
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }


  Edit(Id:number){
    //we dont have EDIT Form(submit form) on this component 
    //we need to edit data using id(from product-list table)
    //pass id from product-list table (this component) -> add-product form (to EDIT Form)
    //so Edit Product operations will be performed on add-product component

    //passing Id of Product row from product-list table -> add-product from (using queryParams by router)
    //receive Id of Product row on add-product form using activatedRoute
    this.router.navigate(['/products/physical/add-product'],{
      queryParams:{
        //Id of row received in Edit
        productId:Id
      }
    })
  }

  
  //=================
  // DELETE 
  //=================
  Delete(Id:number){
    //for delete operations -> we need to pass id as object
    const obj = {
      id:Id
    }

    //Sweetalert2 popup box
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record !!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result)=>{
      if(result.value){
        //call delete API
        this._dataService.post(Global.BASE_API_PATH + "ProductMaster/Delete/",obj).subscribe(res=>{
          if(res.isSuccess){
            Swal.fire('Deleted', 'Your record has been deleted', 'success');

            //after deleting record -> show table
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
