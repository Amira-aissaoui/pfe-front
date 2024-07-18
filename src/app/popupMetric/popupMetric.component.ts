import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../services/data-service.service';
import { PrometheusService } from '../services/prometheus.service';
import { Router } from "@angular/router";

interface Metric {
  name: string;
  instance?: string;
  exists: boolean;
}

interface DeploymentResponse {
  Deployment: string;
  status: string;
}
@Component({
  selector: 'app-popup-metric',
  templateUrl: './popupMetric.component.html',
  styleUrls: ['./popupMetric.component.css']
})
export class PopupMetricComponent implements OnInit {
  @Input() showPopup: boolean | undefined;
  @Output() closed = new EventEmitter<boolean>();
  metrics: Metric[] = [];

  userID: number = 0;
  inputs: any[] = [{ ipaddr: '', port: '' }];
  StatusHealthy = false;
  whereDeployed: string = '';
  metric: string ='';
  panelName: string = '';
  metricName: string = '';
  instance: string = '';
  isMetricAvailable: boolean = false;
  
  
  isLoading: boolean = false; // Flag to show loading indicator
  error: string | undefined;




  constructor(
    private router: Router,
    private http: HttpClient,
    private dataService: DataService,
    private prometheusService: PrometheusService
  ) { }



  ngOnInit(): void {
    const userInfo = this.dataService.getUserInfo();
    if (userInfo && userInfo.user && userInfo.user.id) {
      this.userID = userInfo.user.id as number;
    }
  }
  closeModal() {
    console.log("Close button clicked");
    this.router.navigate(['/draft']);
  }
 
  addInput() {
    const lastInput = this.inputs[this.inputs.length - 1];
    const newInput = {
      ipaddr: '',
      port: ''
    };
    Object.assign(newInput, lastInput);
    this.inputs.push({ ...newInput });
    this.StatusHealthy = false;
  }
  removeInput(input: any, i: number) {
    const index = this.inputs.indexOf(input);
    this.inputs.splice(index, 1);
  }


  checkMetric() {
    this.isLoading = true;
    this.error = undefined;
    this.isMetricAvailable = false;

    this.prometheusService.checkMetricInstance(this.metricName, this.instance)
      .subscribe(exists => {
        this.metrics.push({ name: this.metricName, instance: this.instance, exists });
        this.isLoading = false;
        this.isMetricAvailable = exists;
        this.StatusHealthy = true;
      }, error => {
        this.isLoading = false;
        this.error = `Error checking metric: ${error.message || 'Unknown error'}`;
      }
    
    );
  }

  clearMetrics() {
    if (this.metrics = []) {
      this.router.navigate(['/draft']);
    }
     
  }


  chooseChart() {
    alert(`You selected a chart for metric: ${this.metricName}${this.instance ? ' (' + this.instance + ')' : ''}`);

  }

  checkMetricc() {

    this.router.navigate(['/draft']);
  }


  //no need
  checkDeployment(ipaddr: string, port: string) {
    const url = `http://localhost:8080/api/prometheus/query/check_deployment?ip=${ipaddr}&port=${port}`;
    this.http.get<DeploymentResponse>(url).subscribe((response) => {
      this.whereDeployed = response.Deployment;
      console.log("Deployment:", this.whereDeployed);
    });
  }


  
}



















