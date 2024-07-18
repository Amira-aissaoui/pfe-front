import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { Location } from '@angular/common';
import {MatChipsModule} from '@angular/material/chips';
import { DataService } from '../services/data-service.service';
import { ProjectDTO } from '../services/project.service';


interface deploymentResponse{
  Deployment:string;
}
interface QueryInfo {
  queryMap: string[];
}

interface AlertEmailInfo{
  alertname:string;
  instance:string;
  receiver:string;
  emails:string;
}




@Component({
  selector: 'app-addalert',
  templateUrl: './addalert.component.html',
  styleUrls: ['./addalert.component.css'],

})
export class AddalertComponent {
  rulename: string="";
  summary: string="";
  severity: string="";
  description: string="";
  email: string="";
  status = true;
  time : string="";
  appType!:string;
  isFirstTime=true;
  isUserManager!:string;
  receiverEmail: string = '';
  receiverEmails: string[] = [];
  dropDownIsOpen:boolean=true;
  onDropdownOpen() {
    if(this.dropDownIsOpen){
      this.getTheQueries();

    }
  }

  addInput() {
    if (this.receiverEmail && this.receiverEmail.trim() !== '') {
      this.receiverEmails.push(this.receiverEmail);
      this.receiverEmail = ''; // Clear the input field after adding
      // Optional: Scroll to the newly added element
      console.log("here3"+this.receiverEmails);


    }
  }

  addToggle()
{
  this.status = !this.status;
}

  handleClose() {
    console.log("Popup closed");
  }




  @Input() showPopup: boolean | undefined;
  @Output() closed = new EventEmitter<boolean>();
  constructor(private dataService:DataService,private location: Location,private dialog: MatDialog,private router: Router,private http:HttpClient, private activatedRoute: ActivatedRoute) {}
    Status=false;
  AlertMode=false;
  MonitoringMode=false;
  StatusHealthy=false;


  i=0;


  dropdownList: Array<{ item_id: number; item_text: string;}> = [];
  dropdownList2: Array<{ item_id: number; item_text: string; searchFilterText?: string }> = [];
  dropdownList3: Array<{ item_id: number; item_text: string; }> = [];
  dropdownList4: Array<{ item_id: number; item_text: string;  searchFilterText?: string }> = []


  projectName!:string;
  ipAddresses: {ipaddr: string, port: string}[] = [];
  nbms!:Number;
  ipAddressesArray!:string;
  nb!:number;
  dropdownSettings:IDropdownSettings={};
  dropdownSettings2:IDropdownSettings={};
  dropdownSettings4:IDropdownSettings={};

  project!:ProjectDTO;
  ngOnInit() {

    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',      

    };

    this.dropdownSettings2 = {
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: false,
      allowSearchFilter: true,
      singleSelection: true,  // Allow only single selection
      closeDropDownOnSelection: true,  // Close dropdown on selection
  

    };
    this.dropdownSettings4 = {
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: false,
      allowSearchFilter: true,
      singleSelection: true,  // Allow only single selection
      closeDropDownOnSelection: true,  // Close dropdown on selection
  

    };

    this.isUserManager=this.dataService.getUserInfo()?.user.role.toString()|| "";



        this.project=this.dataService.getProject();
        this.projectName=this.project.projectName;
        this.ipAddressesArray=this.project.ipAddresses;
        this.appType=this.project.appType;
        const ipAddresses = this.ipAddressesArray.split(',');
        this.nb=1;


        for (const ipAddress of ipAddresses) {
          this.dropdownList.push({
            item_id: this.nb,
            item_text: ipAddress,
          });
          this.nb+=1;
        }
     


    }



  uid: string='';
  dashboardTitle:string="projet3";
  panelIds: string[] = [];
  showInfoMenu:boolean=false;
  showRuleInfoMenu:boolean=false;
  instance2='localhost:4200';
  instancesSelected!:string[];
  selectedInstances: any[] = [];
  metricsSelected!:string[];
  selectedMetrics!: any[];
  isTeamsExist=false;
  selectedTeam!:string;

  onInstanceSelect() {
    //console.log("this.selectedInstances", this.selectedInstances);
    this.instancesSelected = this.selectedInstances.map(item => item.item_text);
    console.log("this.instancesSelected", this.instancesSelected);

  
  }

  
  onInstanceDeSelect() {
    console.log("this.selectedInstances", this.selectedInstances);
    this.instancesSelected = this.instancesSelected.filter(
      instance => this.selectedInstances.some(item => item.item_text === instance)
    );
    console.log("this.instancesSelected", this.instancesSelected);
    this.isTeamsExist=false;
  }
  

onInstanceSelectAll() {
  console.log("All instances selected", this.dropdownList.map(item => item.item_text));
  this.instancesSelected = this.dropdownList.map(item => item.item_text);
  console.log("this.instancesSelected", this.instancesSelected);

}
onInstanceDeSelectAll() {
  this.instancesSelected = [];
  console.log("this.instancesDeSelected", this.instancesSelected);
}
query: Map<string, string> = new Map();

onMetricSelect() {
  this.metricsSelected = this.selectedMetrics.map(item => this.query.get(item.item_text))
    .filter(value => value !== undefined) as string[];
  console.log("metricsSelected:", this.metricsSelected);
  

  
}

onMetricDeSelect() {
  this.metricsSelected = this.metricsSelected.filter(
    metric => this.selectedMetrics.some(item => this.query.get(item.item_text) === metric)
  );
 
  

  console.log("this.metricsSelected", this.metricsSelected);
}


getTheQueries() {
  console.log("clicked");
  const url = 'http://localhost:8080/api/prometheus/query/instance_metrics';
  this.http.get<QueryInfo>(url, { params: { instances: this.instancesSelected } })
  .subscribe(
    (response) => {
      const queryKeys = Object.keys(response.queryMap) as string[];
      this.query = new Map(Object.entries(response.queryMap));
    //  console.log("query keys:", Array.from(this.query.keys()));
  //    console.log("query values:", Array.from(this.query.values()));
//      console.log("ouwah: " + this.query.get("prometheus tsdb blocks loaded"));
        const newQueryKey = "up"; // Add the "up" query key
                
        // Set the value for the "up" query key
        this.query.set(newQueryKey, "up");

        // Add the new query key to the array of query keys
        queryKeys.push(newQueryKey);


      this.dropdownList2 = queryKeys.map((queryKey, index) => ({
        item_id: index + 1,
        item_text: queryKey,
      }));
     
      this.dropDownIsOpen = false;
    },
    (error) => {
      console.error('An error occurred:', error);
    }
  );

  this.dropDownIsOpen = false;
}




  openPopup(){
    this.showPopup=!this.showPopup;
    this.router.navigate(['/addalert']);
  }



    goHome(){
      this.router.navigate(['/home']);  }
      goDashboard(){
        this.router.navigate(['/dashboard']);  }

      selectedItem: number = 1; // Default selected item index

      selectItem(index: number): void {
        this.selectedItem = index;
      }
      openInfo(){
        console.log("opened");
        this.showInfoMenu=!this.showInfoMenu;

      }
      openRuleInfo(){
        console.log("opened");
        this.showRuleInfoMenu=!this.showRuleInfoMenu;

      }
      inf=false;
      sup=false;
      equal=false;

    getComparaison():string{
      if(this.inf){
        return "inf";

      }
      if(this.sup){
        return "sup";


      }
      if(this.equal){
        return "equal";


      }
      return "";

    }
    infValue(){
      this.inf=true;
    }
    supValue(){
      this.sup=true;
    }
    equalValue(){
      this.equal=true;
    }

  ruleName!: string;
  selectedSeverity!: string[];
  timeRange!: string;
  teamName!: string;
  value!:string;
  comparaison!:string;
  getQueries(){
    let instance = this.selectedInstances;
    console.log
    //this.http.get()
  }
  isExistingTeamSelected=false;
  finalTeamName!:string;
  finalEmails!:string[];
  ExistingTeamSelected(){
    this.isExistingTeamSelected=!this.isExistingTeamSelected;
  }
  save() {
    this.comparaison=this.getComparaison();

    if (
      !this.ruleName ||
      !this.instancesSelected ||
      !this.metricsSelected ||
      !this.selectedSeverity ||
      !this.comparaison ||
      !this.value ||
      !this.timeRange ||
      !this.summary ||
      !(this.teamName || this.selectedTeam) ||
      !this.receiverEmails ||
      !this.description
    ) {
      const toast = document.getElementById("toast-message")!;
      toast.innerHTML = "Please fill in all required fields!";
      toast.classList.add("toast-failed");
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
      }, 3000);
      return;
    }
    
    const url='http://localhost:8080/api/prometheus/rulefile/add-rule'
 

    const ruleData = {
      alertname:this.ruleName,
      instance:this.instancesSelected,
      metric: this.metricsSelected,
      severity: this.selectedSeverity,
      comparaison: this.comparaison,
      value: this.value,
      time: this.timeRange,
      summary:this.summary,
      description:this.description,

    };
    

    const toast2 = document.getElementById("toast2-message")!;
 
    
        this.http.post(url,null,{params:ruleData})
          .subscribe((response) => {
            console.log("ok");

            toast2.innerHTML = "Rule Added !";
            toast2.classList.add("toast2-success");
            toast2.classList.add("show");
            setTimeout(() => {
              toast2.classList.remove("show");
            }, 3000);
        
         
          },
          (error: any) => {
            console.log('Error:', error);
            toast2.innerHTML = "Error Configuring the Mail Settings for the Alert!";
            toast2.classList.add("toast2-failed");
            console.error('An error occurred while deleting the rule:', error);
    
          });


          setTimeout(() => {
            toast2.classList.remove("show");
          }, 3000);

          if(this.selectedTeam != null){
            this.finalTeamName=this.selectedTeam;
            this.addAlertToTeam();            
          }
           else{
          this.finalTeamName=this.teamName;
          this.addAlert();
         }  
        this.showDialog = true;

 

      }

      
      //fiha rectification fl parse f partie receiverEmail
      addAlertToTeam(){



        const toast = document.getElementById("toast-message")!;

    
      
      const url='http://localhost:8080/api/alertmanager/add-team';
      console.log("alerte"+this.receiverEmails);

      console.log("alerte"+this.ruleName);

      // Perform further operations with the values...
      const alertData = {
        alertname:this.ruleName,
        receivername: this.finalTeamName,
        instance:this.instancesSelected,

      };
      this.http.post<boolean>(url,null,{params:alertData}).subscribe((response) => {
          //    console.log("response"+response);
          toast.innerHTML = "Alert Notification Configured!";
          toast.classList.add("toast-success");
          toast.classList.add("show");
          setTimeout(() => {
            toast.classList.remove("show");

          }, 5000);
      
  

            },
            (error: any) => {
              console.log('Error:', error);
              toast.innerHTML = "Error Configuring the Mail Settings for the Alert!";
              toast.classList.add("toast-failed");
              console.error('An error occurred while deleting the rule:', error);
      
            });

            setTimeout(() => {
              document.getElementById("toast-message")!.classList.remove("show");
            }, 3000);
        

      }

    addAlert(){
    const toast = document.getElementById("toast-message")!;
  
      
      const url='http://localhost:8080/api/alertmanager/add-route';
      console.log("alerte"+this.receiverEmails);

      console.log("alerte"+this.ruleName);

      // Perform further operations with the values...
      const alertData = {
        alertname:this.ruleName,
        receivername: this.finalTeamName,
        instance:this.instancesSelected,
        receiverEmails: this.receiverEmails,

      };
      this.http.post<boolean>(url,null,{params:alertData}).subscribe((response) => {
          //    console.log("response"+response);
          toast.innerHTML = "Alert Notification Configured!";
          toast.classList.add("toast-success");
          toast.classList.add("show");
          setTimeout(() => {
            toast.classList.remove("show");

          }, 5000);
      
  

            },
            (error: any) => {
              console.log('Error:', error);
              toast.innerHTML = "Error Configuring the Mail Settings for the Alert!";
              toast.classList.add("toast-failed");
              console.error('An error occurred while deleting the rule:', error);
      
            });

            setTimeout(() => {
              document.getElementById("toast-message")!.classList.remove("show");
            }, 3000);
        


    }

    goAlert(){
      console.log(this.ipAddresses);
   
      this.router.navigate(['/alert',{ projectName: this.projectName,
        ipAddressesArray : this.ipAddressesArray ,
        nbms:this.nbms,
        appType:this.appType,
      }]);
    
   }

   AlertEmailInstances: AlertEmailInfo[] = [];
   AllInstancesInformation: AlertEmailInfo[][] = [];
   Teams: string[] = [];
   mail!:string;
   ExistingTeamMails!:string[];
   getTeams() {
    this.Teams=[];
    
     const instance = this.instancesSelected;
    // console.log("seleted items"+this.instancesSelected[0]);
     const url = 'http://localhost:8080/api/alertmanager/get-instance-alert-details';
   
     this.http.get<AlertEmailInfo[]>(url, { params: { instance: instance } })
       .subscribe(
         (response: AlertEmailInfo[]) => {
           this.AlertEmailInstances = response;
           console.log("instance: " + response);
           console.log("this.AlertEmailInstances: ", this.AlertEmailInstances);
           for (var i = 0; i < this.AlertEmailInstances.length; i++) {
            if(!this.Teams.includes(this.AlertEmailInstances[i].receiver)){
              this.Teams.push(this.AlertEmailInstances[i].receiver);

            }
           }
   
          
          console.log("Teams: ", this.Teams);
           console.log("Teams: mail ", this.dropdownList4);
           this.isTeamsExist=true;
           console.log("OK");
         },
         (error: any) => {
           console.error('Failed to retrieve alerts and emails:', error);
         }
       );
   }
   showDialog: boolean = false;
   openDialog(): void {
    this.showDialog = true;

    this.dialog.open(Dialog);
  }


  closeDialog() {
    this.showDialog = false;
    this.goAlert();

  }
  setAnotherRule(){
    this.showDialog = !this.showDialog;
  this.refreshPage();
  }
  refreshPage() {

    location.reload();
  }
  
  
  }