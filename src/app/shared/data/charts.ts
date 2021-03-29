// Chart Properties (Static) - commonly used for all charts


//===========
// CHART 1 
//===========
//defined on component - (get data from API/DYANMIC data)
//dataset
//lineChartData:any[] = [];
//labels
//lineChartLabels:any;

//chart type
export var lineChartType:any = 'line';
//legends
export var lineChartLegend:any = true;

//options
export var lineChartOptions = {
      scaleShowGridLines: true,
      scaleGridLineWidth: 1,
      scaleShowHorizontalLines: true,
      scaleShowVerticalLines: true,
      bezierCurve: true,
      bezierCurveTension: 0.4,
      pointDot: true,
      pointDotRadius: 4,
      pointDotStrokeWidth: 1,
      pointHitDetectionRadius: 20,
      datasetStroke: true,
      datasetStrokeWidth: 2,
      datasetFill: true,
      responsive: true,
      maintainAspectRatio: false,
    };

//colors
export var lineChartColors = [
    {
        backgroundColor: "transparent",
        borderColor: "#01cccd",
        pointColor: "#01cccd",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "#000"
      },
      {
        backgroundColor: "transparent",
        borderColor: "#a5a5a5",
        pointColor: "#a5a5a5",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#000",
        pointHighlightStroke: "rgba(30, 166, 236, 1)",
      },
      {
        backgroundColor: "transparent",
        borderColor: "#ff7f83",
        pointColor: "#ff7f83",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#000",
        pointHighlightStroke: "rgba(30, 166, 236, 1)",
      }
    ];
   
 //----------------------------