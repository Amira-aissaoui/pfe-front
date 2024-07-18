import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from '../services/data-service.service';
import { ProjectDTO } from '../services/project.service';

// ...
@Component({
  selector: 'app-paneledit',
  templateUrl: './paneledit.component.html',
  styleUrls: ['./paneledit.component.css']
})
export class PaneleditComponent implements OnInit {
  @Input() PanelId: String | undefined;
  @Output() closed = new EventEmitter<boolean>();
  @Input() dashboardTitle: string | undefined;

  constructor( private activatedRoute: ActivatedRoute,private http:HttpClient,private route : Router,
    private dataService:DataService) { }
  Status=false;
  projectName!:string;
  PanelExpr:string="";
  ipAddresses: {ipaddr: string, port: string}[] = [];
panelIDToModify:string="";
project!:ProjectDTO;
  ngOnInit() {

    this.panelIDToModify=this.dataService.getPanelIDToModify().toString();
    this.project=this.dataService.getProject();
    this.projectName=this.project.projectName;
  console.log("this.PanelId"+this.panelIDToModify);
  this.getPanelExpression();

  }


  closeModal() {
    console.log("Close button clicked");
    this.closed.emit();
    }

    panelNewName:string="";
    newChartType:string="";

//---------------getPanelExprByPanelId
getPanelExpression(): void {
  if (this.panelIDToModify != "") {
    this.dataService.getPanelExprByPanelId(this.projectName, this.panelIDToModify).subscribe(
      (panelExpr) => {
        this.PanelExpr = panelExpr;
      },
      (error) => {
        console.log('Error getting panel expression:', error);
      }
    );
  }
}












    getPanelExpressionByProjectNameAndPanelID(projectName: string, panelID: string): Observable<string> {
      return this.dataService.getPanelExprByPanelId(projectName, panelID);
    }



    onSubmit() {
      // Check if panelNewName is not empty
      if (this.panelNewName !== '') {
        const newChartName = this.panelNewName;
        console.log(newChartName);
      }
      console.log("HEREEE");

    
      // Retrieve the panel expression based on the project name and panel ID
      this.getPanelExpressionByProjectNameAndPanelID(this.projectName, this.panelIDToModify).subscribe(
        (panelExpr) => {
          this.PanelExpr = panelExpr;
        },
        (error) => {
          console.log("Error retrieving panel expression: ", error);
        }
      );
      console.log("HEREEE2");

      // Prepare the data to be sent in the request body (if needed)
      const requestBody = {
        dashboardTitle: this.projectName,
        panelId: this.panelIDToModify,
        newTitle: this.panelNewName,
        newType: this.selectedChartType || '',
        newExpr: this.PanelExpr,
      };
    
      // Make the HTTP POST request using HttpClient
      this.http.post<string>('http://localhost:8080/api/grafana/modifypanel', null, { params: requestBody })
        .subscribe(
          (response) => {
            console.log("Request successful: ", response);
          },
          (error) => {
            console.log("Request failed: ", error);
          }
        );
      //location.reload();
    }







    barchart=false;
    piechart=false;
    gaugechart=false;
    linechart=false;
    xychart=false;
    heatmapchart=false;
    statchart=false;
    horizchart=false;
    selectedChartType: string | null = null;

    getTheNewChart(): void {
      if (this.barchart) {
        this.selectedChartType = "barchart";
      } else if (this.piechart) {
        this.selectedChartType = "piechart";
      } else if (this.gaugechart) {
        this.selectedChartType = "gauge";
      } else if (this.linechart) {
        this.selectedChartType = "timeseries";
      } else if (this.statchart) {
        this.selectedChartType = "stat";
      } else if (this.horizchart) {
        this.selectedChartType = "state-timeline";
        console.log("wallah lenaaa");
      }
      else if (this.xychart) {
        this.selectedChartType = "xychart";
      } else {
        this.selectedChartType = null;
      }
  
    }



saleData = [
  { name: "CPU", value: 105000 },
  { name: "Memory", value: 55000 },
  { name: "Swap", value: 15000 },
  { name: "Disk", value: 150000 },
];

lineData=[
  {
    "name": "CPU",
    "series": [
      {
        "value": 6774,
        "name": "2016-09-23T11:57:02.465Z"
      },
      {
        "value": 3054,
        "name": "2016-09-22T00:20:58.585Z"
      },
      {
        "value": 6336,
        "name": "2016-09-20T11:28:25.409Z"
      },
      {
        "value": 5081,
        "name": "2016-09-18T13:42:49.371Z"
      },
      {
        "value": 4907,
        "name": "2016-09-19T12:26:54.914Z"
      }
    ]
  },
  {
    "name": "Memory",
    "series": [
      {
        "value": 6745,
        "name": "2016-09-23T11:57:02.465Z"
      },
      {
        "value": 2038,
        "name": "2016-09-22T00:20:58.585Z"
      },
      {
        "value": 3117,
        "name": "2016-09-20T11:28:25.409Z"
      },
      {
        "value": 2585,
        "name": "2016-09-18T13:42:49.371Z"
      },
      {
        "value": 4971,
        "name": "2016-09-19T12:26:54.914Z"
      }
    ]
  },
  {
    "name": "Swap",
    "series": [
      {
        "value": 3455,
        "name": "2016-09-23T11:57:02.465Z"
      },
      {
        "value": 6441,
        "name": "2016-09-22T00:20:58.585Z"
      },
      {
        "value": 2376,
        "name": "2016-09-20T11:28:25.409Z"
      },
      {
        "value": 3668,
        "name": "2016-09-18T13:42:49.371Z"
      },
      {
        "value": 5016,
        "name": "2016-09-19T12:26:54.914Z"
      }
    ]
  },
  {
    "name": "Disk Usage",
    "series": [
      {
        "value": 6514,
        "name": "2016-09-23T11:57:02.465Z"
      },
      {
        "value": 3833,
        "name": "2016-09-22T00:20:58.585Z"
      },
      {
        "value": 2890,
        "name": "2016-09-20T11:28:25.409Z"
      },
      {
        "value": 6121,
        "name": "2016-09-18T13:42:49.371Z"
      },
      {
        "value": 2474,
        "name": "2016-09-19T12:26:54.914Z"
      }
    ]
  },

]
  bubledata=[
    {
      "name": "",
      "series": [
        {
          "name": "2010",
          "x": "2010",
          "y": 80.3,
          "r": 80.4
        },
        {
          "name": "2000",
          "x": "2000",
          "y": 80.3,
          "r": 78
        },
        {
          "name": "1990",
          "x": "1990",
          "y": 75.4,
          "r": 79
        }
      ]
    },
    {
      "name": "",
      "series": [
        {
          "name": "2010",
          "x": "2020",
          "y": 15.8,
          "r": 310
        },
        {
          "name": "2000",
          "x": "2000",
          "y": 76.9,
          "r": 283
        },
        {
          "name": "1990",
          "x": "1990",
          "y": 75.4,
          "r": 253
        }
      ]
    },
    {
      "name": "",
      "series": [
        {
          "name": "2010",
          "x": "2010",
          "y": 10.4,
          "r": 63
        },
        {
          "name": "2000",
          "x": "2000",
          "y": 10.1,
          "r": 59.4
        },
        {
          "name": "1990",
          "x": "1990",
          "y": 30.2,
          "r": 56.9
        }
      ]
    },
    {
      "name": "",
      "series": [
        {
          "name": "2010",
          "x": "2010",
          "y": 40.2,
          "r": 62.7
        },
        {
          "name": "2000",
          "x": "2000",
          "y": 20.8,
          "r": 58.9
        },
        {
          "name": "1990",
          "x": "1990",
          "y": 75.7,
          "r": 57.1
        }
      ]
    }
  ];
  heatmapdata=[
    {
      "name": "column 1",
      "series": [
        {
          "name": "2010",
          "value": 40632,
          "extra": {
            "code": "de"
          }
        },
        {
          "name": "2000",
          "value": 36953,
          "extra": {
            "code": "de"
          }
        },
        {
          "name": "1990",
          "value": 31476,
          "extra": {
            "code": "de"
          }
        }
      ]
    },
    {
      "name": "column 2",
      "series": [
        {
          "name": "2010",
          "value": 0,
          "extra": {
            "code": "us"
          }
        },
        {
          "name": "2000",
          "value": 45986,
          "extra": {
            "code": "us"
          }
        },
        {
          "name": "1990",
          "value": 37060,
          "extra": {
            "code": "us"
          }
        }
      ]
    },
    {
      "name": "column 3",
      "series": [
        {
          "name": "2010",
          "value": 36745,
          "extra": {
            "code": "fr"
          }
        },
        {
          "name": "2000",
          "value": 34774,
          "extra": {
            "code": "fr"
          }
        },
        {
          "name": "1990",
          "value": 29476,
          "extra": {
            "code": "fr"
          }
        }
      ]
    },
    {
      "name": "column 4",
      "series": [
        {
          "name": "2010",
          "value": 36240,
          "extra": {
            "code": "uk"
          }
        },
        {
          "name": "2000",
          "value": 32543,
          "extra": {
            "code": "uk"
          }
        },
        {
          "name": "1990",
          "value": 26424,
          "extra": {
            "code": "uk"
          }
        }
      ]
    }
  ];

  treedata=[
    {
      "name": "Germany",
      "value": 40632,
      "extra": {
        "code": "de"
      }
    },
    {
      "name": "France",
      "value": 36745,
      "extra": {
        "code": "fr"
      }
    },
    {
      "name": "United Kingdom",
      "value": 36240,
      "extra": {
        "code": "uk"
      }
    },
    {
      "name": "Spain",
      "value": 33000,
      "extra": {
        "code": "es"
      }
    },
    {
      "name": "Italy",
      "value": 35800,
      "extra": {
        "code": "it"
      }
    },
    {
      "name": "Spain",
      "value": 36620
    }
  ]
  value: number = 50;
  previousValue: number = 70;
  units: string = 'Alerts';

  horizdata=[
    {
      "name": "Swap",
      "series": [
        {
          "name": "2010",
          "value": 40632,
          "extra": {
            "code": "de"
          }
        },
        {
          "name": "2000",
          "value": 36953,
          "extra": {
            "code": "de"
          }
        },
        {
          "name": "1990",
          "value": 31476,
          "extra": {
            "code": "de"
          }
        }
      ]
    },
    {
      "name": "Disk",
      "series": [
        {
          "name": "2010",
          "value": 0,
          "extra": {
            "code": "us"
          }
        },
        {
          "name": "2000",
          "value": 45986,
          "extra": {
            "code": "us"
          }
        },
        {
          "name": "1990",
          "value": 37060,
          "extra": {
            "code": "us"
          }
        }
      ]
    },
    {
      "name": "Memory",
      "series": [
        {
          "name": "2010",
          "value": 36745,
          "extra": {
            "code": "fr"
          }
        },
        {
          "name": "2000",
          "value": 34774,
          "extra": {
            "code": "fr"
          }
        },
        {
          "name": "1990",
          "value": 29476,
          "extra": {
            "code": "fr"
          }
        }
      ]
    },
    {
      "name": "CPU",
      "series": [
        {
          "name": "1990",
          "value": 33216
        },
        {
          "name": "2000",
          "value": 37606
        },
        {
          "name": "2010",
          "value": 17293
        }
      ]
    }
  ]





}
