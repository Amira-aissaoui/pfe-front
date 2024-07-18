import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data-service.service';
import { ProjectService } from '../services/project.service';

import { ProjectDTO } from '../services/project.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit{
  constructor(private router: Router,private http:HttpClient,private route : Router,private dataService:DataService,private projetService:ProjectService) { }
  ProjectProv!:ProjectDTO;
  alerting!:boolean;
  monitoring!:boolean;
  projectID!:Number;
  userID: Number = 0;

  ngOnInit(): void {
    this.ProjectProv=this.dataService.getProjProv();
    console.log("proj prov"+this.ProjectProv);
    this.alerting=this.ProjectProv.alerting;
    this.monitoring=this.ProjectProv.monitoring;
    const userInfo = this.dataService.getUserInfo();
    console.log("userInfo"+userInfo);

    if (userInfo && userInfo.user && userInfo.user.id) {
      this.userID = userInfo.user.id;
    }
    this.configServer();
  }


  configServer(){
    const toast = document.getElementById("toast-message")!;
      
    const data = {
      projectName: this.ProjectProv.projectName,
      monitoring: this.ProjectProv.monitoring,
      alerting: this.ProjectProv.alerting,
      appType: this.ProjectProv.appType,
      ipAddresses: this.ProjectProv.ipAddresses ,
      visibility:this.ProjectProv.visibility ,
      deployment:"",
      msnames:this.ProjectProv.msnames,
    };

    this.http.post('http://localhost:8080/api/project/save-doproject', data).subscribe((response :any) => {
      toast.innerHTML = "Project Created !";
      toast.classList.remove("toast-failed");
      toast.classList.add("toast-success")
    console.log("t3ada lenaaa")
      this.projectID = response; 
      this.projetService.addUserToProject(this.projectID, this.userID, "EDITOR").subscribe(
        (response) => {
          console.log("mrigllllllll");
          console.log("t3ada lenaaa")

        },
        (error) => {
          console.error("moch mrigl");
        }
      );

        if(this.monitoring){
          this.router.navigate(['/draft']);

        }

        if(this.alerting && !this.monitoring){
          this.router.navigate(['/addalert',{
          }]);

  }
     this.router.navigate(['/draft']);


      }, error => {
        console.error('Error saving data:', error);
        toast.innerHTML = "Project Creation failed!";
        toast.classList.remove("toast-success");
        toast.classList.add("toast-failed");
      });


  }
}
