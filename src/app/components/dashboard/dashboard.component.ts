import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    //-------- TABLE ------------
    //table rows (insert API data here)
    ordersRow:any[] = [];

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
          filter:false
        }, 
        orderStatus:{
          title:'Order Status',
          filter:false,
          type:'html'
        },
        paymentMethod:{
          title:'Payment Method',
          filter:false
        },
        paymentDate:{
          title:'Payment Date',
          filter:false
        },
        totalAmount:{
          title:'Total Amount',
          filter:false
        }

      },
  
      //Pagination
      pager:{
        display:true,
        perPage:10
      }
    };
    //---------------------------

    //------ COUNTER -------------
    //net figure API 
    varorders:number;        
    varshipAmt:number;        
    varcashOnDelivery:number; 
    varcancelled:number;      
    //----------------------------

  constructor(private _dataService:DataService,private _toastr:ToastrService) { }

  ngOnInit(): void {
    this.getData();       //Table Binding Method
    this.getNetFigure(); //NetFigureCount for counter
  }

  
  //====================================
  // Insert Data from API -> Table rows
  //====================================
  getData(){
    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetReportManageOrder/").subscribe(res=>{
      if(res.isSuccess){
          //insert API data -> products table rows
          this.ordersRow = res.data;

          //know table rows
          //console.log('ORDERS': ',res.data);
      }else{
        this._toastr.error(res.errors[0], 'Dashboard');
      }
    });
  }


  //----------------------------
  // Calling API for netFigure
  //----------------------------
  getNetFigure(){
    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetReportNetFigure/").subscribe(res=>{
      if(res.isSuccess){ 
        //know table rows
        //console.log('Net_Figure_Count: ',res.data);
        //console.log('Net_Figure_Count: ',res.data[0]);
        /* cancelled: 2520 cashOnDelivery: 23000 orders: 14460 shippingAmount: 866*/

        //Assign To Couter Values
        this.varorders = res.data[0].orders;        
        this.varshipAmt = res.data[0].shippingAmount;        
        this.varcashOnDelivery = res.data[0].cashOnDelivery; 
        this.varcancelled = res.data[0].cancelled;

      }else{
        this._toastr.error(res.errors[0], 'Dashboard');
      }
    });
  }


}
