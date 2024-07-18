import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class GrafanaService {
 /* private baseUrl = 'http://localhost:3000';
  private authToken = ''; // Replace with your auth token

  constructor(private http: HttpClient) { }

  getPanel(uid: string, panelId: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${this.authToken}` };

    const url = `${this.baseUrl}/api/dashboards/uid/${uid}/panels/${panelId}`;
    return this.http.get(url, { headers }).pipe(
      map((response: any) => {
        console.log("Got panel:", response);

        return response;
      })
    );
  }*/



  /*  private apiUrl = 'https://localhost:3000/api/dashboards/db/<dashboard-slug>';
    private apiKey = '';

    constructor(private http: HttpClient) { }

    getDashboardData() {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.apiKey}` });
      return this.http.get(this.apiUrl, { headers });
    }*/

 }

