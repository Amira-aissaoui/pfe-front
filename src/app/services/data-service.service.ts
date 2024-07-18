import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserProjectsDTO } from './userinfo.service';
import { ProjectDTO } from './project.service';
import { Observable } from 'rxjs';




// Add the DashboardCalendarRequest interface
export interface DashboardCalendarRequest {
  dashboardTitle: string;
  newTitle: string;
  refresh: string;
  date: Date;
}



@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly userInfoKey = 'userInfo';
  private readonly userEmailKey = 'userEmail';
  private readonly projectIDKey = 'projectID';
  private readonly panelIDKey = 'panelID';
  private readonly projectKey='project';
  private readonly userRoleKey='userRoleKey';
  private readonly projectProvKey='projectprov';
  private userInfo: UserProjectsDTO | null = null;
  private userEmail: string | null = null;
  private projectID: Number = 0;
  private panelID: String = "";
  private dashboardTitle: String =""
  private project!: ProjectDTO;
  private userRole!:string;
  private storedProvProject!: ProjectDTO;
  advancedMetricselected: { id: number, column: string, title: string, metric: string }[] = [];
  private image: string ="";


  private apiUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {
    const storedUserInfo = localStorage.getItem(this.userInfoKey);
    if (storedUserInfo) {
     // this.userInfo = JSON.parse(storedUserInfo);
    }

    const storedUserEmail = localStorage.getItem(this.userEmailKey);
    if (storedUserEmail) {
      this.userEmail = storedUserEmail;
    }

    const storedProjectID = localStorage.getItem(this.projectIDKey);
    if (storedProjectID) {
      this.projectID = parseInt(storedProjectID, 10); // Convert to number
    }
    const storedPanelID=localStorage.getItem(this.panelIDKey);

    if(storedPanelID){

      this.panelID=(storedPanelID);

    }

    const storedProject=localStorage.getItem(this.projectKey);

    if(storedProject){

      this.project=JSON.parse(storedProject);

    }
    const storedAdvancedMetrics = localStorage.getItem('advancedMetricselected');
    if (storedAdvancedMetrics) {
      this.advancedMetricselected = JSON.parse(storedAdvancedMetrics);
    }
    const storedUserRole = localStorage.getItem(this.userRoleKey);
    if (storedUserRole) {
      this.userRole = (storedUserRole);
    }
    const storedProvProject=localStorage.getItem(this.projectProvKey);

    if(storedProvProject){

      this.storedProvProject=JSON.parse(storedProvProject);

    }
  }



//------------image
setImage(img: string) {
  this.image = img;
}

getImage(): string {
  return this.image;
}


  setUserInfo(userInfo: UserProjectsDTO) {
    this.userInfo = userInfo;
    localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
  }

  getUserInfo(): UserProjectsDTO | null {
    return this.userInfo;
  }

  setLoginEmail(email: string) {
    this.userEmail = email;
    localStorage.setItem(this.userEmailKey, email);
  }

  getLoginEmail(): string | null {
    return this.userEmail;
  }

  setPanelIDtoModify(id:string){
    this.panelID=id;
    localStorage.setItem(this.panelIDKey, id);



  }

//cal------------------

updateDashboardCalendar(dashboardTitle: string, startDate: string, endDate: string): Observable<any> {
  const body = new HttpParams()
   .set('dashboardTitle', dashboardTitle)
   .set('startDate', startDate)
   .set('endDate', endDate);

  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  return this.http.post('http://localhost:8080/api/grafana/calendar', body.toString(), { headers });
}

//-------------------

//Add this exper-------------------------------



  getPanelExprByPanelId(title: string, panelId: string) {
    return this.http.get(`http://localhost:8080/api/grafana/panelexprbyid?dashboardTitle=${title}&panelId=${panelId}`, { responseType: 'text' });
  }
  


//----------------add here ---------------
/*updateDashboardCalendar(dashboardTitle: string, newTitle: string, refresh: string, startDate: string, endDate: string): any {
  const body = {
    dashboardTitle,
    newTitle,
    refresh,
    startDate,
    endDate
  };

  return this.http.post(`${this.apiUrl}/calendar`, body);
}

*/

  getPanelIDToModify(){

    return this.panelID;

  }





  setProject(project:ProjectDTO){

  this.project=project;

  localStorage.setItem(this.projectKey,JSON.stringify(project));


  }

  getProject(){

    return this.project;

  }
  setAdvancedMetrics(metrics: { id: number, column: string, title: string, metric: string }[]) {
    this.advancedMetricselected = metrics;
    localStorage.setItem('advancedMetricselected', JSON.stringify(metrics));
  }
  getAdvancedMetrics(){
    return this.advancedMetricselected;
  }
  setUserRole(userRole:string){
    this.userRole=userRole;
    localStorage.setItem(this.userRoleKey,userRole);

  }
  getUserRole(){
    return this.userRole;
  }
  setProjProv(project:ProjectDTO){
    this.storedProvProject=project;

    localStorage.setItem(this.projectProvKey,JSON.stringify(project));
  
  }
  getProjProv(){
    return this.storedProvProject;
  }
}
