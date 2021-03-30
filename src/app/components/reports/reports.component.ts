import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';

//chart Properties
import * as chartData from '../../shared/data/charts';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  //-------- TABLE ------------
  //table rows  (insert API data here)
  reports:any[]=[];

  //table columns (define table columns properties + title here)
  settings = {
    actions:false,
    hideSubHeader:false,

    //COLUMNS
    //by default -> filter:true 
    columns:{
      orderId:{
        title:'Order Id',
      },
      invoiceNo:{
        title:'Invoice No',
      },
      paymentStatus:{
        title:'Payment Status',
        type:'html'
      },
      paymentMethod:{
        title:'Payment Method',
      },
      orderStatus:{
        title:'Order Status',
        type:'html'
      },
      paymentDate:{
        title:'Payment Date',
      },
      subTotalAmount:{
        title:'SubTotal Amount',
      },
      shippingAmount:{
        title:'Shipping Amount',
      },
      totalAmount:{
        title:'Total Amount',
      }
    }

  };
  //---------------------------


  //=========== CHART =============
  //_________________
  // ng2-chart
  //_________________
  //dataset
  salesChartData:any[] = [];
  //labels
  salesChartLabels:any[] = [];
  //legends
  salesChartLegend:any;
  //colors
  salesChartColors:any;
  //type
  salesChartType:any;
  //options
  salesChartOptions:any;

  //Dont show chart by default 
  //SHOW CHART ONLY IF DATA IS RECEIVED FROM API
  isSalesDataPaymentTypeWise:boolean = false;


  //__________________
  // ng-chartist
  //__________________
  chart:any;

  //____________________
  // ng2-google-charts
  //____________________
  columnChart:any;
  lineChart:any;

  //===============================


  //Dependency Injection
  constructor(private _dataService:DataService,private _toastr:ToastrService) { }

  ngOnInit(): void {
    this.getData(); //Table Binding

    //BINDING CHARTS
    this.getChart1(); //sales data payment Typewise (ng2-chart)
    this.getChart2(); //customer user growth (ng-chartist)
    this.getChart3(); //order status data (ng2-google-chart-> column chart)
    this.getChart4() //order status data  (ng2-google-chart-> line chart)
  }


  //======================================
  // INSERT DATA FROM API -> TABLE (rows)
  //=======================================
  //API: PaymentMaster/GetReportInvoiceList
  getData(){
    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetReportInvoiceList/").subscribe(res=>{
      if(res.isSuccess){
          //insert API data -> reports table rows
          this.reports = res.data;

          //know table rows
          //console.log('COD REPORTS:' ,res.data);
      }else{
        this._toastr.error(res.errors[0], 'Reports');
      }
    });
  }



  //======================================
  // CHART1: SALES-DATA PAYMENT-TYPE WISE
  //======================================
  getChart1(){
    let objSalesData:any = {};
    let arr:any[] = [];

    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetChartSalesDataPaymentTypeWise/").subscribe(res=>{
      if(res.isSuccess){
        //-------------------------------------------------------------------
        //console.log('SALES DATA PAYMENT TYPE WISE: ',res.data);
        //sales data payment typewise
        //[{paymentType: "Cash On Delivery", date: "22-12-2019", counts: 1}]
        //--------------------------------------------------------------------
        //array of dates  from res.data (contains repeated date)
        //get array of attributes from res.data
        //let array = res.data.map(item => item.attribute);
        //remove duplicates using array.filter((value,index,array)=>array.indexOf(value)===index);
        //get 1st index of duplicate element & if element repeats dont put in array else put in array
        //indexOf => 1st matching element index

        let allData = res.data;

        //Payment array(distinct)
        let allPaymentType = allData.map((item: { paymentType: any; }) => item.paymentType).filter((value: any,index: any,array: any[])=>array.indexOf(value)===index);
        //console.log(allPaymentType);
        //(5) ["Cash On Delivery", "Credit Card", "Debit Card", "Master Card", "Paypal"]

        //date array(distinct)
        let allDates = allData.map((item: { date: any; }) => item.date).filter((value: any,index: any,array: any[])=>array.indexOf(value)===index);
        //console.log(allDates);
        //(5) ["22-12-2019", "23-12-2019", "24-12-2019", "25-12-2019", "26-12-2019"]

        //count array(distinct)
        let allCounts = allData.map((item: { counts: any; }) => item.counts).filter((value: any,index: any,array: any[])=>array.indexOf(value)===index);
        //console.log(allCounts);
        //(3) [1, 2, 3]

        //LABELS
        //['date1','date2'....'dateN']
        this.salesChartLabels = allDates;

        //DATASET
        //[{data:['dates'],status:'payment type'}]
        for(let pType of allPaymentType){
          arr = [];
          for(let date of allDates){
            for(let data in allData){
              if(pType === allData[data].paymentType && date === allData[data].date)
              //insert counts into main array
              arr[arr.length] = allData[data].counts;
            }
          }
          //ObjectData {data:'[dates]',label:'pType'} (to be inserted in main data)
          objSalesData = {data:arr, label:pType}

          //Insert this object into main array[{data:'[dates]',label:'pType'}]
          this.salesChartData[this.salesChartData.length] = objSalesData;
        }
        


        //----- COMMON CHART PROPERTIES from chart.ts file -----
        //type
        this.salesChartType = chartData.salesChartType;
        //colors
        this.salesChartColors = chartData.salesChartColors;
        //options
        this.salesChartOptions = chartData.salesChartOptions;
        //legend
        this.salesChartLegend = chartData.salesChartLegend;
        

        //**SHOW CHART ONLY IF DATA IS RECEIVED FROM API
        this.isSalesDataPaymentTypeWise = true;

      }else{
        this._toastr.error(res.errors[0], 'Reports');
      }
    });
  }



  
  //==========================
  // ** CHART2: Customer Growth: NG-CHARTIST (points curve)
  //==========================
  getChart2(){
    let objGrowthData:any[] = [];

    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetChartUserGrowth/").subscribe(res=>{
      if(res.isSuccess){
        //--------------------------------------------------------
        //console.log('USER GROWTH CHART: ',res.data);
        //user growth
        //[{userType: "Customer", date: "23-11-2019", counts: 3}]
        //--------------------------------------------------------

        let allData = res.data;

        //let userTypes = allData.map((item: { userType: any; }) => item.userType);
        //console.log('USER TYPES: ',userTypes);

        //distinct dates
        //let allDates = allData.map((item: { date: any; }) => item.date).filter((value: any,index: any,array: any[])=>array.indexOf(value)===index);
        //console.log('Dates: ',allDates);

        //all counts
        objGrowthData = allData.map((item: any) => item.counts);
        

        this.chart = { 
          type: 'Line', 
          data: { 
            labels: [], 
            series: [
              objGrowthData
              //[3, 4, 3, 5, 4, 3, 5]
            ]
          }, 
          options: { 
            showScale: false, 
            fullWidth: !0, 
            showArea: !0, 
            label: false, 
            width: '600', 
            height: '358', 
            low: 0, 
            offset: 0, 
            axisX: { showLabel: false, showGrid: false }, 
            axisY: { showLabel: false, showGrid: false, low: 0, offset: -10, }, 
          } 
        };
    
      }else{
        this._toastr.error(res.errors[0], 'Reports');
      }
    });
  }


  
  //===========================
  // ** CHART3: Order Status Data : NG2-GOOGLE-CHART(COLUMN CHART)
  //===========================
  getChart3(){
    let objOrderStatusData1:any[] = [];
    let arr:any = ["Date"];

    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetChartOrderStatus/").subscribe(res=>{
      if(res.isSuccess){
        //-------------------------------------------------------------
        //console.log('ORDER STATUS DATA: ',res.data);
        //order data status
        //[{orderStatus: "Processing", date: "02-03-2021", counts: 4}]
        //--------------------------------------------------------------
        let allData = res.data;

        //distinct orderStatus
        let allOrderStatus = allData.map((item: { orderStatus: any; }) => item.orderStatus).filter((value: any,index: any,array: any[])=>array.indexOf(value)===index);
        //console.log('Status: ',allOrderStatus);

        //distinct dates
        let allDates = allData.map((item: { date: any; }) => item.date).filter((value: any,index: any,array: any[])=>array.indexOf(value)===index);
        //console.log('Dates: ',allDates);
        
        //distinct dates
        let allCounts = allData.map((item: { counts: any; }) => item.counts).filter((value: any,index: any,array: any[])=>array.indexOf(value)===index);
        //console.log('Counts: ',allCounts);

        
        //------------------------
        // logic here
        //------------------------
        /* WE NEED TO GET logic for  This type pattern*/
        /* EXAMPLE DATA FORMAT:
           ["Year", "Sales", "Expenses"],
           ["100", 2.5, 3.8],
           ["200", 3, 1.8],
           ["300", 3, 4.3],
           ["400", 0.9, 2.3],
           ["500", 1.3, 3.6], 
           ["600", 1.8, 2.8], 
           ["700", 3.8, 2.8], 
           ["800", 1.5, 2.8]
           year = x axis
           sales,expenses = barLines y axis
           2.5,3.8 etc = y axis

           //to GET DATA OF FORMAT:
           [Array(5), Array(5), Array(5), Array(5), Array(5), Array(5), Array(5), Array(5), Array(5)]
           0: (5) ["Date", "Processing", "Cancelled", "Delivered", "Shipped"]
           1: (5) ["02-03-2021", 4, 0, 0, 0]
           2: (5) ["03-03-2021", 4, 0, 0, 0]
           3: (5) ["09-03-2021", 1, 0, 0, 0]
           4: (5) ["22-12-2019", 2, 1, 2, 3]
           5: (5) ["23-12-2019", 2, 1, 1, 1]
           6: (5) ["24-12-2019", 0, 0, 0, 1]

           Date = x axis
           orderStatus = barLines y axis
           counts = y axis      
        */

        //get 1st array : ["Date","Processing", "Cancelled", "Delivered", "Shipped"]
        //here Date = x axis
        //Processing,Cancelled,Delivered,Shipped = y axis (bar lines)
        //------------------------------
        for(let status of allOrderStatus){
          arr.push(status);
          //["Date","Processing", "Cancelled", "Delivered", "Shipped"]
          //here Date = x axis
          //Processing,Cancelled,Delivered,Shipped = y axis (bar lines)
        };
        //put this array -> main array
        objOrderStatusData1[objOrderStatusData1.length] = arr;
        

        //get 2nd array: ["Date",counts1,counts2,counts3,counts4];
        //here Date = x axis
        //counts = Y axis (height of bar lines)
        //---------------------------------------
        //initially set counts to zer0
        var zeroCount:any = 0;
        for(let date of allDates){
          //put date in all arrays
          arr = [date];
          for(let status of allOrderStatus){
            arr.push(zeroCount);
          }
          //console.log('Initial Array2: ',arr);
          //["26-12-2019", 0, 0, 0, 0]

          //fill counts values in the array with matching status + append to main array
          for(let status in allOrderStatus){
            for(let data in allData){
              if(allOrderStatus[status] === allData[data].orderStatus && date === allData[data].date){
                //update only count values:from index1 (not date(index0))
                arr[parseInt(status) + 1] = allData[data].counts;
              }
            }
          }
          //put thsese arrats -> main array
          objOrderStatusData1[objOrderStatusData1.length] = arr;
        }
        //console.log('Final Array: ',objOrderStatusData1);
       
        
        //CHART PROPERTIES:
        this.columnChart = {
          chartType: 'ColumnChart',
          dataTable:objOrderStatusData1
          /*[
            ["Year", "Sales", "Expenses"],
            ["100", 2.5, 3.8],
            ["200", 3, 1.8],
            ["300", 3, 4.3],
            ["400", 0.9, 2.3],
            ["500", 1.3, 3.6], 
            ["600", 1.8, 2.8], 
            ["700", 3.8, 2.8], 
            ["800", 1.5, 2.8]
          ]*/, 
          options: {
             legend: { position: 'none' }, 
             bars: "vertical", 
             vAxis: { format: "decimal" }, 
             height: 340, 
             width: '100%', 
             colors: ["#ff7f83", "#a5a5a5"], 
             backgroundColor: 'transparent' 
          }, 
        };
        
          
      }else{
        this._toastr.error(res.errors[0], 'Reports');
      }
    });
  }



   //==========================
  // CHART4: Order Status Data : NG2-GOOGLE-CHART(LINE CHART)
  //===========================
  getChart4(){
    let objOrderStatusData2:any[] = [];
    let arr:any[] = ["Date"];

    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetChartOrderStatus/").subscribe(res=>{
      if(res.isSuccess){
        //-------------------------------------------------------------
        //console.log('ORDER STATUS DATA: ',res.data);
        //order data status
        //[{orderStatus: "Processing", date: "02-03-2021", counts: 4}]
        //--------------------------------------------------------------

        let allData = res.data;

        //distinct orderStatus
        let allOrderStatus = allData.map((item: { orderStatus: any; }) => item.orderStatus).filter((value: any,index: any,array: any[])=>array.indexOf(value)===index);
        //console.log('Status: ',allOrderStatus);

        //distinct dates
        let allDates = allData.map((item: { date: any; }) => item.date).filter((value: any,index: any,array: any[])=>array.indexOf(value)===index);
        //console.log('Dates: ',allDates);
        
        //distinct dates
        let allCounts = allData.map((item: { counts: any; }) => item.counts).filter((value: any,index: any,array: any[])=>array.indexOf(value)===index);
        //console.log('Counts: ',allCounts);


        //------------------------
        // logic here
        //------------------------
        /* WE NEED TO GET logic for  This type pattern*/
        /* EXAMPLE DATA FORMAT:
           ["Year", "Sales", "Expenses"],
           ["100", 2.5, 3.8],
           ["200", 3, 1.8],
           ["300", 3, 4.3],
           ["400", 0.9, 2.3],
           ["500", 1.3, 3.6], 
           ["600", 1.8, 2.8], 
           ["700", 3.8, 2.8], 
           ["800", 1.5, 2.8]
           year = x axis
           sales,expenses = barLines y axis
           2.5,3.8 etc = y axis

           //to GET DATA OF FORMAT:
           [Array(5), Array(5), Array(5), Array(5), Array(5), Array(5), Array(5), Array(5), Array(5)]
           0: (5) ["Date", "Processing", "Cancelled", "Delivered", "Shipped"]
           1: (5) ["02-03-2021", 4, 0, 0, 0]
           2: (5) ["03-03-2021", 4, 0, 0, 0]
           3: (5) ["09-03-2021", 1, 0, 0, 0]
           4: (5) ["22-12-2019", 2, 1, 2, 3]
           5: (5) ["23-12-2019", 2, 1, 1, 1]
           6: (5) ["24-12-2019", 0, 0, 0, 1]

           Date = x axis
           orderStatus = barLines y axis
           counts = y axis      
        */

        //get 1st array : ["Date","Processing", "Cancelled", "Delivered", "Shipped"]
        //here Date = x axis
        //Processing,Cancelled,Delivered,Shipped = y axis (bar lines)
        //------------------------------
        //initially arr contains: ["Date"]
        for(let status of allOrderStatus ){
          arr.push(status);
        }
        //now arr contains: ["Date","Processing", "Cancelled", "Delivered", "Shipped"]
        //appending to main array
        objOrderStatusData2[objOrderStatusData2.length] = arr;


        //get 2nd parts array: ["Date",counts1,counts2,counts3,counts4];
        //here Date = x axis
        //counts = Y axis (height of bar lines)
        //---------------------------------------
        //initially fill dates + set count values to zero in all arrays 
        //["26-12-2019", 0, 0, 0, 0]
        var zeroCounts:any = 0;
        for(let date of allDates){
          arr = [date];
          for(let status of allOrderStatus){
            arr.push(zeroCounts);
          }
          
          //fill counts values in the array with matching status + append to main array
          for(let status in allOrderStatus){
            for(let data in allData){
              if(allOrderStatus[status] === allData[data].orderStatus && date === allData[data].date){
                //count value starts from 1st position
                arr[parseInt(status) + 1] = allData[data].counts;
              }
            }
          }
          //appending to main array
          objOrderStatusData2[objOrderStatusData2.length] = arr;
        }
        

        /* CHART PROPERTIES */
        this.lineChart = { 
          chartType: 'LineChart', 
          dataTable: objOrderStatusData2 
          /*[ 
              ['Month', 'Guardians of the Galaxy', 'The Avengers'], 
              [10, 20, 60], 
              [20, 40, 10], 
              [30, 20, 40], 
              [40, 50, 30], 
              [50, 20, 80], 
              [60, 60, 30], 
              [70, 10, 20], 
              [80, 40, 90], 
              [90, 20, 0]
            ]*/, 
          options: { 
            colors: ["#ff8084", "#a5a5a5"], 
            legend: { position: 'none' },
            height: 500,
            width: '100%', 
            backgroundColor: 'transparent' 
          }, 
        };

      }else{
        this._toastr.error(res.errors[0], 'Reports');
      }
    });
  }


}
