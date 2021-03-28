import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  //TABLE ROW (insert API data here)
  invoice:any[]=[]; 

  //DEFINE TABLE COLUMNS NAME table 
  settings={

    //ng2-smart-table gives actions table by default
    //to avoid adding actions set actions:false
    actions:false,
    hideSubHeader:false,

    //COLUMNS
    columns:{

      invoiceNo: {
        title:'Invoice No',
        filter:true
      },
      paymentStatus:{
        title:'Payment Status',   //columnTitle
        filter:true,              //filterColumn
        type:'html'               //html formatted output
      },
      paymentMethod:{
        title:'Payment Method',
        filter:true
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
      subTotalAmount:{
        title:'SubTotal Amount',
        filter:true
      },
      shippingAmount:{
        title:'Shipping Amount',
        filter:true
      },
      totalAmount:{
        title:'Total Amount',
        filter:true
      }

    },

    //pagination
    pager:{
      display:true,
      perPage: 10
    },

   
  };



  constructor(private _dataService:DataService,private _toastr:ToastrService) { }

  ngOnInit(): void {
    this.getData(); //calling table binding method
  }

  //===============================
  // INSERT Data from API -> TABLE 
  //===============================
  getData(){
    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetReportInvoiceList/").subscribe(res=>{
      if(res.isSuccess){
        //insert API data -> products table rows
        this.invoice = res.data;

        //know table rows
        console.log('INVOICE: ',res.data);
      }else{
        this._toastr.error(res.errors[0], 'Invoice');
      }
    });
  }



}

