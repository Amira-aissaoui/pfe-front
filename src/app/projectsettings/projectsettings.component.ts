import { Component, OnInit } from '@angular/core';
import { AfterViewInit} from '@angular/core';
import { DroppedItemsService } from '../services/droppeditems.service';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs';
import { timer } from 'rxjs';
import { interval } from 'rxjs';
import { HealthcheckService } from '../services/healthcheck.service';
import { DataService } from '../services/data-service.service';
import { ProjectDTO } from '../services/project.service';
import { UserinfoService } from '../services/userinfo.service';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { ProjectService } from '../services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-projectsettings',
  templateUrl: './projectsettings.component.html',
  styleUrls: ['./projectsettings.component.css']
})
export class ProjectsettingsComponent implements OnInit{
  projectName!:string;
  ipAddresses!:string;
  nbms!:Number;
  appType!:string;
  deployment!:string;
  ipAddressesArray!:string;
  msnom!:string;
  isAlerting=false;
  microservicesnames!:string[];
  status=true;
  extractedIpAddr!:string[];
  projectID:Number=0;
  ngOnInit(): void {
 
  
    const project:ProjectDTO=this.dataService.getProject();
 
    this.projectName=project.projectName;
    this.projectID=project.id;
 
    this.ipAddressesArray=project.ipAddresses;
 
    this.appType=project.appType;
 
    this.nbms=this.ipAddressesArray.split(',').length;
    this.isAlerting=project.alerting;
    this.microservicesnames=project.msnames.split(",");
    
    this.deployment=project.deployment;
 
    this.msnom=project.msnames;
    this.extractedIpAddr=this.ipAddressesArray.split(",");
    console.log("ipaddr"+this.extractedIpAddr);
  }
  constructor(private location: Location,private snackBar: MatSnackBar	,
    private droppedItemsService: DroppedItemsService,
    private dataService:DataService,
    private router: Router,private http:HttpClient,private sanitizer: DomSanitizer,private healthCheckService: HealthcheckService,
    private userInfoService:UserinfoService,
    private dialog: MatDialog,
    private projectService:ProjectService

    ) { }

    goHome(){
      this.router.navigate(['/home']);
      }
     
   addToggle(){
  this.status = !this.status;
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
    selectedItem: number = 0; // Default selected item index

    selectItem(index: number): void {
     this.selectedItem = index;
   }

  goRules(){
    this.router.navigate(['/rules']);
  }
 
  goAlert(){
    // console.log(this.ipAddresses);

     this.router.navigate(['/alert']);

  }
  i=0;
  showMsIP=false;
  indicems=0;
  newmsname="";
  newmsipaddr=""
  showIP(i:number){
    this.indicems=i;

    console.log("nb"+i),
    this.showMsIP= !this.showMsIP;
  }
  showDialog: boolean = false;
  openDialog(): void {
   this.showDialog = true;
   const dialogConfig = new MatDialogConfig();
  dialogConfig.hasBackdrop = false;
  
  this.dialog.open(Dialog, dialogConfig);

 }


 closeDialog() {
   this.showDialog = false;

 }
 oldipaddr="";
 oldmsname="";
 storeinfotomodify(ipaddr:string,index:number){
  this.oldipaddr=ipaddr;
  this.oldmsname=this.microservicesnames[index];

 }
 newmonolithicip="";
 storeMonolithicInfo(ipaddr:string){
  this.oldipaddr=ipaddr;

 }
 editInstance(){

  if(this.newmsipaddr!="" && this.newmsname!="" ){
  
    this.projectService.updateProjectInstances(this.projectID,"msnames",this.newmsname,this.oldmsname).subscribe(
      (response) => {
        if(response){
          console.log('Project Microservice Name Updated Successfully:', response);
          this.snackBar.open("Project Microservice Name Updated Successfully", "Hide", {
            duration: 2000,
          });

        }
        else{
          this.snackBar.open("Failed to Update Project", "Hide", {
            duration: 2000,
          });
    
          console.error('Failed to Update Project:');

        }
        timer(5000)

        this.projectService.updateProjectInstances(this.projectID,"ipAddresses",this.newmsipaddr,this.oldipaddr).subscribe(
          (response) => {
            if(response){
              console.log('Project IP Addr Updated Successfully:', response);
              this.snackBar.open("Project IP Address Updated Successfully", "Hide", {
                duration: 2000,
              });
              this.router.navigate(['/home']);

            }
            else{
              this.showDialog=false;
              this.snackBar.open("Failed to Update Project", "Hide", {
                duration: 2000,
              });
              console.error('Failed to Update Project');
    
            }
      
    
          },
          (error) => {
            this.showDialog=false;
            this.snackBar.open("Failed to Update Project", "Hide", {
              duration: 2000,
            });
            this.showDialog=false;

            console.error('Failed to Update Project:', error);
          }
        );
    
    

      },
      (error) => {
        this.showDialog=false;

        console.error('Failed to add user to team:', error);
      }
    );
  }

  
  if(this.newmsipaddr!=""){
    this.projectService.updateProjectInstances(this.projectID,"ipAddresses",this.newmsipaddr,this.oldipaddr).subscribe(
      (response) => {
        if(response){
          console.log('Project IP Addr Updated Successfully:', response);
          this.snackBar.open("Project IP Address Updated Successfully", "Hide", {
            duration: 2000,
          });
        }
        else{
          this.snackBar.open("Failed to Update Project", "Hide", {
            duration: 2000,
          });
          this.showDialog=false;

          console.error('Failed to Update Project:');

        }
  

      },
      (error) => {
        this.snackBar.open("Failed to Update Project", "Hide", {
          duration: 2000,
        });
        this.showDialog=false;

        console.error('Failed to Update Project:', error);
        // Handle the error as needed
      }
    );
  }
  timer(5000)

  if(this.newmsname!=""){
    this.projectService.updateProjectInstances(this.projectID,"msnames",this.newmsname,this.oldmsname).subscribe(
      (response) => {
        if(response){
          console.log('Project Microservice Name Updated Successfully:', response);
          this.snackBar.open("Project Microservice Name Updated Successfully", "Hide", {
            duration: 2000,
          });

        }
        else{
          this.snackBar.open("Failed to Update Project", "Hide", {
            duration: 2000,
          });
          this.showDialog=false;

          console.error('Failed to Update Project:');

        }
  

      },
      (error) => {
        this.snackBar.open("Failed to Update Project", "Hide", {
          duration: 2000,
        });
        this.showDialog=false;

        console.error('Failed to add user to team:', error);
        // Handle the error as needed
      }
    );
     //this.closeDialog();


  }


 }

}

