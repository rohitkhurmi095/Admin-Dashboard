import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  //table rows (insert data from API here)
  transactions:any[]=[];

  //table columns settings + title
  settings = {
    //ng2-smart-table gives actions table by default
    //to avoid adding actions set actions:false
    actions:false,
    hideSubHeader:false,

    //columns
    columns:{

      transactionsId:{
        title:'Transactions Id',
        filter:true
      },
      paymentStatus:{
        title:'Payment Status',
        filter:true,
        type:'html'
      },
      paymentMethod:{
        title:'Payment Method',
        filter:true,
      },
      paymentDate:{
        title:'Payment Date',
        filter:true
      },
      orderId:{
        title:'Order Id',
        filter:true
      },
      orderStatus:{
        title:'Order Status',
        filter:true,
        type:'html'
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

    //pagination
    pager:{
      display:true,
      perPage:10
    }
  };


  //Dependency Injection
  constructor(private _dataService:DataService,private _toastr:ToastrService) { }

  ngOnInit(): void {
    this.getData(); //Table Binding Method
  }

  //====================================
  // Insert Data from API -> Table rows
  //====================================
  getData(){
    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetReportTransactionDetails/").subscribe(res=>{
      if(res.isSuccess){
          //insert API data -> products table rows
          this.transactions = res.data;

          //know table rows
          //console.log('TRANSACTIONS: ',res.data);
      }else{
        this._toastr.error(res.errors[0], 'Transactions');
      }
    });
  }

}
