import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { DataService } from "./data-service.service";
import { ProjectDTO, UserDTO } from './project.service';
export interface UserRoleDTO{
  roleId:number,
  projectId:number,
  userId:number,
  role:string

}
export interface UpdateProfileRequest{
  credentials:AuthenticationRequest,
  user:User
}
export interface TeamRoleDTO{
  teamName:string,
  projectId:number,
  teamId:number,
  role:teamRole,
  project:ProjectDTO
}
enum teamRole{
  VIEWER,
  EDITOR
}
export interface AuthenticationResponse {
  access_token: string;
  refresh_token: string;
}

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface User{
  firstname:string,
  lastname:string,
  role: string,
  email:string,
  password:string
}export interface UserProjectsDTO {
  user: UserDTO;
  projects: ProjectDTO[];
  userRole: any[];
}



@Injectable({
  providedIn: 'root'
})
export class UserinfoService {
  backendurl='http://localhost:8080';

  constructor(private http: HttpClient,private router: Router,private dataService:DataService) { }
  token!:string;
  userDetails: any[] = [];

  public login(email:string,password:string) {

    

    const request: AuthenticationRequest = {

      email: email,

      password: password

    };

    console.log("request"+request.email);

    console.log("request"+request.password);




    return this.http.post<AuthenticationResponse>(this.backendurl+'/api/v1/auth/authenticate',request)}


  getUserDetails():Observable<UserDTO[]> {
    const url = this.backendurl+'/api/v1/users/users';

  return  this.http.get<UserDTO[]>(url) ;


  }

  isUserManager(id:Number):Observable<boolean> {
    const url = this.backendurl+'/api/v1/users/user/user_role/'+{id};

  return  this.http.get<boolean>(url) ;


  }

  deleteUser(email:string) :Observable<Boolean> {
    const url = this.backendurl+'/api/v1/users/delete_users';

    return this.http.delete<Boolean>(url,{params: {email:email}});


  }

  public updateUser(email: string, updatedUser: User) {
    const url = this.backendurl+'/api/v1/users/update_user?email=' + encodeURIComponent(email);
  return this.http.put<boolean>(url, updatedUser);

  }
  usersList!:User[];

  getUsersList(): Observable<any[]> {
    const url = this.backendurl+'/api/v1/users/users';
    console.log("l url"+url);
    return this.http.get<UserDTO[]>(url);
  }
  getUserInfo(email:string):Observable<UserProjectsDTO>{
    const url=this.backendurl+`/api/v1/users/user/user_info/${email}`;
    return this.http.get<UserProjectsDTO>(url);
  }
  updateProfile(request: UpdateProfileRequest): Observable<boolean> {
    const url = `${this.backendurl}/api/v1/users/update_profile`;
    return this.http.put<boolean>(url, request);
}

  getUserTeamsWithProjects(userID:number):Observable<TeamRoleDTO[]>{
    const url=this.backendurl+`/api/v1/users/${userID}/teams/projects`;
    return this.http.get<TeamRoleDTO[]>(url);
  }




  getUserRoleByProject(projectId:Number,userID:Number):Observable<UserRoleDTO[]>{
    const url=this.backendurl+`/api/projects/${projectId}/users/${userID}/roles`;
    return this.http.get<UserRoleDTO[]>(url);

  }
  logout(){
    const url=this.backendurl+`/api/v1/auth/logout`;
    return this.http.post(url,null);
  }

}
