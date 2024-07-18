import { Dialog } from '@angular/cdk/dialog';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { interval, timer } from 'rxjs';
import { DataService } from '../services/data-service.service';
import { HealthcheckService } from '../services/healthcheck.service';
import { ProjectDTO } from '../services/project.service';
import { UserinfoService } from '../services/userinfo.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface RuleInfo {
  instance: string;
  name: string;
  query: string;
  duration: string;
  state: string;
  description: string;
  summary: string;
  severity: string;
}

export interface AlertInfo {
  alertname: string;
  instance: string;
  job: string;
  severity: string;
  state: string;
  activeAt: string;
  timestamp: string;
}

export interface MailNotifInfo {
  alertname: string;
  instance: string;
  emails: string[];
  severity: string;
  state: boolean;
  receiver:string;
}

interface StateDistribution {
  state: string;
  count: number;
}
interface ChartData { name: string; value: number; }







@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent {
  rules: any[] = [];
  alerts: any[] = [];
  uid: string = '';
  dashboardTitle: string = "projet3";
  panelIds: string[] = [];
  showInfoMenu: boolean = false;
  showRuleInfoMenu: boolean = false;
  showAlertEditMenu: boolean = false;
  nbRules: Number=0;
  rulesArray!: RuleInfo[];
  alertArray!: AlertInfo[];
  projectName!: string;
  appType!: string;
  nbms!: Number;
  ipAddressesArray!: string;
  nbAlerts = 0;
  showPopup = true;
  status = true;
  ruleName!: string;
  description!: string;
  summary!: string;
  severity!: string;
  timeRange!: string;
  newruleName: string = "";
  newdescription: string = "";
  newsummary: string = "";
  newseverity: string = "";
  newtimeRange: string = "";
  alertName!: string;
  receiverName!: string;
  receiverEmail!: string;
  teamName!: string;
  newReceiverEmail!: string;
  newSenderEmail!: string;
  showRuleEditMenu = false;
  instance!: string;
  buttonState: string = "";
  alertEmails!:string[];
  project!:ProjectDTO;
  microservicesnames!:string[];
  extractedIpAddr!:string[];
  userRole!:string;
  isUserManager!:string;
  isUserAdmin:string="";
  severityByStateData: any[]=[];

  searchText: string = '';
  searchSeverity: string = '';
  searchState: string = '';
  filteredAlerts: any[] = []; // Declare filteredAlerts array


  gaugeValue: number = 0; // Example gauge value, replace with actual value



  severityDistribution: { name: string, value: number }[] = [];
  instanceDistribution: { name: string, value: number }[] = [];
  activeAlertsOverTime: { name: string, series: { name: string, value: number }[] }[] = [];
  stateDistribution: { name: string, value: number }[] = [];
  jobDistribution: { name: string, value: number }[] = [];
  instanceSeverityRadar: { name: string, series: { name: string, value: number }[] }[] = [];
  alertTypeDistribution: { name: string, value: number }[] = [];
  alertNameDistribution: { name: string, value: number }[] = [];

  single!: any[];
  public view: any[] = [700, 400];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = true;
  public showXAxisLabel = true;
  public xAxisLabel!: "";
  public showYAxisLabel = true;
  public yAxisLabel!: "Active Alert";
  public graphDataChart!: any[];




  colorScheme: Color = {
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#2BC3EA','#bdd248', '#00AE4E','#E74C3C']
  };












  constructor(private dataService:DataService,private location: Location,private dialog: MatDialog,private router: Router, private http: HttpClient,
      private activatedRoute: ActivatedRoute,private healthCheckService: HealthcheckService,private userInfoService:UserinfoService) {
        this.xAxisLabel = "";
        this.yAxisLabel = "Active Alert";
      }

  ngOnInit() {
    this.checkHealth();
    interval(20 * 1000) // 60 seconds = 1 minute
      .subscribe(() => {
        this.checkHealth();
      });

    this.project=this.dataService.getProject();
    this.projectName=this.project.projectName;
    this.ipAddressesArray=this.project.ipAddresses;
    this.appType=this.project.appType;
    this.extractedIpAddr=this.ipAddressesArray.split(",");
    this.microservicesnames=this.project.msnames.split(",");
    this.isUserManager=this.dataService.getUserInfo()?.user.role.toString()|| "";

    this.userRole=this.dataService.getUserRole();

    console.log("this.projectName" + this.projectName);
    console.log("this.appType" + this.appType);
    console.log("this.nbms" + this.nbms);
    console.log("this.addr" + this.ipAddressesArray);
    this.lerules();
    timer(5000);
    this.getAlerts();

    interval(60 * 1000) // 60 seconds = 1 minute
    .subscribe(() => {
      this.getAlerts();
    });

    this.prepareSeverityDistribution();

    this.prepareAlertNameDistribution ();
    this.prepareActiveAlertsOverTime();
    this.prepareStateDistribution();
    this.prepareJobDistribution();
    this.prepareSeverityByState();
    this.prepareAlertTypeDistribution();
    this.prepareSeverityDistributon();



//------
this.filteredAlerts = this.alertArray; // Initialize filtered data with all alerts
  }














  //----------------


   prepareSeverityDistribution() {
    this.http.get<AlertInfo[]>('http://localhost:8080/api/prometheus/rulefile/get_alert_status')
      .subscribe((response) => {
        const severityCounts: { [severity: string]: number } = {};
        response.forEach(alert => {
          severityCounts[alert.severity] = (severityCounts[alert.severity] || 0) + 1;
        });
        this.severityDistribution = Object.keys(severityCounts).map(severity => ({
          name: severity,
          value: severityCounts[severity]
        }));
      });
  }
  prepareAlertNameDistribution() {
    this.http.get<AlertInfo[]>('http://localhost:8080/api/prometheus/rulefile/get_alert_status', { params: { instances: this.ipAddressesArray } })
      .subscribe((response) => {
        const alertNameCounts: { [alertName: string]: number } = {};
        response.forEach(alert => {
          alertNameCounts[alert.alertname] = (alertNameCounts[alert.alertname] || 0) + 1;
        });
        this.alertNameDistribution = Object.keys(alertNameCounts).map(alertName => ({
          name: alertName,
          value: alertNameCounts[alertName]
        }));
      });
  }
  prepareActiveAlertsOverTime() {
    this.http.get<AlertInfo[]>('http://localhost:8080/api/prometheus/rulefile/get_alert_status', { params: { instances: this.ipAddressesArray } })
      .subscribe((response) => {
        const timeSeries: { [time: string]: number } = {};
        response.forEach(alert => {
          const time = new Date(alert.activeAt).toLocaleString();
          timeSeries[time] = (timeSeries[time] || 0) + 1;
        });
        this.activeAlertsOverTime = Object.keys(timeSeries).map(time => ({
          name: time,
          series: [{ name: time, value: timeSeries[time] }]
        }));
      });
  }
  prepareStateDistribution() {
    this.http.get<AlertInfo[]>('http://localhost:8080/api/prometheus/rulefile/get_alert_status', { params: { instances: this.ipAddressesArray } })
      .subscribe((response) => {
        const stateCounts: { [state: string]: number } = {};
        response.forEach(alert => {
          stateCounts[alert.state] = (stateCounts[alert.state] || 0) + 1;
        });
        this.stateDistribution = Object.keys(stateCounts).map(state => ({
          name: state,
          value: stateCounts[state]
        }));
      });
  }
  prepareJobDistribution() {
    this.http.get<AlertInfo[]>('http://localhost:8080/api/prometheus/rulefile/get_alert_status', { params: { instances: this.ipAddressesArray } })
      .subscribe((response) => {
        const jobCounts: { [job: string]: number } = {};
        response.forEach(alert => {
          jobCounts[alert.job] = (jobCounts[alert.job] || 0) + 1;
        });
        this.jobDistribution = Object.keys(jobCounts).map(job => ({
          name: job,
          value: jobCounts[job]
        }));
      });
  }
  prepareSeverityByState() {
    this.http.get<AlertInfo[]>('http://localhost:8080/api/prometheus/rulefile/get_alert_status', { params: { instances: this.ipAddressesArray } })
    .subscribe((response) => {
      const severityCounts: { [severity: string]: number } = {};
      response.forEach(alert => {
        severityCounts[alert.severity] = (severityCounts[alert.severity] || 0) + 1;
      });
      this.severityDistribution = Object.keys(severityCounts).map(severity => ({
        name: severity,
        value: severityCounts[severity]
      }));
    });
  }
  prepareAlertTypeDistribution() {
    this.http.get<AlertInfo[]>('http://localhost:8080/api/prometheus/rulefile/get_alert_status', { params: { instances: this.ipAddressesArray } })
      .subscribe((response) => {
        const alertTypeCounts: { [alertType: string]: number } = {};
        response.forEach(alert => {
          alertTypeCounts[alert.alertname] = (alertTypeCounts[alert.alertname] || 0) + 1;
        });
        this.alertTypeDistribution = Object.keys(alertTypeCounts).map(alertType => ({
          name: alertType,
          value: alertTypeCounts[alertType]
        }));
      });
  }
  prepareSeverityDistributon() {
    this.http.get<AlertInfo[]>('http://localhost:8080/api/prometheus/rulefile/get_alert_status', { params: { instances: this.ipAddressesArray } })
      .subscribe((response) => {
        const severityCounts: { [severity: string]: number } = {};
        response.forEach(alert => {
          severityCounts[alert.severity] = (severityCounts[alert.severity] || 0) + 1;
        });
        this.severityDistribution = Object.keys(severityCounts).map(severity => ({
          name: severity,
          value: severityCounts[severity]
        }));
        // Example: Calculate a gauge value (sum of counts for demo)
        this.gaugeValue = this.severityDistribution.reduce((sum, item) => sum + item.value, 0);
      });
  }

  //--------------

  getInstanceIndex(i:string){
    const index = this.extractedIpAddr.indexOf(i);
    return this.microservicesnames[index];

  }
  logout(){
    this.userInfoService.logout().subscribe(
      (response) => {
        console.log("ADIOS");
        this.router.navigate(["/"]);
  
  
      },
      (error) => {
        console.error('Logout failed', error);
      }
    );
  }

  openAlertEditMenu() {
    this.showAlertEditMenu = !this.showAlertEditMenu;
  }

  lerules() {
    console.log("this.ipAddressesArray" + this.ipAddressesArray);
    this.http.get<RuleInfo[]>('http://localhost:8080/api/prometheus/rulefile/get_rules', { params: { instances: this.ipAddressesArray } })
      .subscribe((response) => {
        this.rulesArray = response;
        console.log("here" + this.rulesArray);
        console.log("here2" + this.rulesArray[0].name);
        setTimeout(() => {
          this.nbRules = this.rulesArray.length;
        }, 1000);
        console.log(this.nbRules);
      });
  }

  getAlerts() {
    this.http.get<AlertInfo[]>('http://localhost:8080/api/prometheus/rulefile/get_alert_status', { params: { instances: this.ipAddressesArray } })
      .subscribe((response) => {
        console.log("response", response);
        this.alertArray = Object.values(response);
        console.log("herealert", this.alertArray);
        this.nbAlerts = this.alertArray.length;
        for (let alert of this.alertArray) {
          console.log("Alert Name:", alert.alertname);
          console.log("Instance:", alert.instance);
          console.log("Job:", alert.job);
          console.log("Severity:", alert.severity);
          console.log("State:", alert.state);
          console.log("Active At:", alert.activeAt);
          console.log("------------------------");
        }
      });
  }

  saveModifiedRule() {
    const modifiedRuleValues = new Map<string, string>();
    modifiedRuleValues.set('ruleName', this.ruleName);
    modifiedRuleValues.set('instance', this.instance);
    if (this.newdescription !== "") {
      modifiedRuleValues.set('description', this.newdescription);
    }
    if (this.newsummary !== "") {
      modifiedRuleValues.set('summary', this.newsummary);
    }
    if (this.newseverity !== "") {
      modifiedRuleValues.set('severity', this.newseverity);
    }
    if (this.newtimeRange !== "") {
      modifiedRuleValues.set('for', this.newtimeRange);
    }
  
    const headers = { 'Content-Type': 'application/json' };
    const toast = document.getElementById("toast-message")!;
    console.log("modifiedRuleValues" + modifiedRuleValues);
    const modifiedRuleValuesArray = JSON.stringify(Array.from(modifiedRuleValues));
    console.log("modifiedRuleValuesArray" + modifiedRuleValuesArray);
    this.http.post<boolean>('http://localhost:8080/api/prometheus/rulefile/modify_rule', modifiedRuleValuesArray, { headers }).subscribe(
      (response) => {
        if (response) {
          console.log("modified");
          this.showRuleEditMenu = !this.showRuleEditMenu;
          toast.innerHTML = "Rule Modified!";
          toast.classList.add("toast-success");
          toast.classList.add("show");
          setTimeout(() => {
            this.refreshPage();
          }, 2000);
        } else {
          toast.innerHTML = "Error Modifying Failed!";
          toast.classList.add("toast-failed");
          console.error('Failed to modify the rule.');
        }
      },
      (error) => {
        toast.innerHTML = "Error Modifying Failed!";
        toast.classList.add("toast-failed");
        console.error('An error occurred while modifying the rule:', error);
      }
    );
    setTimeout(() => {
      document.getElementById("toast-message")!.classList.remove("show");
    }, 1000);
  }

  openRuleEditMenu() {
    this.showRuleEditMenu = !this.showRuleEditMenu;
  }

  showRuleInfo(rowData: any) {
    this.ruleName = rowData.name;
    this.description = rowData.description;
    this.summary = rowData.summary;
    this.severity = rowData.severity;
    this.timeRange = rowData.duration;
    this.instance = rowData.instance;
    console.log("this.description" + this.description);
  }

  saveAlert() {
    console.log('Alert Name:', this.alertName);
    console.log('Receiver Name:', this.receiverName);
    console.log('Receiver Email:', this.receiverEmail);
    console.log('Team Name Associated:', this.teamName);
    console.log('Add New Receiver Email:', this.newReceiverEmail);
    console.log('New Sender Email:', this.newSenderEmail);
    const ruleName2 = this.ruleName.valueOf;
    console.log("ruleName2" + ruleName2);
  }

  addToggle() {
    this.status = !this.status;
  }

  handleClose() {
    console.log("Popup closed");
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  goDashboard() {
    this.router.navigate(['/dashboard', {
      projectName: this.projectName,
      ipAddressesArray: this.ipAddressesArray,
      appType: this.appType,
      nbms: this.nbms
    }]);
  }

  selectedItem: number = 1; // Default selected item index

  selectItem(index: number): void {
    this.selectedItem = index;
  }

  openInfo() {
    console.log("opened");
    this.showInfoMenu = !this.showInfoMenu;
  }

  openRuleInfo() {
    console.log("opened");
    this.showRuleInfoMenu = !this.showRuleInfoMenu;
  }

  onDelete(rowData: any): void {
    const rulename = rowData.name;
    const ruleinstance = rowData.instance;
    console.log("rulename" + rulename);
    console.log("ruleinstance" + ruleinstance);
    const ruleData = {
      rulename: rulename,
      instance: ruleinstance
    }
    const toast = document.getElementById("toast-message")!;
    this.http.post<boolean>('http://localhost:8080/api/prometheus/rulefile/delete_rule', null, { params: ruleData }).subscribe(
      (response) => {
        if (response) {
          toast.innerHTML = "Rule Deleted!";
          toast.classList.add("toast-success");
          toast.classList.add("show");
          setTimeout(() => {
            this.refreshPage();
          }, 2000);
        }
        else {
          toast.innerHTML = "Error Deleting the Rule!";
          toast.classList.add("toast-failed");
          console.error('Failed to delete the rule.');
        }
      },
      (error) => {
        toast.innerHTML = "Error Deleting the Rule!";
        toast.classList.add("toast-failed");
        console.error('An error occurred while deleting the rule:', error);
      }
    );
    setTimeout(() => {
      document.getElementById("toast-message")!.classList.remove("show");
    }, 1000);
    this.showDialog = !this.showDialog;

  }

/*
prepareSeverityDistribution() {
  this.http.get<AlertInfo[]>('http://localhost:8080/api/prometheus/rulefile/get_alert_status', { params: { instances: this.ipAddressesArray } })
    .subscribe((response) => {
      const severityCounts: { [severity: string]: number } = {};
      response.forEach(alert => {
        severityCounts[alert.severity] = (severityCounts[alert.severity] || 0) + 1;
      });
      this.severityDistribution = Object.keys(severityCounts).map(severity => ({
        name: severity,
        value: severityCounts[severity]
      }));
    });
}
*/

//---------------------------

  openPopup(){
    this.showPopup=!this.showPopup;
    this.router.navigate(['/addalert',{
      projectName: this.projectName,
      ipAddressesArray : this.ipAddressesArray ,
      nbms:this.nbms,
      appType:this.appType,
    }]);
  
  }


  searchTerm: string = '';
  searchQuery: any;
  filterItems() {
    this.searchQuery = {
      instance: this.searchTerm,
      alertname: this.searchTerm,
      job: this.searchTerm,
      severity: this.searchTerm,
      state: this.searchTerm
    };
  }

  disableAlert(rowData:any){
    
    const alertname=rowData.alertname;
    const instance=rowData.instance;
    const url='http://localhost:8080/api/alertmanager/disable-enable-alert'
    const data={
      alertname:alertname,
      instance:instance
    }
    console.log("dataaa"+data);
    const toast = document.getElementById("toast-message")!;

    this.http.post<Boolean>(url,null,{params:data}).subscribe(
      (response) =>{
        if(response){
          toast.innerHTML = "Alert State Changed!";
          toast.classList.add("toast-success");
          toast.classList.add("show");
          setTimeout(() => {
            this.refreshPage();
          }, 2000);
          

        }
        else {
          toast.innerHTML = "Error Changing the State of the Alert!";
          toast.classList.add("toast-failed");
          console.error('Failed to change the State of the Alert.');
        }
      },
      (error) => {
        toast.innerHTML = "Error Changing the State of the Alert!";
        toast.classList.add("toast-failed");
        console.error('An error occurred while Changing the state of the alert:', error);
      }
    );
    setTimeout(() => {
      document.getElementById("toast-message")!.classList.remove("show");
    }, 1000);


     }

     iconState:string="";
     state:string="";

     getMails(rowData: any) {
      this.alertName = rowData.alertname;
      this.instance = rowData.instance;
      const url = 'http://localhost:8080/api/alertmanager/get-alert-emails';
      const data = {
        alertname: this.alertName,
        instance: this.instance
      };
      console.log("dataaa", data);
      const toast = document.getElementById("toast-message")!;
    
      this.http.get<MailNotifInfo>(url, { params: data }).subscribe(
        (response: MailNotifInfo) => {
          if (response) {
            toast.innerHTML = "Retrieving Information!";
            toast.classList.add("toast-success");
            toast.classList.add("show");
            console.log("l name"+response.alertname);
            console.log("l name"+response.instance);
            console.log("l name"+response.emails);
            console.log("l state"+response.state);
            console.log("l name"+response.receiver);
            this.receiverName=response.receiver;
            this.alertEmails=response.emails;
            console.log("emails "+this.alertEmails[0]);
            console.log("emails "+this.alertEmails[1]);

            console.log("emails "+this.alertEmails[2]);
            console.log("emails "+this.alertEmails[3]);
            if(!response.state){
              this.iconState="alarm_off";
              this.buttonState="Enable Alert";
              this.state="Alert Notification Disabled "
            }
            else{
              this.iconState="alarm_on";
              this.buttonState="Disable Alert";
              this.state="Alert Notification Enabled "


            }
        
          } else {
            toast.innerHTML = "Error Getting the Information!";
            toast.classList.add("toast-failed");
            console.error('Error Getting the Information.');
          }
        },
        (error) => {
          toast.innerHTML = "Error Getting the Information!";
          toast.classList.add("toast-failed");
          console.error('Error Getting the Information:', error);
        }
      );
      setTimeout(() => {
        document.getElementById("toast-message")!.classList.remove("show");
      }, 2000);
    }
    goRules(){
      this.router.navigate( ['/rules']);
    }
  goMailSettings(){
  console.log("go");
    this.router.navigate(['/mailsettings',{
      projectName: this.projectName,
      ipAddressesArray : this.ipAddressesArray ,
      nbms:this.nbms,
      appType:this.appType,
    }]);
  }
  numberPrometheusdown=0;
  numberGrafanadown=0;
  numberAlertManagerdown=0;

  private checkHealth(): void {
    const toast4 = document.getElementById("toast-message4")!;
    const toast2 = document.getElementById("toast-message2")!;
    const toast3 = document.getElementById("toast-message3")!;
  
    this.healthCheckService.checkPrometheusHealth().subscribe(
      (isUp) => {
        console.log('Prometheus is up:', isUp);
  
        toast4.innerHTML = isUp ? "Prometheus is UP!" : "Prometheus is DOWN!";
        toast4.classList.remove("toast4-success", "toast4-failed");
        toast4.classList.add("toast4", isUp ? "toast4-success" : "toast4-failed", "show");
        if(isUp==true){
            this.numberPrometheusdown=0;
        }
        else{
          this.numberPrometheusdown+=1;
          if(this.numberPrometheusdown==5){
            timer(3000);
            this.restartPrometheus();
          }

        }
        console.log("down down"+this.numberPrometheusdown);
        // Hide the toast after 3 seconds
        setTimeout(() => {
          toast4.classList.remove("show");
        }, 7000);
      },
      (error) => {
        console.error('Error occurred while checking Prometheus health:', error);
  
        toast4.innerHTML = "Error Modifying Failed!";
        toast4.classList.remove("toast4-success");
        toast4.classList.add("toast4", "toast4-failed");
        console.log("mche lenaaa");
  
        // Hide the toast after 3 seconds
        setTimeout(() => {
          toast4.classList.remove("show");
        }, 7000);
      }
    );
  
    this.healthCheckService.checkGrafanaHealth().subscribe(
      (isUp) => {
        console.log('Grafana is up:', isUp);
  
        toast2.innerHTML = isUp ? "Grafana is UP!" : "Grafana is DOWN!";
        toast2.classList.remove("toast2-success", "toast2-failed");
        toast2.classList.add("toast2", isUp ? "toast2-success" : "toast2-failed", "show");
  
     

        // Hide the toast after 3 seconds
        setTimeout(() => {
          toast2.classList.remove("show");
        }, 7000);
      },
      (error) => {
        console.error('Error occurred while checking Grafana health:', error);
  
        toast2.innerHTML = "Error Modifying Failed!";
        toast2.classList.remove("toast2-success");
        toast2.classList.add("toast2", "toast2-failed");
  
        // Hide the toast after 3 seconds
        setTimeout(() => {
          toast2.classList.remove("show");
        }, 7000);
      }
    );
  
    this.healthCheckService.checkAlertmanagerHealth().subscribe(
      (isUp) => {
        console.log('Alertmanager is up:', isUp);
  
        toast3.innerHTML = isUp ? "Alertmanager is UP!" : "Alertmanager is DOWN!";
        toast3.classList.remove("toast3-success", "toast3-failed");
        toast3.classList.add("toast3", isUp ? "toast3-success" : "toast3-failed", "show");
  
        if(isUp==true){
          this.numberAlertManagerdown=0;
        }
        else{
          this.numberAlertManagerdown+=1;
          if(this.numberAlertManagerdown==5){
            timer(3000);
            this.restartAlertManager();
          }

        }

        // Hide the toast after 3 seconds
        setTimeout(() => {
          toast3.classList.remove("show");
        }, 7000);
      },
      (error) => {
        console.error('Error occurred while checking Alertmanager health:', error);
  
        toast3.innerHTML = "Error Getting Status Failed!";
        toast3.classList.remove("toast3-success");
        toast3.classList.add("toast3", "toast3-failed");
  
        // Hide the toast after 3 seconds
        setTimeout(() => {
          toast3.classList.remove("show");
        }, 7000);
      }
    );
  }


  restartPrometheus(): void {
    const toast5 = document.getElementById("toast-message5")!;
  
    this.healthCheckService.restartPrometheusContainer().subscribe(
      (isRestarted) => {
        if (isRestarted) {
          toast5.innerHTML = "Prometheus Restarted!";
          toast5.classList.remove("toast5-failed");
          toast5.classList.add("toast5", "toast5-success", "show");
        } else {
          toast5.innerHTML = "Failed to restart Prometheus!";
          toast5.classList.remove("toast5-success");
          toast5.classList.add("toast5", "toast5-failed", "show");
        }
  
        // Hide the toast after 3 seconds
        setTimeout(() => {
          toast5.classList.remove("show");
        }, 7000);
      },
      (error) => {
        console.error('Error occurred while restarting Prometheus:', error);
  
        toast5.innerHTML = "Failed to restart Prometheus!";
        toast5.classList.remove("toast5-success");
        toast5.classList.add("toast5", "toast5-failed", "show");
  
        // Hide the toast after 3 seconds
        setTimeout(() => {
          toast5.classList.remove("show");
        }, 7000);
      }
    );
  }
  
  restartAlertManager(): void {
    const toast6 = document.getElementById("toast-message6")!;
  
    this.healthCheckService.restartAlertManagerContainer().subscribe(
      (isRestarted) => {
        if (isRestarted) {
          toast6.innerHTML = "AlertManager Restarted!";
          toast6.classList.remove("toast6-failed");
          toast6.classList.add("toast6", "toast6-success", "show");
        } else {
          toast6.innerHTML = "Failed to restart AlertManager!";
          toast6.classList.remove("toast6-success");
          toast6.classList.add("toast6", "toast6-failed", "show");
        }
  
        // Hide the toast after 3 seconds
        setTimeout(() => {
          toast6.classList.remove("show");
        }, 7000);
      },
      (error) => {
        console.error('Error occurred while restarting AlertManager:', error);
  
        toast6.innerHTML = "Failed to restart AlertManager!";
        toast6.classList.remove("toast6-success");
        toast6.classList.add("toast6", "toast6-failed", "show");
  
        // Hide the toast after 3 seconds
        setTimeout(() => {
          toast6.classList.remove("show");
        }, 7000);
      }
    );
  }
  showDialog: boolean = false;
  deleteruleselected!:RuleInfo;

  openDialog() {
    this.showDialog = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = false;
    
    this.dialog.open(Dialog, dialogConfig);
  }
  
 storeRuleToDlete(rule:RuleInfo){
  this.deleteruleselected=rule;
  console.log("ruleselected"+this.deleteruleselected);   


 }

 closeDialog() {
   this.showDialog = false;
  // this.goAlert();

 }
 deleteConfirmation(){
 // console.log("this.ruleselected"+this.deleteruleselected.name);
   this.onDelete(this.deleteruleselected);

 }
 refreshPage() {

   location.reload();
 }
 


 generatePDF(): void {
  const doc = new jsPDF();
  const alerts = this.alertArray;
  doc.text('Alert List', 10, 10);
  doc.setTextColor(255, 255, 255); // White
  doc.setFontSize(12);
  // Set header background color
  doc.setFillColor(43, 195, 234); // #2BC3EA
  // Add separator line
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  // Add image
  const img = new Image();
  img.onload = () => {
    const imgWidth = 30;
    const imgHeight = (img.height * imgWidth) / img.width;
    const marginLeft = doc.internal.pageSize.width - imgWidth - 15; // Calculate the left margin for the image
    doc.addImage(img, 'PNG', marginLeft, 5, imgWidth, imgHeight); // Position the image on the right of the PDF
    autoTable(doc, {
      head: [['Instance', 'Alert Name', 'Severity', 'Active At', 'State']],
      body: alerts.map(alert => [
        alert.instance,
        alert.alertname,
        alert.severity,
        new Date(alert.activeAt).toLocaleString(),
        alert.state,
        '' // Actions are usually buttons or interactive elements, which don't translate directly to PDF content
      ]),
      startY: 20,
      headStyles: {
        fillColor: [43, 195, 234], // #2BC3EA
        textColor: [255, 255, 255] // White
      }
    });
    doc.save('alert_list.pdf');
  };
  img.src = 'assets/logo-actia.png'; // Path to your image
}


filterProjects(): void {
  this.filteredAlerts = this.alertArray.filter(alert =>
    (alert.alertname.toLowerCase().includes(this.searchText.toLowerCase()) ||
     alert.job.toLowerCase().includes(this.searchText.toLowerCase())) &&
    alert.severity.toLowerCase().includes(this.searchSeverity.toLowerCase()) &&
    alert.state.toLowerCase().includes(this.searchState.toLowerCase())
  );
}


}