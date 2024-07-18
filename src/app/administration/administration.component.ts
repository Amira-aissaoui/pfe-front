import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { interval } from 'rxjs';
import { HealthcheckService } from '../services/healthcheck.service';
import { timer } from 'rxjs';
import { UserinfoService } from '../services/userinfo.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent {



  showPopup = false;
status = true;
nbprojet=0;
numberPrometheusdown=0;
numberGrafanadown=0;
numberAlertManagerdown=0;
isManageTeam:boolean=false;
isManageProject:boolean=false;
isTeamMemberSelected=false;
isProjectSelected=false;
constructor(private router: Router,private healthCheckService: HealthcheckService,private userinfoservice:UserinfoService) { }

ngOnInit(): void {


}

addToggle()
{
  this.status = !this.status;
}

  handleClose() {
    console.log("Popup closed");
  }
  goManageProject(){

  }
  goManageTeam(){
    
  }
  teamMemberSelected(){
    this.isTeamMemberSelected=!this.isTeamMemberSelected;
  }
  projectSelected(){
    this.isProjectSelected=!this.isProjectSelected;
  }
  manageProject(){
    this.isManageProject=!this.isManageProject;
  }
  goHome(){
    this.router.navigate(['/home']);  }
  goProjects(){
      this.router.navigate(['/manageprojects']);  
  }
  goUsers(){
    this.router.navigate(['/users']);  
}
goTeams(){
  this.router.navigate(['/manageteams']);  
}
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


  }
