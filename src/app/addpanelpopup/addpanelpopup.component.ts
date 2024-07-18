import { OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError, timer } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { DataService } from '../services/data-service.service';
import { DroppedItemsService } from '../services/droppeditems.service';

import { forkJoin } from 'rxjs';
import { ProjectDTO } from '../services/project.service';

interface Droppedchart {
  positionX: number;
  positionY: number;
  chart:String;

} 
interface MsDroppedColumns {
  id: number;
  column: string;
  title: string;
  metric: string;
}

interface DashboardUidResponse {
  uid: string;
}
interface QueryInfo {
  queryMap: { [queryName: string]: string };
}

interface CategorizedQueries {
  [category: string]: string[];
}

@Component({
  selector: 'app-addpanelpopup',
  templateUrl: './addpanelpopup.component.html',
  styleUrls: ['./addpanelpopup.component.css']
})

export class AddpanelpopupComponent implements OnInit{
  port="";

   
  ngOnInit(){

    const project:ProjectDTO=this.dataService.getProject();

    this.projectName=project.projectName;
 
    this.ipAddressesArray=project.ipAddresses;
 
    this.appType=project.appType;
 
    this.nbms=this.ipAddressesArray.split(',').length;
    this.alertMode=project.alerting;
 
    this.deployment=project.deployment;
  
    this.items = Array(this.nbms).fill(0);
  
          var menuItems = document.querySelectorAll('.site-nav > ul > li');
          for (var i = 0; i < menuItems.length; i++) {
            var menuItem = menuItems[i];
            var subMenu = menuItem.querySelector('.sub-menu');
            if (subMenu) {
              menuItem.addEventListener('click', function(event) {
                event.preventDefault();
                if(subMenu!=null){
                  subMenu.classList.toggle('show');

                }
              });
                      }
     this.ipAddressAndPort = this.extractIpAddressAndPort(this.ipAddressesArray);


        this.extractedIpAddr=this.extractIpAddressAndPort2(this.ipAddressesArray);
        this.port=this.ipAddressAndPort[0].ip;            


          this.taille=this.extractedIpAddr.length;

          const itemsSize=Number(this.taille);
          this.nbmicroservices=Number(this.taille)-2;
          this.items = Array(itemsSize).fill(0);
        }   
}
  
  newProject!:ProjectDTO;

  isInfraSubMenuOpen:boolean=false;
  isClusterHealth:boolean=false;
  isDeployment:boolean=false;
  isNode:boolean=false;
  isPods:boolean=false;
  isContainer:boolean=false;
  isJobs:boolean=false;
  isAppSubMenuOpen:boolean=false;
  isDBSubMenuOpen:boolean=false;
  isServerSubMenuOpen:boolean=false;
  isContainerSubMenuOpen:boolean=false;
  isVMSubMenu:boolean=false;
  alertMode:boolean=false;
  isActive: boolean = false;
  chartMenu:boolean=false;
  nbmicroservices!:number;
  parcoursms:number=0;
  showSaveButton:boolean=false;
  isJVMSubMenuOpen:boolean=false;
  isBasicSubMenuOpen = false;
  isAdvancedSubMenuOpen = false;
  isAppResourcesSubMenuOpen = false;
  isJVMetricsSubMenuOpen = false;
  isAdvancedMetric=false;
  isCustomizedMetrics=false;


resetSubMenus(){
this.isCustomizedMetrics=false;
this.isBasicSubMenuOpen=false;
this.isVMSubMenu=false;
this.isAppSubMenuOpen=false;
this.isDBSubMenuOpen=false;
this.isServerSubMenuOpen=false;
this.isJVMSubMenuOpen=false;
this.isAdvancedSubMenuOpen=false;
this.isAdvancedAppSubMenuOpen=false;
this.isVMSubMenu=false;
this.isInfraSubMenuOpen=false;
this.isClusterHealth=false;
this.isDeployment=false;
this.isNode=false;
this.isPods=false;
this.isContainer=false;
this.isJobs=false;
}



  CustomQueries!: string[];
  index=0;
  getTheQueries(index:number) {
    console.log("ipAddressesArray"+this.extractedIpAddr[index]);
    console.log("l index"+index);
    const url = 'http://localhost:8080/api/prometheus/query/instance_metrics';
    this.http.get<QueryInfo>(url, { params: { instances: this.extractedIpAddr[index] } }).subscribe(
      (response) => {
        this.CustomQueries = Object.keys(response.queryMap);
        this.categorizedQueries = this.categorizeQueries();
        this.categorizedQueriesKeys = Object.keys(this.categorizedQueries);
        console.log("Categorized Queries:", this.categorizedQueries);
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }
  
  
  categories: string[] = [
    'Process',
    'Network',
    'CPU',
    'Memory',
    'Disk',
    'Database',
    'Application',
    'Server',
    'Security',
    'Storage',
    'Services',
    'VM',
    'Error',
    'Logs',
    'Backup',
    'Custom',
    'API Gateway',
    'Load Balancer',
    'Security Audit',
    'Database Replication',
    'File System',
    'Cache',
    'CDN Cache',
    'Virtualization',
    'Identity and Access Management',
    'Middleware',
    'Cluster Overview',
    'Nodes',
    'Pods',
    'Deployments',
    'Services',
    'Ingress',
    'Configurations',
    'Events',
    'Autoscaling',
    'Monitoring and Logging',
    'Frequency',
    'Aggregate'
  ];
  
  categorizedQueries: { [key: string]: string[] } = {};
  categorizedQueriesKeys: string[] = [];
  

  categorizeQueries() {
    this.categorizedQueries = {};
    for (const category of this.categories) {
      this.categorizedQueries[category] = [];
    }
  
    for (const query of this.CustomQueries) {
      let matchedCategory = 'Custom'; // Default category for unmatched queries
  
      if (query.includes('network') || query.includes('Network') || query.includes('net') || query.includes('http')) {
        matchedCategory = 'Network';
      } else if (query.includes('cpu') || query.includes('CPU')) {
        matchedCategory = 'CPU';
      } else if (query.includes('memory') || query.includes('Memory')) {
        matchedCategory = 'Memory';
      } else if (query.includes('disk') || query.includes('Disk')) {
        matchedCategory = 'Disk';
      } else if (query.includes('database') || query.includes('Database')) {
        matchedCategory = 'Database';
      } else if (query.includes('App') || query.includes('app') || query.includes('application') || query.includes('Application')) {
        matchedCategory = 'Application';
      } else if (query.includes('server') || query.includes('Server')) {
        matchedCategory = 'Server';
      } else if (query.includes('security') || query.includes('Security')) {
        matchedCategory = 'Security';
      } else if (query.includes('storage') || query.includes('Storage')) {
        matchedCategory = 'Storage';
      } else if (query.includes('services') || query.includes('Services')) {
        matchedCategory = 'Services';
      } else if (query.includes('Vm') || query.includes('VM') || query.includes('vm')) {
        matchedCategory = 'VM';
      } else if (query.includes('process') || query.includes('Process')) {
        matchedCategory = 'Process';
      } else if (query.includes('Error') || query.includes('error')) {
        matchedCategory = 'Error';
      } else if (query.includes('Logs') || query.includes('logs') || query.includes('Log') || query.includes('log')) {
        matchedCategory = 'Logs';
      } else if (query.includes('Backup') || query.includes('backup')) {
        matchedCategory = 'Backup';
      } else if (query.includes('API Gateway') || query.includes('api gateway')) {
        matchedCategory = 'API Gateway';
      } else if (query.includes('Load Balancer') || query.includes('load balancer')) {
        matchedCategory = 'Load Balancer';
      } else if (query.includes('Security Audit') || query.includes('security audit')) {
        matchedCategory = 'Security Audit';
      } else if (query.includes('Database Replication') || query.includes('database replication')) {
        matchedCategory = 'Database Replication';
      } else if (query.includes('File System') || query.includes('file system')) {
        matchedCategory = 'File System';
      } else if (query.includes('Cache') || query.includes('cache')) {
        matchedCategory = 'Cache';
      } else if (query.includes('CDN Cache') || query.includes('cdn cache')) {
        matchedCategory = 'CDN Cache';
      } else if (query.includes('Virtualization') || query.includes('virtualization')) {
        matchedCategory = 'Virtualization';
      } else if (query.includes('Identity and Access Management') || query.includes('identity and access management')) {
        matchedCategory = 'Identity and Access Management';
      } else if (query.includes('Middleware') || query.includes('middleware')) {
        matchedCategory = 'Middleware';
      }
      else if (query.includes('Count') || query.includes('count')) {
        matchedCategory = 'Frequency';
      }
      else if (query.includes('Total') || query.includes('total')) {
        matchedCategory = 'Aggregate';
      }
  
      this.categorizedQueries[matchedCategory].push(query);
    }
  
    // Sort the queries within each category
    for (const category of this.categories) {
      this.categorizedQueries[category].sort();
    }
  
    // Separate VM and Cluster categories
   /* const vmCategory = 'VM';
    const clusterCategory = 'Cluster';
    const vmQueries = this.categorizedQueries[vmCategory];
    const clusterQueries = this.categorizedQueries[clusterCategory];
  
    // Remove VM and Cluster categories from the main categorizedQueries
    delete this.categorizedQueries[vmCategory];
    delete this.categorizedQueries[clusterCategory];
  
    // Add VM and Cluster categories with their queries separately
    this.categorizedQueries[vmCategory] = vmQueries;
    this.categorizedQueries[clusterCategory] = clusterQueries;
  
    // Get the keys of the categorizedQueries object
    this.categorizedQueriesKeys = Object.keys(this.categorizedQueries);
  
    return this.categorizedQueries;*/
      // Remove empty categories
      this.categorizedQueriesKeys = Object.keys(this.categorizedQueries).filter(
        category => this.categorizedQueries[category].length > 0
      );
    
      // Check if all categories are empty
      const allCategoriesEmpty = this.categorizedQueriesKeys.length === 0;
    
      // If all categories are empty, reset the categorizedQueries and categorizedQueriesKeys
      if (allCategoriesEmpty) {
        this.categorizedQueries = {};
        this.categorizedQueriesKeys = [];
      }
    
      return this.categorizedQueries;
  }
  
  
      showCustomizedMetrics(){
  this.isCustomizedMetrics=!this.isCustomizedMetrics;
  }

  showBasicSubMenu() {
    this.isBasicSubMenuOpen = !this.isBasicSubMenuOpen;
  }

  showAdvancedSubMenu() {
    this.isAdvancedSubMenuOpen = !this.isAdvancedSubMenuOpen;
  }

  showVMSubMenu(){
    this.isVMSubMenu=!this.isVMSubMenu;
  }
  advancedMetricSelected(){
    this.isAdvancedMetric=!this.isAdvancedMetric;
  }
  
  //c:number=1;
  test=1;

  microservices: any[] = [
    { id: 1, name: 'Microservice 1', droppedItems: [] },
    { id: 2, name: 'Microservice 2', droppedItems: [] },
    { id: 3, name: 'Microservice 3', droppedItems: [] },
  ];
  


  ismicroserviceselected: boolean=false;

  isMsActive=true;
  initialColumns = [
    { dragStart: 'ondragstart($event)' },
    { dragStart: 'ondragstart($event)' },
    { dragStart: 'ondragstart($event)' },
    { dragStart: 'ondragstart($event)' },
    { dragStart: 'ondragstart($event)' },
    { dragStart: 'ondragstart($event)' },
    { dragStart: 'ondragstart($event)' },
  ];

  
  isMicroService(index: number) {
    if(index==this.test){
       this.ismicroserviceselected=true;
    }
    this.test++;
    
  }  
  columns = [
    { dragStart: 'ondragstart($event)' },
    { dragStart: 'ondragstart($event)' },
  

  ];    
  
  MsColumns:MsDroppedColumns[]=[];
  AdvancedMsColumns:MsDroppedColumns[]=[];

 setMsColumns() {
  console.log("here");
  let i;

  console.log(this.MsColumns);
}
  nextMicroserviceBtn() {
      this.parcoursms++;
      this.chartMenu = false;
      if (this.nbmicroservices + 1 == this.parcoursms) {
        this.port=this.ipAddressAndPort[this.nbmicroservices].ip;            

        this.showSaveButton = true;
      }
      this.columns = [
        { dragStart: 'ondragstart($event)' },
        { dragStart: 'ondragstart($event)' },
        { dragStart: 'ondragstart($event)' },
        { dragStart: 'ondragstart($event)' },
        { dragStart: 'ondragstart($event)' },
        { dragStart: 'ondragstart($event)' },
        { dragStart: 'ondragstart($event)' },
      ];
    }
    columns2!:{dragStart:string}[];
    saveTheMicDash() {
      console.log("parcours"+this.nbmicroservices+1);
  
      this.chartMenu = false;
      if (this.nbmicroservices + 1 == this.parcoursms) {
        this.showSaveButton = true;
      }
    
      if(this.parcoursms==1){
        this.columns2 = this.columns.slice();
        console.log(this.columns2);
        console.log("lena fl 1")
        this.columns = [
          { dragStart: 'ondragstart($event)' },
          { dragStart: 'ondragstart($event)' },
          { dragStart: 'ondragstart($event)' },
          { dragStart: 'ondragstart($event)' },
          { dragStart: 'ondragstart($event)' },
          { dragStart: 'ondragstart($event)' },
          { dragStart: 'ondragstart($event)' },
        ];
      }
      if(this.parcoursms==1){
        this.columns = this.columns2;
      }
    
      this.columns = [
        { dragStart: 'ondragstart($event)' },
        { dragStart: 'ondragstart($event)' },
        { dragStart: 'ondragstart($event)' },
        { dragStart: 'ondragstart($event)' },
        { dragStart: 'ondragstart($event)' },
        { dragStart: 'ondragstart($event)' },
        { dragStart: 'ondragstart($event)' },
      ];
         
         
      
        
          
        }
    
 
    nbms!:number;
    appType!:string;
    deployment!:string;
    ipAddressAndPort!:{ ip: string; port: string; }[];
    ipAddressesArray!:string;

  toggleBasicSubMenu() {
    this.isBasicSubMenuOpen = !this.isBasicSubMenuOpen;
  }

  toggleAdvancedSubMenu() {
    this.isAdvancedSubMenuOpen = !this.isAdvancedSubMenuOpen;
  }

 
  
  // Function to toggle the "Advanced" submenu
  toggleAdvancedSubMenu2() {
    this.isAdvancedSubMenuOpen = !this.isAdvancedSubMenuOpen;
  }
  
 
  extractedIpAddr!:string[];
   taille!:Number;
  items = Array();
project!:ProjectDTO;
getProjectInfo(){

  this.http.get<ProjectDTO>(`http://localhost:8080/api/project/getprojectbyname`, {
    params: {
      projectname: this.projectName
    }
  }).subscribe(
    response => {
      this.project=response;
      this.dataService.setProject(response);
    },
    error => {
      console.log(error);
    }
  );

}

 extractIpAddressAndPort(ipAddressesArray:string) {
  const ipAddresses = ipAddressesArray.split(',');
  const ipAddressAndPort = [];

  for (const ipAddress of ipAddresses) {
    const [ip, port] = ipAddress.split(':');
    ipAddressAndPort.push({
      ip: ip,
      port: port,
    });
  }

  return ipAddressAndPort;
}
extractIpAddressAndPort2(ipAddressesArray:string) {
  const ipAddresses = ipAddressesArray.split(',');
  return ipAddresses;
}



  submitBtn(){
    const btn = document.querySelector("#btn");
    const btnText = document.querySelector("#btnText");
    if(btn!=null && btnText!=null){
      
        btnText.innerHTML = "Saved";
        btn.classList.add("active");
   
    }
   this.saveData();
  }






  showInfraSubMenu() {
    this.isInfraSubMenuOpen = !this.isInfraSubMenuOpen;
  }
  showClusterSubMenu() {
    this.isClusterHealth = !this.isClusterHealth;
  }
  showDeploymentSubMenu() {
    this.isDeployment = !this.isDeployment;
  }
  showNodeSubMenu() {
    this.isNode = !this.isNode;
  }
  showPodSubMenu() {
    this.isPods = !this.isPods;
  }
  showContainersSubMenu() {
    this.isContainer = !this.isContainer;
  }
  showJobsSubMenu() {
    this.isJobs = !this.isJobs;
  }
  
  isAdvancedAppSubMenuOpen=false;
  
  showAppSubMenu() {
    this.isAdvancedSubMenuOpen = false; 

    this.isAppSubMenuOpen = !this.isAppSubMenuOpen;
  }

  showAdvancedAppSubMenu() {

    this.isAdvancedAppSubMenuOpen = !this.isAdvancedAppSubMenuOpen;
  }
   showDBSubMenu() {
    this.isDBSubMenuOpen = !this.isDBSubMenuOpen;
  }
  showServerSubMenu() {
    this.isServerSubMenuOpen = !this.isServerSubMenuOpen;
  }
  showContainerSubMenu() {
    this.isContainerSubMenuOpen = !this.isContainerSubMenuOpen;
  }
  showJVMSubMenu() {
    this.isJVMSubMenuOpen = !this.isJVMSubMenuOpen;
  }
  ElementSelected(){
    this.isActive=true;
  }


  showChartMenu(){
  this.chartMenu=true;
  }



  // traitement l drag and drop 



  droppedItems: Droppedchart[] = [];
  draggedItem: any;
  showSidebar = false;
  showText = true;
  dashboardUrl: string=""; // Define the dashboardUrl property
  uid: string='';
  projectName:string="";
  //ipAddressesArray: {ipaddr: string, port: string}[] = [];
  selectedMetric:string[]=[];
  i=0;
  j=2;


  constructor(
    private router: Router,private activatedRoute: ActivatedRoute,
    private droppedItemsService: DroppedItemsService,private http:HttpClient,private sanitizer: DomSanitizer,private dataService: DataService
  ) { }


  onDragStart(event: any) {
    this.draggedItem = event.target;
    event.dataTransfer.setData('text/plain', this.draggedItem.innerHTML);
    event.dataTransfer.dropEffect = 'move';
  }

  onDragOver(event: any) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    console.log("dragging");
  }
  

  onDrop(event: any) {
    let i: number = 1;
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const target = event.target;
    if (target && target.classList.contains('dropbox')) {
      target.appendChild(this.draggedItem);
      event.target.classList.add("dropped");
  
      const chart = this.draggedItem.querySelector('h2').textContent;
      //correspondence in terms of index for the chart
      const chartGrafana = this.getTheNewChart(chart);
  
      if (this.metricselected.length > 0 && this.metricselected[0].title !== "") {
        const selectedMetricTitle = this.metricselected[0].title;
        const selectedMetric = this.metricselected[0].metric;
        console.log(this.MsColumns);
        this.MsColumns.push({
          id: this.parcoursms + 1,
          column: chartGrafana,
          title: selectedMetricTitle,
          metric: selectedMetric
        });
      }
  
      if (this.advancedMetricselected.length > 0 && this.advancedMetricselected[0].title !== "") {
        const selectedMetricTitle = this.advancedMetricselected[0].title;
        const selectedMetric = this.advancedMetricselected[0].metric;
        console.log(this.AdvancedMsColumns);
        this.AdvancedMsColumns.push({
          id: this.parcoursms + 1,
          column: chartGrafana,
          title: selectedMetricTitle,
          metric: selectedMetric
        });
      }
    }
  
    console.log("this.MsColumns", this.MsColumns);
    console.log("this.AdvancedMsColumns", this.AdvancedMsColumns);
    this.showSidebar = false;
    this.chartMenu = false;
  }
      goHome(){
      this.router.navigate(['/home']);
    }
  

  showRecentDroppedItems(parcoursms: number) {  
    const currentMicroservice = this.microservices.find(ms => ms.id === this.parcoursms+1);
    const recentDroppedItems = currentMicroservice.droppedItems;
    console.log('recentDroppedItems'+recentDroppedItems);
  }
 chosenMicroserviceId = 1;
 c=0;

extractPanelId(url: string): string {
const regex = /panelId=(\d+)/;
const match = url.match(regex);
return match ? match[1] : '';
  }

saving=false;
saveData() {
  const dashboardTitle = this.projectName;
  const columns = this.MsColumns;
  const advancedColumns = this.AdvancedMsColumns;
  this.dataService.setAdvancedMetrics(this.AdvancedMsColumns);
  console.log("hereee" + columns);

  if (columns && columns.length > 0) {
    console.log("lena" + columns[0].id);
    console.log("type" + this.appType);
    console.log("comparaison" + this.appType.includes("Monolithic app"));
    const ipAddressesArray2 = this.ipAddressesArray[0];

    if (this.appType.includes("Monolithic app")) {
      const panelRequests = columns.map((column, index) => {
        console.log(`id: ${column.id}, column: ${column.column}, title: ${column.title}, metric: ${column.metric}`);
        const PanelTitle = column.title;
        const target = column.metric;
        const panelChart = column.column.toString();
        const ip = this.ipAddressAndPort[0].ip;
        const port = this.ipAddressAndPort[0].port;
        const tag = column.id;

        return timer(index * 100).pipe(
          concatMap(() => this.http.post('http://localhost:8080/api/grafana/panel', null, { params: { dashboardTitle, PanelTitle, target, panelChart, ip, port, tag } })),
          catchError((error) => {
            console.error('Error adding panel:', error);
            return throwError(error);
          })
        );
      });

      forkJoin(panelRequests).subscribe(
        () => {
          console.log('All panels added successfully.');

          timer(2000).subscribe(() => {
            //console.log("fl save" + this.ipAddressesArray);
            //console.log("advancedColumns" + advancedColumns);

            if (advancedColumns && advancedColumns.length > 0) {
              console.log("hereee");
              this.router.navigate(['/advancedsettings']);
            } else {
              if (this.alertMode == true) {
                this.router.navigate(['/addalert']);
              } else {
                this.router.navigate(['/dashboard']);
              }
            }
          });
        },
        (error) => {
          console.error('Error adding panels:', error);
          // Handle the error if necessary
        }
      );
    } else {
      const panelRequests = columns.map((column, index) => {
        console.log(`id: ${column.id}, column: ${column.column}, title: ${column.title}, metric: ${column.metric}`);
        const PanelTitle = column.title;
        const target = column.metric;
        const panelChart = column.column.toString();
        const ip = this.ipAddressAndPort[column.id-1].ip;
        const port = this.ipAddressAndPort[column.id-1].port;
        const tag = column.id;

        return timer(index * 100).pipe(
          concatMap(() => this.http.post('http://localhost:8080/api/grafana/panel', null, { params: { dashboardTitle, PanelTitle, target, panelChart, ip, port, tag } })),
          catchError((error) => {
            console.error('Error adding panel:', error);
            return throwError(error);
          })
        );
      });

      forkJoin(panelRequests).subscribe(
        () => {
          console.log('All panels added successfully.');

          if (advancedColumns && advancedColumns.length > 0) {
            this.router.navigate(['/advancedsettings']);
          } else {
            if (this.alertMode == true) {
              this.router.navigate(['/addalert']);
            } else {
              timer(2000).subscribe(() => {
                this.router.navigate(['/dashboard']);
              });
            }
          }
        },
        (error) => {
          console.error('Error adding panels:', error);
          // Handle the error if necessary
        }
      );
    }
  } else {
    if (advancedColumns && advancedColumns.length > 0) {
      this.router.navigate(['/advancedsettings']);
    }
  }

}

 // this.dataService.setProject();

getIpAddress(){
  const ipAddressesArray=this.ipAddressesArray[0];
  console.log(ipAddressesArray);
}

  

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }
  CloseSideMenu(){
    this.i++;
    if(this.i==1){
      this.showSidebar=false;
      this.i=0;
    }
  }



metricselected!:{ title: string; metric: string; }[];
advancedMetricselected!:{ title: string; metric: string; }[];


getSelectedMetric(metric:string,title:string,isAdvanced:boolean){

  this.metricselected = [];
  this.advancedMetricselected = [];

  if(isAdvanced){

    this.advancedMetricselected.push({title:title,metric:metric})
    console.log("this.metricselected"+this.advancedMetricselected[0].title);
    console.log("this.metricselected"+this.advancedMetricselected[0].metric);
  

  }
  else{
    this.metricselected.push({title:title,metric:metric})
    console.log("this.metricselected"+this.metricselected[0].title);
  
     console.log("LENAAAAAA"+this.metricselected[0].title);
  

  }
  return this.metricselected;

}





getTheNewChart(chart:string){

  if(chart==="Pie Chart"){
    return "piechart";


  }
  if(chart==="Gauge Chart"){

    return "gauge";

  }
  if(chart==="Line Chart"){

    return "timeseries";


  }
  
  if(chart==="Stat Chart"){
    return "stat";


  }
  if(chart==="Bar Chart"){
    return "bargauge";

  }
  if(chart==="XY Chart"){
    return "xychart";

  }
  if(chart==="Horizontal Chart"){
    return "state-timeline";

  }
 
return "";
}



saleData = [
{ name: "CPU", value: 105000 },
{ name: "Memory", value: 55000 },
{ name: "Swap", value: 15000 },
{ name: "Disk", value: 150000 },
];

lineData=[
{
"name": "CPU",
"series": [
  {
    "value": 6774,
    "name": "2016-09-23T11:57:02.465Z"
  },
  {
    "value": 3054,
    "name": "2016-09-22T00:20:58.585Z"
  },
  {
    "value": 6336,
    "name": "2016-09-20T11:28:25.409Z"
  },
  {
    "value": 5081,
    "name": "2016-09-18T13:42:49.371Z"
  },
  {
    "value": 4907,
    "name": "2016-09-19T12:26:54.914Z"
  }
]
},
{
"name": "Memory",
"series": [
  {
    "value": 6745,
    "name": "2016-09-23T11:57:02.465Z"
  },
  {
    "value": 2038,
    "name": "2016-09-22T00:20:58.585Z"
  },
  {
    "value": 3117,
    "name": "2016-09-20T11:28:25.409Z"
  },
  {
    "value": 2585,
    "name": "2016-09-18T13:42:49.371Z"
  },
  {
    "value": 4971,
    "name": "2016-09-19T12:26:54.914Z"
  }
]
},
{
"name": "Swap",
"series": [
  {
    "value": 3455,
    "name": "2016-09-23T11:57:02.465Z"
  },
  {
    "value": 6441,
    "name": "2016-09-22T00:20:58.585Z"
  },
  {
    "value": 2376,
    "name": "2016-09-20T11:28:25.409Z"
  },
  {
    "value": 3668,
    "name": "2016-09-18T13:42:49.371Z"
  },
  {
    "value": 5016,
    "name": "2016-09-19T12:26:54.914Z"
  }
]
},
{
"name": "Disk Usage",
"series": [
  {
    "value": 6514,
    "name": "2016-09-23T11:57:02.465Z"
  },
  {
    "value": 3833,
    "name": "2016-09-22T00:20:58.585Z"
  },
  {
    "value": 2890,
    "name": "2016-09-20T11:28:25.409Z"
  },
  {
    "value": 6121,
    "name": "2016-09-18T13:42:49.371Z"
  },
  {
    "value": 2474,
    "name": "2016-09-19T12:26:54.914Z"
  }
]
},

]
bubledata=[
{
  "name": "",
  "series": [
    {
      "name": "2010",
      "x": "2010",
      "y": 80.3,
      "r": 80.4
    },
    {
      "name": "2000",
      "x": "2000",
      "y": 80.3,
      "r": 78
    },
    {
      "name": "1990",
      "x": "1990",
      "y": 75.4,
      "r": 79
    }
  ]
},
{
  "name": "",
  "series": [
    {
      "name": "2010",
      "x": "2020",
      "y": 15.8,
      "r": 310
    },
    {
      "name": "2000",
      "x": "2000",
      "y": 76.9,
      "r": 283
    },
    {
      "name": "1990",
      "x": "1990",
      "y": 75.4,
      "r": 253
    }
  ]
},
{
  "name": "",
  "series": [
    {
      "name": "2010",
      "x": "2010",
      "y": 10.4,
      "r": 63
    },
    {
      "name": "2000",
      "x": "2000",
      "y": 10.1,
      "r": 59.4
    },
    {
      "name": "1990",
      "x": "1990",
      "y": 30.2,
      "r": 56.9
    }
  ]
},
{
  "name": "",
  "series": [
    {
      "name": "2010",
      "x": "2010",
      "y": 40.2,
      "r": 62.7
    },
    {
      "name": "2000",
      "x": "2000",
      "y": 20.8,
      "r": 58.9
    },
    {
      "name": "1990",
      "x": "1990",
      "y": 75.7,
      "r": 57.1
    }
  ]
}
];
heatmapdata=[
{
  "name": "column 1",
  "series": [
    {
      "name": "2010",
      "value": 40632,
      "extra": {
        "code": "de"
      }
    },
    {
      "name": "2000",
      "value": 36953,
      "extra": {
        "code": "de"
      }
    },
    {
      "name": "1990",
      "value": 31476,
      "extra": {
        "code": "de"
      }
    }
  ]
},
{
  "name": "column 2",
  "series": [
    {
      "name": "2010",
      "value": 0,
      "extra": {
        "code": "us"
      }
    },
    {
      "name": "2000",
      "value": 45986,
      "extra": {
        "code": "us"
      }
    },
    {
      "name": "1990",
      "value": 37060,
      "extra": {
        "code": "us"
      }
    }
  ]
},
{
  "name": "column 3",
  "series": [
    {
      "name": "2010",
      "value": 36745,
      "extra": {
        "code": "fr"
      }
    },
    {
      "name": "2000",
      "value": 34774,
      "extra": {
        "code": "fr"
      }
    },
    {
      "name": "1990",
      "value": 29476,
      "extra": {
        "code": "fr"
      }
    }
  ]
},
{
  "name": "column 4",
  "series": [
    {
      "name": "2010",
      "value": 36240,
      "extra": {
        "code": "uk"
      }
    },
    {
      "name": "2000",
      "value": 32543,
      "extra": {
        "code": "uk"
      }
    },
    {
      "name": "1990",
      "value": 26424,
      "extra": {
        "code": "uk"
      }
    }
  ]
}
];


treedata=[
{
  "name": "Germany",
  "value": 40632,
  "extra": {
    "code": "de"
  }
},
{
  "name": "France",
  "value": 36745,
  "extra": {
    "code": "fr"
  }
},
{
  "name": "United Kingdom",
  "value": 36240,
  "extra": {
    "code": "uk"
  }
},
{
  "name": "Spain",
  "value": 33000,
  "extra": {
    "code": "es"
  }
},
{
  "name": "Italy",
  "value": 35800,
  "extra": {
    "code": "it"
  }
},
{
  "name": "Spain",
  "value": 36620
}
]
value: number = 50;
previousValue: number = 70;
units: string = 'Alerts';

horizdata=[
{
  "name": "Swap",
  "series": [
    {
      "name": "2010",
      "value": 40632,
      "extra": {
        "code": "de"
      }
    },
    {
      "name": "2000",
      "value": 36953,
      "extra": {
        "code": "de"
      }
    },
    {
      "name": "1990",
      "value": 31476,
      "extra": {
        "code": "de"
      }
    }
  ]
},
{
  "name": "Disk",
  "series": [
    {
      "name": "2010",
      "value": 0,
      "extra": {
        "code": "us"
      }
    },
    {
      "name": "2000",
      "value": 45986,
      "extra": {
        "code": "us"
      }
    },
    {
      "name": "1990",
      "value": 37060,
      "extra": {
        "code": "us"
      }
    }
  ]
},
{
  "name": "Memory",
  "series": [
    {
      "name": "2010",
      "value": 36745,
      "extra": {
        "code": "fr"
      }
    },
    {
      "name": "2000",
      "value": 34774,
      "extra": {
        "code": "fr"
      }
    },
    {
      "name": "1990",
      "value": 29476,
      "extra": {
        "code": "fr"
      }
    }
  ]
},
{
  "name": "CPU",
  "series": [
    {
      "name": "1990",
      "value": 33216
    },
    {
      "name": "2000",
      "value": 37606
    },
    {
      "name": "2010",
      "value": 17293
    }
  ]
}
]

}
