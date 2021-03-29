import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';

//Common Chart File - CHART 1(properties)
import * as chartData from '../../shared/data/charts';

//Charts
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

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

    //======== CHARTS ============
    //------- Properties ---------
    //dataset
    lineChartData:any[] = [];
    //labels
    lineChartLabels:any[] = [];

    //legends
    lineChartLegend:any;
    //chart type
    lineChartType:any;
    //options
    lineChartOptions:any;
    //colors
    lineChartColors:any;

    //Dont show graph by default 
    //SHOW CHART ONLY IF DATA IS RECEIVED FROM API
    isShowOrderStatus:boolean = false;
    //----------------------------

  constructor(private _dataService:DataService,private _toastr:ToastrService) { }

  ngOnInit(): void {
    this.getData();       //Table Binding Method
    this.getNetFigure(); //NetFigureCount for counter
    this.orderStatus();  //Dynamic Integrate data from API with charts
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

  //----------
  // COUNTER
  //-------------------------------------
  // Calling API for netFigure(COUNTER)
  //-------------------------------------
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

  
  

  //----------------------------
  // static data -> LINE CHART
  //----------------------------
  orderStatusStatic(){
    //----- Chart Properties from common chart.ts file -----
    //legends
    //this.lineChartLegend = chartData.lineChartLegend;
    //chart type
    //this.lineChartType = chartData.lineChartType;
    //options
    //this.lineChartOptions = chartData.lineChartOptions;
    //colors
    //this.lineChartColors = chartData.lineChartColors;

    //dataset
    /*this.lineChartData = [
      { data:[1, 1, 2, 1, 2, 2], label:'Series A'},
      { data:[0, 1, 1, 2, 1, 1],  label:'Series B'},
      { data:[0, 1, 0, 1, 2, 1],  label:'Series c'},
      { data:[1, 2, 3, 2, 1, 3],   label:'Series D'}
    ];*/
    //labels
    //this.lineChartLabels = ["1 min.", "10 min.", "20 min.", "30 min.", "40 min.", "50 min."];
  }


  
  //======================================
  // DATA For Chart Integration from API
  //======================================
  // DYNAMIC Data from API -> LINE CHART

  orderStatus(){
    let objLineChartData:any = {};
    let arr:any[] = [];

    //call API - get data for chart integration
    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetChartOrderStatus/").subscribe(res => {
     if (res.isSuccess) {

       //console.log(res.data);
        /*[
            0: {orderStatus: "Processing", date: "02-03-2021", counts: 4}
            1: {orderStatus: "Processing", date: "03-03-2021", counts: 4}
          ]*/

          
        //response from api
        let allData = res.data;

        //array of dates  from res.data (contains repeated date)
        //get array of attributes from res.data
        //let array = res.data.map(item => item.attribute);
        //remove duplicates using array.filter((value,index,array)=>array.indexOf(value)===index);
        //get 1st index of duplicate element & if element repeats dont put in array else put in array
        //indexOf => 1st matching element index

        //array of orderStatus (distinct) from res.data
        let orderStatus:any[] = allData.map((item: { orderStatus: any; }) => item.orderStatus).filter((value: any,index: any,array: any[])=>array.indexOf(value)===index);
        //console.log('ORDER STATUS: ',orderStatus);

        //array of dates (distinct)
        let dateLabels:any[] = allData.map((item: { date: any; }) => item.date).filter((value: any,index: any,array: any[])=>array.indexOf(value)===index);
        //console.log('DATES: ',dateLabels);

        //array of counts (distinct) from res.data
        let counts:any[] = allData.map((item: { counts: any; }) => item.counts).filter((value: any,index: any,array: any[])=>array.indexOf(value)===index);
        //console.log('COUNTS: ',counts);

        /* 
          ORDER STATUS:  (4) ["Processing", "Cancelled", "Delivered", "Shipped"]
          DATES:  (8) ["02-03-2021", "03-03-2021", "09-03-2021", "22-12-2019", "23-12-2019", "24-12-2019", "25-12-2019", "26-12-2019"]
          COUNTS:  (4) [4, 1, 2, 3]
        */


        //labels
        //this.lineChartLabels = ["date1", "date2", "date3", "date4", "date5"];
        this.lineChartLabels =  allData.map((item: { date: any; }) => item.date).filter((value: any,index: any,array: any[])=>array.indexOf(value)===index);

        //dataset
        /*this.lineChartData = [{ data:[date1, date2, date3, dateN], label:'Order Status'}];*/
        //DATE WISE count for each ORDER Status
        //keep same date + same status records in array
        for(let status of orderStatus){
          arr = [];
          for(let date of this.lineChartLabels){
            for(let data in allData){
              if(status === allData[data].orderStatus && date === allData[data].date){
                //insert counts into main array
                arr[arr.length] = allData[data].counts;
              }
            }
          }
          //ObjectData {data:'[dates]',label:'status'} (to be inserted in main data)
          objLineChartData = {data: arr, label: status};

          //Insert this object into main array[{data:'[dates]',label:'status'}]
          this.lineChartData[this.lineChartData.length] = objLineChartData;
        }

        //----- Chart Properties from common chart.ts file -----
        //legends
        this.lineChartLegend = chartData.lineChartLegend;
        //chart type
        this.lineChartType = chartData.lineChartType;
        //options
        this.lineChartOptions = chartData.lineChartOptions;
        //colors
        this.lineChartColors = chartData.lineChartColors;


        //SHOW CHART ONLY IF DATA IS RECEIVED FROM API
        this.isShowOrderStatus = true;

      } else {
        this._toastr.error(res.errors[0], "Dashboard");
     }
   });
  }

}
