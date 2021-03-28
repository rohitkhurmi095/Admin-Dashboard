import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  //table rows (insert API data here)
  orders:any[] = [];

  //table columns(define table columns properties + title here)
  settings = {
    //ng2-smart-table gives actions table by default
    //to avoid adding actions set actions:false
    actions:false,
    hideSubHeader:false,

    //Column
    columns:{

      orderId:{
        title:'Order Id',
        filter:true
      }, 
      paymentStatus: {
        title:'Payment Staus',
        filter:true,
        type:'html'
      },
      paymentMethod:{
        title:'Payment Method',
        filter:true,
        type:'html'
      },
      orderStatus:{
        title:'Order Status',
        filter:true,
        type:'html'
      },
      paymentDate:{
        title:'Payment Date',
        filter:true
      },
      subTotalAmount: {
        title:'SubTotal Amount',
        filter:true
      },
      shippingAmount: {
        title:'Shipping Amount',
        filter:true,
      },
      totalAmount:{
        title:'Total Amount',
        filter:true,
      }

    },

    //Pagination
    pager:{
      display:true,
      perPage:10
    }
  };

  
  //Dependency Injection
  constructor(private _dataService:DataService,private _toastr:ToastrService) { }

  ngOnInit(): void {
    this.getData(); //table binding method
  }

  //====================================
  // Insert Data from API -> Table rows
  //====================================
  getData(){
    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetReportManageOrder/").subscribe(res=>{
      if(res.isSuccess){
          //insert API data -> products table rows
          this.orders = res.data;

          //know table rows
          //console.log('ORDERS: ',res.data);
      }else{
        this._toastr.error(res.errors[0], 'Orders');
      }
    });
  }

}
