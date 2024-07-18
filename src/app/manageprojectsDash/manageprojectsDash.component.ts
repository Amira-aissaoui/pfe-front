import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import 'jspdf-autotable';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent } from "ng-apexcharts";
import { ProjectService } from "../services/project.service";
import { StateServiceService } from "../services/state-service.service";
import { UserinfoService } from "../services/userinfo.service";
export interface ProjectDTO {
  id: Number;
  projectName: string;
  monitoring: boolean;
  alerting: boolean;
  appType: string;
  ipAddresses: string;
  msnames: string;
  uid: string;
  deployment: string;
  teams: TeamDTO[];
  users: UserDTO[];
  visibility: string;
}
export interface TeamDTO {
  id: number;
  teamName: string;
  users: UserDTO[];
}
export interface UserDTO {
  id: Number;
  firstname: string;
  lastname: string;
  email: string;
  role: Role;
}
enum Role {
  VIEWER,
  EDITOR
}
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: string[];
};
export type ChartOptions1 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  colors: string[];
};
export type ChartOptions2 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    title: ApexTitleSubtitle;
  };
  export type ChartOptions3 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    title: ApexTitleSubtitle;
  };

  export type ChartOptions4 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    title: ApexTitleSubtitle;
  };
export type ChartOptions5 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  colors: string[];
};


@Component({
  selector: 'app-manageprojectsDash',
  templateUrl: './manageprojectsDash.component.html',
  styleUrls: ['./manageprojectsDash.component.css']
})
export class ManageprojectsDashComponent {
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      width: 0,
      type: "pie"
    },
    labels: [],
    colors: ['#F79027', '#00AE4E', '#A1CD3C', '#2BC3EA'],
    responsive: []
  };
  public chartOptions1: Partial<ChartOptions1> = {
    series: [],
    chart: {
      width: 0,
      type: "donut"
    },
    fill: {
      type: "gradient"
    },
    legend: {
      formatter: function (val: string, opts: any) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      }
    },
    dataLabels: {
      enabled: false
    },
    labels: [],
    colors: ['#F79027', '#00AE4E', '#A1CD3C', '#2BC3EA'],
    responsive: []
  };

  
  public chartOptions2: Partial<ChartOptions2> = {
    series: [
      {
        name: "Inflation",
        data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
      }
    ],
    chart: {
      height: 250, // Conserver la hauteur actuelle
      width: '95%', // Augmenter la largeur en pourcentage
      type: "bar"
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: "top" // top, center, bottom
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val: any) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"]
      }
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      position: "top",
      labels: {
        offsetY: -18
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5
          }
        }
      },
      tooltip: {
        enabled: true,
        offsetY: -35
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [50, 0, 100, 100]
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false,
        formatter: function(val: any) {
          return val + "%";
        }
      }
    },
    title: {
      text: "Monthly Inflation in Argentina, 2002",
      floating: false,
      offsetY: 320,
      align: "center",
      style: {
        color: "#444"
      }
    }
  };






  public chartOptions3: Partial<ChartOptions3> = {
    series: [
      {
        name: "Inflation",
        data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
      }
    ],
    chart: {
      height: 250, // Conserver la hauteur actuelle
      width: '95%', // Augmenter la largeur en pourcentage
      type: "bar"
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: "top" // top, center, bottom
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val: any) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"]
      }
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      position: "top",
      labels: {
        offsetY: -18
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5
          }
        }
      },
      tooltip: {
        enabled: true,
        offsetY: -35
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [50, 0, 100, 100]
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false,
        formatter: function(val: any) {
          return val + "%";
        }
      }
    },
    title: {
      text: "Monthly Inflation in Argentina, 2002",
      floating: false,
      offsetY: 320,
      align: "center",
      style: {
        color: "#444"
      }
    }
  };


  public chartOptions4: Partial<ChartOptions4> = {
    series: [
      {
        name: "Inflation",
        data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
      }
    ],
    chart: {
      height: 250, // Conserver la hauteur actuelle
      width: '95%', // Augmenter la largeur en pourcentage
      type: "bar"
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: "top" // top, center, bottom
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val: any) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"]
      }
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      position: "top",
      labels: {
        offsetY: -18
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5
          }
        }
      },
      tooltip: {
        enabled: true,
        offsetY: -35
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [50, 0, 100, 100]
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false,
        formatter: function(val: any) {
          return val + "%";
        }
      }
    },
    title: {
      text: "Monthly Inflation in Argentina, 2002",
      floating: false,
      offsetY: 320,
      align: "center",
      style: {
        color: "#444"
      }
    }
  };

  public chartOptions5: Partial<ChartOptions5> = {
    series: [],
    chart: { type: 'bar' }, // Add the required type property
    dataLabels: {},
    plotOptions: {},
    xaxis: {}
  };



  constructor(
    private router: Router,
    private projectService: ProjectService,
    private stateService: StateServiceService,
    private userinfoservice: UserinfoService
  ) {

    this.chartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        width: 320,
        type: "pie"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      colors: ['#F79027', '#00AE4E', '#A1CD3C', '#2BC3EA'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
    this.chartOptions1 = {
      series: [44, 55, 41, 17, 15],
  chart: {
    width: 410, // Ajuster la largeur à 300 pour correspondre à la taille du graphique 1
    type: "donut"
  },
  dataLabels: {
    enabled: false
  },
  fill: {
    type: "gradient"
  },
  legend: {
    formatter: function (val: string, opts: any) {
      return val + " - " + opts.w.globals.series[opts.seriesIndex];
    }
  },
  labels: ["Series A", "Series B", "Series C", "Series D", "Series E"],
  colors: ['#F79027', '#00AE4E', '#A1CD3C', '#2BC3EA'],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: "bottom"
        }
      }
    }
  ]
};
    
    this.chartOptions2 = {

        series: [
          {
            name: "Inflation",
            data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
          }
        ],
        chart: {
          height: 210, // Conserver la hauteur actuelle
          width: '120%', // Augmenter la largeur en pourcentage
          type: "bar"
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: "top" // top, center, bottom
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function(val: any) {
            return val + "%";
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"]
          }
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          position: "top",
          labels: {
            offsetY: -18
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            fill: {
              type: "gradient",
              gradient: {
                colorFrom: "#D8E3F0",
                colorTo: "#BED1E6",
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5
              }
            }
          },
          tooltip: {
            enabled: true,
            offsetY: -35
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [50, 0, 100, 100]
          }
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: false,
            formatter: function(val: any) {
              return val + "%";
            }
          }
        },
        title: {
          text: "Monthly Inflation in Argentina, 2002",
          floating: false,
          offsetY: 320,
          align: "center",
          style: {
            color: "#444"
          }
        }
      };





      this.chartOptions3 = {

        series: [
          {
            name: "Inflation",
            data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
          }
        ],
        chart: {
          height: 220, // Conserver la hauteur actuelle
          width: '110%', // Augmenter la largeur en pourcentage
          type: "bar"
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: "top" // top, center, bottom
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function(val: any) {
            return val + "%";
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"]
          }
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          position: "top",
          labels: {
            offsetY: -18
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            fill: {
              type: "gradient",
              gradient: {
                colorFrom: "#D8E3F0",
                colorTo: "#BED1E6",
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5
              }
            }
          },
          tooltip: {
            enabled: true,
            offsetY: -35
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [50, 0, 100, 100]
          }
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: false,
            formatter: function(val: any) {
              return val + "%";
            }
          }
        },
        title: {
        
          floating: false,
          offsetY: 320,
          align: "center",
          style: {
            color: "#444"
          }
        }
      };



      this.chartOptions4 = {

        series: [
          {
            name: "Inflation",
            data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
          }
        ],
        chart: {
          height: 220, // Conserver la hauteur actuelle
          width: '120%', // Augmenter la largeur en pourcentage
          type: "bar"
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: "top" // top, center, bottom
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function(val: any) {
            return val + "%";
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"]
          }
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          position: "top",
          labels: {
            offsetY: -18
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            fill: {
              type: "gradient",
              gradient: {
                colorFrom: "#D8E3F0",
                colorTo: "#BED1E6",
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5
              }
            }
          },
          tooltip: {
            enabled: true,
            offsetY: -35
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [50, 0, 100, 100]
          }
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: false,
            formatter: function(val: any) {
              return val + "%";
            }
          }
        },
        title: {

          floating: false,
          offsetY: 320,
          align: "center",
          style: {
            color: "#444"
          }
        }
      };

      this.chartOptions5 = {
        series: [
          {
            name: "basic",
            data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
          }
        ],
        chart: {
          type: "bar",
          width: '170%',
          height: 200
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: [
            "South Korea",
            "Canada",
            "United Kingdom",
            "Netherlands",
            "Italy",
            "France",
            "Japan",
            "United States",
            "China",
            "Germany"
          ]
        },
        colors: ['#F79027', '#00AE4E', '#A1CD3C', '#2BC3EA']
      };
    }






  showPopup = false;
  status = true;
  nbprojet = 0;
  numberPrometheusdown = 0;
  numberGrafanadown = 0;
  numberAlertManagerdown = 0;
  isManageTeam: boolean = false;
  isManageProject: boolean = false;
  isTeamMemberSelected = false;
  isProjectSelected = false;
  projects: ProjectDTO[] = [];
  totalProjects: number = 0;
  monitoringProjects: number = 0;
  alertingProjects: number = 0;
  ngOnInit(): void {
    this.fetchProjects();
  }
  addToggle() {
    this.status = !this.status;
  }
  handleClose() {
    console.log("Popup closed");
  }
  goManageProject() {}
  goManageTeam() {}
  teamMemberSelected() {
    this.isTeamMemberSelected = !this.isTeamMemberSelected;
  }
  projectSelected() {
    this.isProjectSelected = !this.isProjectSelected;
  }
  manageProject() {
    this.isManageProject = !this.isManageProject;
  }
  goHome() {
    this.router.navigate(['/home']);
  }
  editPermission(project: ProjectDTO) {
    this.stateService.setProject(project);
    this.router.navigate(['/editpermission']);
  }
  fetchProjects(): void {
    this.projectService.getAllProjects()
      .subscribe(
        (projects: ProjectDTO[]) => {
          this.projects = projects;
          console.log('Projects retrieved successfully:', this.projects);
          this.updateChartOptions(); // Call the function to update the charts
          this.calculateProjects();
        },
        (error) => {
          console.error('Failed to retrieve projects:', error);
        }
      );
    }




    printPage(): void {
  
      window.print();
      
    }

















/*

@ViewChild('content') content!: ElementRef;

generatePDF() {
  const elements = document.querySelectorAll<HTMLElement>('.widget-container'); // get all elements with class widget-container
  const doc = new jsPDF();
  const promises: Promise<void>[] = [];

  elements.forEach((element) => {
    if (!element) {
      console.error('Element not found');
      return;
    }
    html2canvas(element, {
      useCORS: true,
      logging: true,
      allowTaint: true,
      scale: 2
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height / imgProps.width) * pdfWidth;
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      promises.push(Promise.resolve());
    });
  });

  Promise.all(promises).then(() => {
    doc.save('dashboard.pdf');
  });
}
*/
















updateChartOptions() {
  // Filter projects with monitoring and alerts
  const monitoringProjects = this.projects.filter(project => project.monitoring);
  const alertingProjects = this.projects.filter(project => project.alerting);
  // Count the number of projects with monitoring and alerts
  const monitoringCount = monitoringProjects.length;
  const alertingCount = alertingProjects.length;
  // Assigning the extracted data to the bar chart options
  this.chartOptions2.series = [
    {
      name: 'Monitoring',
      data: [monitoringCount]
    },
    {
      name: 'Alerts',
      data: [alertingCount]
    }
  ];
  this.chartOptions2.xaxis = { categories: ['Projects'] };
  // Update the pie chart with visibility data
  const visibilityCounts = this.projects.reduce((acc, project) => {
    acc[project.visibility] = (acc[project.visibility] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  this.chartOptions.series = Object.values(visibilityCounts);
  this.chartOptions.labels = Object.keys(visibilityCounts);
  // Update the donut chart with app type data
  const appTypeCounts = this.projects.reduce((acc, project) => {
    acc[project.appType] = (acc[project.appType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  this.chartOptions1.series = Object.values(appTypeCounts);
  this.chartOptions1.labels = Object.keys(appTypeCounts);
  // Update the bar chart with app type and monitoring project data
  const monitoringAppTypeCounts = this.projects.reduce((acc, project) => {
    if (project.monitoring) {
      acc[project.appType] = (acc[project.appType] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  this.chartOptions3.series = [{ name: 'Monitoring Projects', data: Object.values(monitoringAppTypeCounts) }];
  this.chartOptions3.xaxis = { categories: Object.keys(monitoringAppTypeCounts) };
  // Update the bar chart with app type and alerting project data
  const alertingAppTypeCounts = this.projects.reduce((acc, project) => {
    if (project.alerting) {
      acc[project.appType] = (acc[project.appType] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  this.chartOptions4.series = [{ name: 'Alerting Projects', data: Object.values(alertingAppTypeCounts) }];
  this.chartOptions4.xaxis = { categories: Object.keys(alertingAppTypeCounts) };
  // New chart for App Types and Visibility
  const appTypeVisibilityCounts = this.projects.reduce((acc, project) => {
    if (!acc[project.appType]) {
      acc[project.appType] = { [project.visibility]: 1 };
    } else {
      acc[project.appType][project.visibility] = (acc[project.appType][project.visibility] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, Record<string, number>>);
  const categories = Object.keys(appTypeVisibilityCounts);
  const seriesData = Object.keys(visibilityCounts).map(visibility => ({
    name: visibility,
    data: categories.map(appType => appTypeVisibilityCounts[appType][visibility] || 0)
  }));
  this.chartOptions5.series = seriesData;
  this.chartOptions5.xaxis = { categories };
}



  calculateProjects() {
    this.totalProjects = this.projects.length;
    this.monitoringProjects = this.projects.filter(project => project.monitoring).length;
    this.alertingProjects = this.projects.filter(project => project.alerting).length;
  }
  //********
  searchText: string = '';
  filteredProjects() {
    if (!this.searchText) {
      return this.projects;
    }
    return this.projects.filter(project =>
      project.projectName.toLowerCase().includes(this.searchText.toLowerCase()));
  }
  logout() {
    this.userinfoservice.logout().subscribe(
      (response) => {
        console.log("ADIOS");
        this.router.navigate(["/"]);
      },
      (error) => {
        console.error('Logout failed', error);
      }
    );
  }
}
