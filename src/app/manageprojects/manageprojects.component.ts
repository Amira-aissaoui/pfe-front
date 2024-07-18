import { Component } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from "@angular/router";
import { ProjectService } from '../services/project.service';
import { StateServiceService } from '../services/state-service.service';
import { UserinfoService } from '../services/userinfo.service';
import { $localize } from '@angular/localize/init';  // Add this import

import { Injectable, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

export interface ProjectDTO{
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
export interface UserDTO{
   id:Number
   firstname:string,
  lastname:string
  email:string
    role:Role;
}
enum Role{
  VIEWER,
  EDITOR
}

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();
  firstPageLabel = $localize`First page`;
  itemsPerPageLabel = $localize`Items per page:`;
  lastPageLabel = $localize`Last page`;
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return $localize`Page 1 of 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Page ${page + 1} of ${amountPages}`;
  }
  getPageSizeOptions(): number[] {
    return [5, 10, 25, 100]; // Adjust this array based on your requirements
  }
}


@Component({
  selector: 'app-manageprojects',
  templateUrl: './manageprojects.component.html',
  styleUrls: ['./manageprojects.component.css']
})
export class ManageprojectsComponent {


  

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
projects: ProjectDTO[] = [];
dataSource = new MatTableDataSource<ProjectDTO>();
@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
pageSize: number = 5; // Number of items per page
currentPage: number = 0; // Current page index
pagedProjects: ProjectDTO[] = []; // Projects for the current page

constructor(private router: Router,private projectService:ProjectService,private stateService:StateServiceService,private userinfoservice:UserinfoService) { }

ngOnInit(): void {

this.fetchProjects();
}

paginatorPageSizeOptions(): number[] { return [5, 10, 25, 100];  }

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
    this.router.navigate(['/home']);
   }
   editPermission(project:ProjectDTO){
    this.stateService.setProject(project);
    this.router.navigate(['/editpermission']);
    
   }
   



//********
onPageChange(event: PageEvent): void {
  this.currentPage = event.pageIndex;
  this.pageSize = event.pageSize;
  this.updatePagedProjects();
}




searchText: string = '';



fetchProjects(): void {
  this.projectService.getAllProjects()
    .subscribe(
      (projects: ProjectDTO[]) => {
        this.projects = projects;
        this.updatePagedProjects();
      },
      (error) => {
        console.error('Failed to retrieve projects:', error);
      }
    );
}
updatePagedProjects(): void {
  const startIndex = this.currentPage * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.pagedProjects = this.filteredProjects().slice(startIndex, endIndex);
}
filterProjects(): void {
  this.currentPage = 0; // Reset the current page when search text changes
  this.updatePagedProjects();
}
filteredProjects(): ProjectDTO[] {
  if (!this.searchText || this.searchText.trim() === '') {
    return this.projects;
  }
  const searchTextLowerCase = this.searchText.toLowerCase();
  return this.projects.filter(project =>
    project.projectName.toLowerCase().includes(searchTextLowerCase)
  );
}





GeneratteDash(){
  this.router.navigate(['/manageprojectsDash']);

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
