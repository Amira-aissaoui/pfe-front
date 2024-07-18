import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, interval, timer } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataService } from '../services/data-service.service';
import { DroppedItemsService } from '../services/droppeditems.service';
import { HealthcheckService } from '../services/healthcheck.service';
import { ProjectDTO } from '../services/project.service';
import { UserinfoService } from '../services/userinfo.service';
import { throwError } from 'rxjs';
import { ViewChild } from '@angular/core';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


import { FormBuilder, FormGroup } from '@angular/forms';
import { PaneleditComponent } from '../paneledit/paneledit.component';



interface PanelSize {
  width: number;
  height: number;
}
  interface DashboardUidResponse {
  uid: string;
}

interface PanelIdResponse {
  panelIds: string[];
  body: { targets: { expr: string }[] };
}
interface PanelIdBytagResponse {
  panelIds: string[];
  body: { targets: { expr: string }[] };
}

interface DroppedItem {
  positionX: number;
  positionY: number;
  content: any;
}
declare const M: any; // Declare M as an external library

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  
})
export class DashboardComponent implements AfterViewInit{

  @ViewChild(PaneleditComponent) panelEditComponent!: PaneleditComponent;

  //----------------------add here


  @ViewChild('picker') picker!: MatDateRangePicker<Date>;
  startDate: Date | null = null; 
  endDate: Date | null = null; 
  dateError: string | null = null;


  //-----------------------

dashboardForm!: FormGroup;

droppedItems: DroppedItem[] = [];
uid: string='';
dashboardTitle:string="";
panelIds: string[] = [];
projectName!:string;
ipAddresses!:string;
urlList: SafeResourceUrl[] = [];
urlList2: SafeResourceUrl[] = [];

showPopup = false;
status = true;
responseValue!: PanelIdResponse;
responseValueBytag!:PanelIdBytagResponse;
responseValueBytag2!:PanelIdBytagResponse;
i=0;
PanelId!:String;
items = Array();
numberPrometheusdown=0;
numberGrafanadown=0;
numberAlertManagerdown=0;





constructor(private location: Location,
  private activatedRoute: ActivatedRoute,private droppedItemsService: DroppedItemsService,
  private dataService:DataService,private fb: FormBuilder,
  private router: Router,private http:HttpClient,private sanitizer: DomSanitizer,private healthCheckService: HealthcheckService,
  private userInfoService:UserinfoService
  )  { }
nbms!:Number;
appType!:string;
deployment!:string;
ipAddressesArray!:string;
msnom!:string;
isAlerting=false;
microservicesnames!:string[];
role!:string;
userRole:string="";
isUserManager="";

ngOnInit() {

  //---------------------------
  this.dashboardForm = this.fb.group({
    dashboardTitle: [''],
    newTitle: [''],
    refresh: [''],
    date: ['']
  });


    this.checkHealth();

    interval(20 * 1000) // 60 seconds = 1 minute

      .subscribe(() => {

        this.checkHealth();
  
      });


    const project:ProjectDTO=this.dataService.getProject();

    this.projectName=project.projectName;


    this.ipAddressesArray=project.ipAddresses;

    this.appType=project.appType;

    this.nbms=this.ipAddressesArray.split(',').length;
    this.isAlerting=project.alerting;
    this.microservicesnames=project.msnames.split(",");

    this.deployment=project.deployment;

    this.msnom=project.msnames;

    this.items = Array(this.nbms).fill(0);
    this.isUserManager=this.dataService.getUserInfo()?.user.role.toString()|| "";
    if(this.dataService.getUserRole() !=null)
    {
      this.userRole=this.dataService.getUserRole();
    }
    this.getDashboardUidByName();


  if(this.appType.includes("Microservices")){
    this.selectedMicroservice=this.microservicesnames[0];
    

    this.SelectedMs=1;

    this.getGenericPanelIdsByTag();

    this.getPanelIdsByTag();

  }

  else{

 //  this.getAllPanelIds();

  this.SelectedMs=1;

  this.getGenericPanelIdsByTag();

  this.getPanelIdsByTag();



  }







}
 // Inside your component class:
panelSizes: PanelSize[] = [];


// Function to initialize the panelSizes array based on the number of panels
initializePanelSizes() {
  console.log("urlList HEREEEEEEEEEEEEEEEE"+this.urlList.length);

  this.panelSizes = this.urlList.map(() => ({ width: 490, height: 300 }));
  console.log("panelsize"+this.panelSizes.length);
}



increaseSize(index: number) {
  console.log("panelsize"+ this.panelSizes[index].width);
  console.log("panelsize"+ this.panelSizes[index].height);
  console.log("panelsize"+ this.panelSizes[index+1].height);
  console.log("panelsize"+ this.panelSizes[index+1].width);

  console.log("index"+index);
  this.panelSizes[index].width += 50;
  this.panelSizes[index].height += 50;
}

decreaseSize(index: number) {
  this.panelSizes[index].width -= 50;
  this.panelSizes[index].height -= 50;
}


  goRules(){
    this.router.navigate(['/rules']);
  }
  selectedTime!: string;

onTimeChange(time:any) {
  this.selectedTime = time;
  const selectedTime = this.selectedTime;


}
SelectedMs:Number=1;
showMs:boolean=true;
selectedMicroservice!:string;

getTheSelectedMs(i:number){
        this.SelectedMs=i;
        this.selectedMicroservice=this.microservicesnames[i-1];
        console.log("lena"+this.selectedMicroservice);
        this.getGenericPanelIdsByTag();
        this.getPanelIdsByTag();
}









//---------------------------------------add here

onStartDateChange(event: any): void {
  
  this.startDate = new Date(event.value);
  console.log("Start date: ", this.startDate);
}
onEndDateChange(event: any): void {
  this.endDate = new Date(event.value);
  console.log("End date: ", this.endDate);
}
updateCalendar(): void {
  if (this.startDate && this.endDate) {
    const dashboardTitle = this.projectName;
    const startDateString = this.startDate.toISOString().slice(0, 10);
    const endDateString = this.endDate.toISOString().slice(0, 10);

    const requestObject = { dashboardTitle, startDateString, endDateString };
    console.log('Request object:', requestObject);

    this.dataService.updateDashboardCalendar(dashboardTitle, startDateString, endDateString)
      .subscribe({
        next: (response) => {
          console.log('Dashboard updated successfully:', response);
        },
        error: (error) => {
          if (error.status === 0) {
            console.error('Check your network connection and CORS configuration.');
          } else {
            console.error('Error updating dashboard:', error);
          }
        }
      });
  } else {
    this.dateError = 'Both start date and end date must be selected.';
    console.error(this.dateError);
  }
}

/*
updateCalendar(): void {
  const DASHBOARD_TITLE = 'Your Dashboard Title';
  const NEW_TITLE = 'New Dashboard Title';
  const REFRESH = '1m';
  let startDateString = '';
  let endDateString = '';

  if (this.startDate) {
    startDateString = this.formatDate(this.startDate);
  }

  if (this.endDate) {
    endDateString = this.formatDate(this.endDate);
  }

  this.dataService.updateDashboardCalendar(DASHBOARD_TITLE, NEW_TITLE, REFRESH, startDateString, endDateString)
    .subscribe((response: any) => {
      console.log('Dashboard calendar updated successfully', response);
    });
}

onDateChange(event: any): void {
  if (event.value) {
    this.startDate = event.value[0];
    this.endDate = event.value[1];
  } else {
    this.startDate = null;
    this.endDate = null;
  }
}

formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
}

*/





addToggle()
{
  this.status = !this.status;
}

  handleClose() {
  //  console.log("Popup closed");
  }


  getDashboardUidByName() {
    const dashboardTitle=this.projectName;
    this.http.post<DashboardUidResponse>('http://localhost:8080/api/grafana/dashboard-uid',null,{params :{
    dashboardTitle
    }})
      .subscribe((response) => {
        this.uid = response.uid;
      //  console.log(this.uid);
      });
  }



  getAllPanelIds() {

    const params = {
      dashboardTitle: this.projectName
    };
 // console.log("params"+params.dashboardTitle);
  timer(1000);
    this.http.get<PanelIdResponse>('http://localhost:8080/api/grafana/allpanels', { params: params })
      .subscribe(
        (response) => {
          this.responseValue = response;
        //  console.log("response"+response);
          this.getPanelsUrl();


          //console.log(response);
        },
        (error) => {
          console.error('Error fetching panel IDs:', error);
        }
      );
  }
  getPanelIdsByTag() {
    const Tag=Number(this.SelectedMs);
    //const Tag=1;
    //console.log("lena"+this.responseValueBytag);

    timer(5000);
      this.http.get<PanelIdBytagResponse>('http://localhost:8080/api/grafana/allpanelsbytag', { params: {
        dashboardTitle:this.projectName,
        tag:Tag
      } })
        .subscribe(
          (response) => {
          //  console.log("HEREEEEEEEEEEE"+response);
            this.responseValueBytag = response;
           // console.log("this.responseValueBytag"+this.responseValueBytag);
            this.getPanelsUrlByTag();

          },
          (error) => {
            console.error('Error fetching panel IDs:', error);
          }
        );
    }


    getGenericPanelIdsByTag() {
      const Tag=0;
      //const Tag=1;
   //   console.log("lena1"+this.responseValueBytag);

      timer(3000);
        this.http.get<PanelIdBytagResponse>('http://localhost:8080/api/grafana/allpanelsbytag', { params: {
          dashboardTitle:this.projectName,
          tag:Tag
        } })
          .subscribe(
            (response) => {
              //console.log("response"+response);
              this.responseValueBytag2 = response;
          //    console.log("this.responseValueBytag"+this.responseValueBytag2);
              this.getGenericPanelsUrlByTag();

            },
            (error) => {
              console.error('Error fetching panel IDs:', error);
            }
          );
      }

      //retrieving the expression (expr) from the Grafana JSON 

      getExprFromPanel(panelUrl: string): Observable<string> {
        return this.http.get<any>(panelUrl, { observe: 'response' }).pipe(
          map(response => {
            if (response && response.body) {
              // Check if targets exist before accessing
              if (response.body.targets) {
                const targets = response.body.targets;
                if (targets && targets.length > 0) {
                  return targets[0].expr;
                } else {
                  console.error('No targets found in panel JSON');
                  return '';
                }
              } else {
                console.error('Missing targets property in response body');
                return ''; // Or handle the missing property differently
              }
            } else {
              console.error('Panel response body is undefined');
              return '';
            }
          }),
          catchError(error => {
            console.error('Error fetching panel expr:', error);
            return throwError('');
          })
        );
      }
      
      


      






  getGenericPanelsUrlByTag() {
    this.urlList2= [];

    if (Array.isArray(this.responseValueBytag2)) {
      for (const panelId of this.responseValueBytag2) {
        const panelurl = `http://localhost:3000/d-solo/${this.uid}/template?orgId=1&panelId=${panelId}&theme=light&refresh=5s`;
        const panelsecuredurl= this.sanitizer.bypassSecurityTrustResourceUrl(panelurl);
        //console.log("panelsecuredurl"+panelsecuredurl);
       // console.log("panelId"+panelId);

        this.urlList2.push(panelsecuredurl); // Add the value to the list

      }
    }  else {
      console.error('Unable to iterate over responseValue. Invalid data type.');
    }
  }
  getPanelsUrlByTag() {
    this.urlList= [];
   // console.log("panelId"+this.responseValueBytag);

    if (Array.isArray(this.responseValueBytag)) {
      for (const panelId of this.responseValueBytag) {
        //console.log("panelId"+panelId);


        const panelurl = `http://localhost:3000/d-solo/${this.uid}/template?orgId=1&panelId=${panelId}&theme=light&refresh=5s`;
        const panelsecuredurl= this.sanitizer.bypassSecurityTrustResourceUrl(panelurl);
        //console.log("panelsecuredurl"+panelsecuredurl);

        this.urlList.push(panelsecuredurl); // Add the value to the list


      }
    }  else {
      console.error('Unable to iterate over responseValue. Invalid data type.');
    }
    this.initializePanelSizes();

  }


    getPanelsUrl() {

      if (Array.isArray(this.responseValue)) {
        for (const panelId of this.responseValue) {
          const panelurl = `http://localhost:3000/d-solo/${this.uid}/template?orgId=1&panelId=${panelId}&theme=light&refresh=5s`;
          const panelsecuredurl= this.sanitizer.bypassSecurityTrustResourceUrl(panelurl);
         // console.log(panelsecuredurl);
          this.urlList.push(panelsecuredurl);
        }
      }  else {
        console.error('Unable to iterate over responseValue. Invalid data type.');
      }
    }









    sanitizeUrl(url: string): SafeResourceUrl {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }


  goHome(){
    this.router.navigate(['/home']);
    }

  goAlert(){
     // console.log(this.ipAddresses);

      this.router.navigate(['/alert']);

    }
   selectedItem: number = 0; // Default selected item index

  selectItem(index: number): void {
    this.selectedItem = index;
  }
  refreshPage() {
    location.reload();
  }

  addPanel(){
    this.router.navigate(['/addpanelpopup']);

  this.getAllPanelIds();

  }
//edit hnee bch nzid
  getPanelId(url: SafeResourceUrl):string{
   // console.log("dkhal lena");
    const urlParts = url.toString().split('&');

    const panelIdParam = urlParts.find(part => part.startsWith('panelId'));

    if (panelIdParam === undefined) {
      console.log('The panelId parameter was not found in the URL.');
      return "";
    } else {
      const panelId = panelIdParam.split('=')[1];
      //console.log(panelId);
      return (panelId);
    }
  }


  deletePanel(url: SafeResourceUrl) {
    const PanelId = this.getPanelId(url);

    if (PanelId !=="") {
      const dashboardTitle = this.projectName;
      this.http.delete('http://localhost:8080/api/grafana/delete-Panel', {
        params: {
          dashboardTitle,
          PanelId,
        },
      })
        .subscribe((response:any) => {
          this.refreshPage();


          if (response === 200) {
            this.getAllPanelIds();
            this.refreshPage();
          } else {
            // An error occurred while deleting the panel.
            console.log("Error");
          }

        });
    }
  }

  goEditPage(){
    this.router.navigate(['/editdash']);

      }

      editOK = new BehaviorSubject<boolean>(false);





/*
      editPanel(url:SafeResourceUrl){
      const PanelId = this.getPanelId(url);
      this.dataService.setPanelIDtoModify(PanelId);

      this.editOK=true;
      if (this.panelEditComponent) {
        this.panelEditComponent.getPanelExpression();
      } else {
        console.error('panelEditComponent is undefined');
      }
//      this.router.navigate(['/editpanel',{ projectName: this.projectName,PanelId:this.PanelId }]);
    }
    */


    ngAfterViewInit() { 
      this.editOK.subscribe((editOK) => { 
        if (editOK && this.panelEditComponent) 
          {this.panelEditComponent.getPanelExpression(); } }); } 
    
    editPanel(url: SafeResourceUrl) { const PanelId = this.getPanelId(url); this.dataService.setPanelIDtoModify(PanelId); this.editOK.next(true); }



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


    printPage(): void {
  
      window.print();
      
    }
  

  }








