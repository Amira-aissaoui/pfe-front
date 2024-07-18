import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
export interface Team {
  teamName:string
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
export class TeaminfoService {
  backendurl='http://localhost:8080';


  constructor(private http: HttpClient,private router: Router) { }
  addTeam(teamName:string) : Observable<number>{
    const data:Team ={
      teamName: teamName
    } 
    const url=this.backendurl+'/api/teams/add_team'

  return this.http.post<number>(url,data);
  }
  teams: TeamDTO[] = [];

  getAllTeams(): Observable<TeamDTO[]> {
    return this.http.get<TeamDTO[]>(this.backendurl+'/api/teams/get_teams');
  }
  
      deleteTeam(teamName: string): Observable<Boolean> {
   
          return this.http.delete<boolean>(this.backendurl+'/api/teams/delete_team', {params:{teamname: teamName}});
      }

      updateTeam(newTeamName: string, teamName: string) {
        const team = {
          teamName: newTeamName
        };
    
       return this.http.put<boolean>(this.backendurl+'/api/teams/update_team?teamname=' + teamName, team);
          
      }
      addUserToTeam(teamId: string, userId: string): Observable<Boolean> {
        return this.http.post<boolean>(this.backendurl+`/api/teams/${teamId}/users/${userId}`, null)
        
      }       

      removeUserFromTeam(teamId: number, userId: number): Observable<Boolean> {
      return  this.http.delete<boolean>(this.backendurl+`/api/teams/${teamId}/users/${userId}`)
        
      }

      getTeamUsers(teamId: number): Observable<UserDTO[]> {
        return this.http.get<UserDTO[]>(this.backendurl+`/api/teams/${teamId}/users`);
      }
      
    
}
