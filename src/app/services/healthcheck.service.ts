import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthcheckService {
  backendurl='http://localhost:8080';

  private prometheusUrl = this.backendurl+'/api/app/healthcheck/prometheus_health';
  private grafanaUrl = this.backendurl+'/api/app/healthcheck/grafana_health';
  private alertmanagerUrl = this.backendurl+'/api/app/healthcheck/alertmanager_health';
  private restartPrometheusUrl = this.backendurl+'/api/app/healthcheck/restart_prometheus';
  private restartAlertManagerUrl = this.backendurl+'/api/app/healthcheck/restart_alertmanager';
  private restartAlertManagerContainerUrl = this.backendurl+'/api/app/healthcheck/restart_alertmanager_container';
  private restartPrometheuscontaineUrl = this.backendurl+'/api/app/healthcheck/restart_prometheus_container';

  constructor(private http: HttpClient) {}

  public checkPrometheusHealth(): Observable<boolean> {
    console.log('OK');
    return this.http.get<boolean>(this.prometheusUrl);
  }

  public checkGrafanaHealth(): Observable<boolean> {
    console.log('OK');
    return this.http.get<boolean>(this.grafanaUrl);
  }

  public checkAlertmanagerHealth(): Observable<boolean> {
    console.log('OK');
    return this.http.get<boolean>(this.alertmanagerUrl);
  }

  public restartPrometheus(): Observable<boolean> {
    return this.http.get<boolean>(this.restartPrometheusUrl);
  }

  public restartAlertManager(): Observable<boolean> {
    return this.http.get<boolean>(this.restartAlertManagerUrl);
  }

  public restartAlertManagerContainer(): Observable<boolean> {
    return this.http.get<boolean>(this.restartAlertManagerContainerUrl);
  }

  
  public restartPrometheusContainer(): Observable<boolean> {
    return this.http.get<boolean>(this.restartPrometheuscontaineUrl);
  }



  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<string>(this.backendurl+'/api/v1/auth', { refreshToken });
  }
}
