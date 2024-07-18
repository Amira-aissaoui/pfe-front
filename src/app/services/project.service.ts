import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
export interface TeamRoleDTO{
  projectID:number,
  teamID:number,
  role:string
}
export interface UserDTO{
   id:Number
   firstname:string,
  lastname:string
  email:string
  role:Role;
}

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
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  backendurl='http://localhost:8080';


  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<ProjectDTO[]> {
    return this.http.get<ProjectDTO[]>(this.backendurl+'/api/project/get-all-projects');
  }
  getPublicProjects():Observable<ProjectDTO[]>{
    return this.http.get<ProjectDTO[]>(this.backendurl+`/api/project/public-projects`);
  }
  deleteProject(projectID:Number){
    const url=this.backendurl+`/api/project/${projectID}`;
    return this.http.delete<boolean>(url);

  }


  addUserToProject(projectId:Number,userID:Number,userRole:string):Observable<String>{
    console.log("role"+userRole);
    return this.http.post<any>(this.backendurl+`/api/v1/users/users/${userID}/projects/${projectId}/${userRole}`,null);
    
  }
  updateProject(projectId:Number,project:ProjectDTO |null){
    return this.http.put<string>(this.backendurl+`/api/project/projects/${projectId}`,
    project)
  }
  changeUserRole(userRole:string,projectID:Number,userID:Number){
    return this.http.put<Boolean>(this.backendurl+`/api/v1/users/users/${userID}/projects/${projectID}/${userRole}`,null);
  }
  deleteUserFromProject(userID:Number,projectID:Number){
    return this.http.delete<Boolean>(this.backendurl+`/api/v1/users/users/${userID}/projects/${projectID}`);

  }
  getProjectsTeams(){

  }

  changeTeamRole(newRole:string,projectID:Number,teamID:number){
    return this.http.put<Boolean>(this.backendurl+`/api/project/${projectID}/team/${teamID}/roles/${newRole}`,null);
  }
  addTeamToProject(projectId:Number,teamID:Number,role:string){
    return this.http.post<Boolean>(this.backendurl+`/api/project/projects/${projectId}/teams/${teamID}/${role} `,null);



  }
 

  getTeamRole(projectID: number, teamID: number): Observable<TeamRoleDTO> {
    return this.http.get<TeamRoleDTO>(this.backendurl+`/api/project/${projectID}/team/${teamID}/roles`);
  }

  updateProjectInstances(projectID: Number, field: string, newvalue: string, oldvalue: string) {
    return this.http.put<boolean>(`${this.backendurl}/api/project/${projectID}`, null, {
      params: {
        field: field,  
        newvalue: newvalue,
        oldvalue: oldvalue
      }
    });
  }
  



}
