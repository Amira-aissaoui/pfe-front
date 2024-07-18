import { Dialog } from "@angular/cdk/dialog";
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";

import { timer } from 'rxjs';
import { DataService } from "../services/data-service.service";
import { HealthcheckService } from '../services/healthcheck.service';
import { UserinfoService } from "../services/userinfo.service";


@Component({
  selector: 'app-homePage',
  templateUrl:'./homePage.component.html',
  styleUrls: ['./homePage.component.css']
})

export class HomePageComponent implements OnInit {

status = true;
userRole: string = '';
numberAlertManagerdown=0;
nbprojet=0;
nbPublicProject=0;
numberPrometheusdown=0;
numberGrafanadown=0;
nbServersup=0;
isUserAdmin:string="";


  constructor(
    private router: Router,
    private healthCheckService: HealthcheckService,
    private userinfoservice: UserinfoService,
    private dataService: DataService,
    private dialog: MatDialog,
  ) { }
ngOnInit(): void {
  console.log("email"+this.dataService.getLoginEmail());
  this.getUserRole();
  this.userRole = this.dataService.getUserRole();
  timer(7000);
  this.status = true;

}
getUserRole() {
  this.userRole = this.dataService.getUserRole();

}


goAdminsitration(){
  this.router.navigate(['/administration']);
}

//lezem rectification f nb.project
  logout(){
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
  




goProfile(){
  this.router.navigate(['/profile']);

}

  showDialog: boolean = false;
  openDialog(): void {
    this.showDialog = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = false;

    this.dialog.open(Dialog, dialogConfig);

  }
  connectToProjects(){
    this.router.navigate(['/home']);
  }

  closeDialog() {
    this.showDialog = false;

  }

addToggle()
{
  this.status = !this.status;
}


  
}





