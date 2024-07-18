import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, timer } from 'rxjs';
import { catchError, concatMap, delay } from 'rxjs/operators';
import { DataService } from '../services/data-service.service';
import { ProjectDTO } from '../services/project.service';
interface AlertEmailInfo{
  alertname:string;
  instance:string;
  receiver:string;
  emails:string;
}

@Component({
  selector: 'app-advancedmetricssettings',
  templateUrl: './advancedmetricssettings.component.html',
  styleUrls: ['./advancedmetricssettings.component.css']
})


// mazeli lena les deux functions taa l add panel 
// fl sonar mrigla
// fl cas taa k8s à savoir 
// mazeli bch nzid n3adi l id fl service
export class AdvancedmetricssettingsComponent implements OnInit{


projectName!:string;
ipAddressesArray!: string;
appType!: string;
nbms!: Number;
status = true;
ipAddresses!:string[];
showInfo=true;
i=0;
nbsubmit=0;
  checkSonar=false;
checkK8s=false;
msID!:number[];
advancedMetrics:{id:number, column:string, title: string; metric: string; }[]=[];
idms=0;
selectedms=0;
isSonar=false;
isK8s=false;
alertname!:string;
instance!:string;
emails!:string[];
receiver!:string;
SonarQubeMetric=true;  
K8sMetric=true;  


sonarQubeProjectKey = '';
sonarQubeProjectName = '';
Job='';
Label='';
Container='';
Node='';
Service='';
Pod='';
Namespace='';
dashboardUrl: string="";
uid: string='';
alertMode:boolean=false;
constructor(private router: Router, private http: HttpClient, private activatedRoute: ActivatedRoute,private dataService: DataService) {}
  filteredIPAddresses: string[] = [];

  ngOnInit() {
    this.advancedMetrics = this.dataService.getAdvancedMetrics();
    console.log("this.leeverything"+this.advancedMetrics[0].id);


    const project:ProjectDTO=this.dataService.getProject();

    this.projectName=project.projectName;
 
    this.ipAddressesArray=project.ipAddresses;
 
    this.appType=project.appType;
 
    this.nbms=this.ipAddressesArray.split(',').length;
    this.alertMode=project.alerting;
     this.ipAddresses = this.ipAddressesArray.split(',');
    this.extractedIpaddrPort=this.extractIpAddressAndPort2(this.ipAddressesArray);
    console.log("LENAAAAAAAAA"+this.extractedIpaddrPort);
    this.msID=this.getMsId();

  }
  extractedIpaddrPort!:string[];
  extractIpAddressAndPort2(ipAddressesArray:string) {
    const ipAddresses = ipAddressesArray.split(',');
    return ipAddresses;
  }
  
  getMsId(): number[] {
    const msID: number[] = [];
    for (const metric of this.advancedMetrics) {
      if (!msID.includes(metric.id)) {
        msID.push(metric.id );

      }
    }
    console.log("le msID hereee: " + msID);

    return msID;
  }
  /*getMsId() {
    this.msID = [];
      for (let j = 0; j < this.advancedMetrics.length; j++) {
        console.log("lena"+this.advancedMetrics[j].id);
        if(!this.msID.includes(Number(this.advancedMetrics[j].id -1))){
          this.msID.push(Number(this.advancedMetrics[j].id -1) );

        }
      }
      console.log("this.msID: " + this.msID);
  
      this.filteredIPAddresses = this.ipAddresses.filter((_, index) => {
        console.log("index"+index);
        return this.msID.includes(index);
      });
  
      console.log("this.msID: " + this.filteredIPAddresses);
    
  }*/
  
  showTeamInfo(receiver: number) {
    console.log("receiver"+receiver)
    this.showInfo = true;
    this.i=receiver;
    this.selectedms=receiver;

   this.checkSonarMetric(receiver) ;
    this.checkK8sMetric(receiver);
    console.log("this.isK8s"+this.isK8s);
    console.log("this.isSonar"+this.isSonar);

  }

    //bugg
    checkSonarMetric(indice: number): boolean {
      const sonarMetrics = ['bugs', 'vun', 'smells', 'dup', 'coverage', 'junit'];
      console.log("metrics"+this.advancedMetrics.length);
      console.log("indice"+indice);

      for (let j = 0; j < this.advancedMetrics.length; j++) {
        console.log("f sonar"+this.advancedMetrics[j].id);
        console.log("f sonar2"+this.advancedMetrics[j].metric);

        if (this.advancedMetrics[j].id == indice) {
          console.log("f sonar");
          const hasSonarMetric = sonarMetrics.includes(this.advancedMetrics[j].metric);
          if (hasSonarMetric) {
            this.isSonar = true;
            console.log("this.isSonar"+this.isSonar);
            return true;
          }
        }
      }
    
      this.isSonar = false;
      return false;
    }
    

  checkK8sMetric(indice:number) {
    console.log("dkhal lena");
    const k8sMetrics = [
      "clusterpodusage",
      "clustercpuusage",
      "clustermemoryusage",
      "clusterdiskusage",
      "clusterpodcapacity",
      "clustercpucapacity",
      "clustermemorycapacity",
      "clusterdiskcapacity",
      "replicauptodate",
      "replica",
      "replicaupdated",
      "replicaunavailable",
      "nbnodes",
      "nodesoutofdisk",
      "nodesunavailable",
      "podsrunning",
      "podspending",
      "podsfailed",
      "podsuccess",
      "podsunkown",
      "containerrun",
      "containerwait",
      "containertermn",
      "containerrestart",
      "containercpu",
      "containermemo",
      "jobsuccess",
      "jobsfailed"
    ];
    this.isK8s = false;

    for (let j = 0; j < this.advancedMetrics.length; j++) {
      console.log("hereeeeee" + (this.advancedMetrics[j].id == indice+1));
      if (this.advancedMetrics[j].id == indice) {
        const hasK8sMetric = k8sMetrics.includes(this.advancedMetrics[j].metric);
        if (hasK8sMetric) {
          console.log("f k8s");
          this.isK8s = true;
          return true;
        }
      }
    }
  
    return false;
    }
  

  addToggle()
  {
    this.status = !this.status;
  }
  selectedItem: number = 2; 
  selectItem(index: number): void {
    this.selectedItem = index;
  }
  goHome() {
    this.router.navigate(['/home']);
  }

  goDashboard() {
    this.router.navigate(['/dashboard']);
  }


 

  /*saveChanges(idms:number) {
    const sonarQubeKey = this.sonarQubeProjectKey;
   // const Job = this.Job;
  //  const Label = this.Label;
 //   const Container = this.Container;
  //  const Node = this.Node;
   // const Service = this.Service;
   // const Pod = this.Pod;
 //   const Namespace = this.Namespace;
 const dashboardTitle = this.projectName;
 console.log("dashboardTitle"+dashboardTitle);

 console.log("idms"+idms);
    for(let i=0;i<this.leeverything.length;i++){
      console.log("HEREEEEEee"+this.leeverything[i].id);

      if(this.leeverything[i].id=== idms+1){
        console.log("HEREEEEEee");

        const PanelTitle= this.leeverything[i].title;
        const target= this.leeverything[i].metric;
        const [ip,port]=this.filteredIPAddresses[idms].split(":");
        const tag=idms+1;
        const panelChart=this.leeverything[i].column;
       // const id=this.advancedMetricselected[this.i].id;
    
        const paneldata={
          dashboardTitle :dashboardTitle,
          PanelTitle :PanelTitle,
          target :target,
          panelChart :panelChart,
          //ip :ip,
         // port :port,
          tag :this.idms
    
        }
        console.log("paneldata"+paneldata);
        console.log("paneldata"+paneldata.dashboardTitle);
        console.log("paneldata"+paneldata.PanelTitle);

        console.log("paneldata"+paneldata.target);
        
        if (this.SonarQubeMetric) {
          const sonardata = {
            sonarQubeKey: sonarQubeKey,
          }
         
    
      timer(100)
      .pipe(
        concatMap(() => this.http.post('http://localhost:8080/api/grafana/panel', null, { params: { dashboardTitle, PanelTitle, target, panelChart, ip, port, tag } })),
        catchError((error) => {
          console.error('Error adding panel:', error);
          return throwError(error);
        })
      )
      .subscribe(() => {
        console.log('Panel added successfully.');
      });
        
        }
      }



    }
 
  
   /* if (this.K8sMetric) {
      const k8sdata = {
        Job: Job,
        Label: Label,
        Container: Container,
        Node: Node,
        Service: Service,
        Pod: Pod,
        Namespace: Namespace,
      }
      // this.http.post()
    }*/
   // this.nbsubmit+=1;

 //  this.proceedToNextMicroservice();
  // this.resetInputFields();
  
//}
saveChanges(i:number) {
  const sonarQubeKey = this.sonarQubeProjectKey;
  const dashboardTitle = this.projectName;

  // Filter the elements from leeverything based on the condition
  const panelsToAdd = this.advancedMetrics.filter(panel => panel.id === (i) );
  console.log("paneltoadd"+panelsToAdd);
  of(...panelsToAdd).pipe(
    concatMap(panel => {
      const PanelTitle = panel.title;
      const target = panel.metric;
      const ip =sonarQubeKey;
      const port='none';
      const tag = Number(i); // Use 'id' as the unique identifier for each panel
      const panelChart = panel.column;

      const paneldata = {
        dashboardTitle: dashboardTitle,
        PanelTitle: PanelTitle,
        target: target,
        panelChart: panelChart,
        tag: tag
      };
    //  console.log("hereee"+this.extractedIpaddrPort[i-1]);
      console.log("hereee2"+tag);

      if (this.SonarQubeMetric) {
        const sonardata = {
          sonarQubeKey: sonarQubeKey,
        };
        console.log("ip"+ip+"port"+port);

        return this.http.post('http://localhost:8080/api/grafana/panel', null, { params: { dashboardTitle, PanelTitle, target, panelChart, ip, port, tag } })
          .pipe(
            catchError((error) => {
              console.error('Error adding panel:', error);
              return of(null);
            }),
            delay(500) // Add a delay before the next API call (if needed)
          );
      } else {
        return of(null);
      }
    })
  ).subscribe(result => {
    if (result) {
      console.log('Panel added successfully.');
      
    }
  });
  timer(1000)
  if(this.ipAddresses.length==1){

    if (this.alertMode==true) {

     
      this.router.navigate(['/addalert']);

        } 
        else {
            this.router.navigate(['/dashboard']);
        }

  }
  this.nbsubmit += 1;
  this.resetInputFields();
  this.proceedToNextMicroservice();
}

  
  proceedToNextMicroservice() {

    if(this.nbsubmit==this.msID.length){
      console.log("be3 w rawa7");
      this.showInfo=!this.showInfo;
      
      if (this.alertMode==true) {

     
        this.router.navigate(['/addalert']);

          } 
          else {
              this.router.navigate(['/dashboard']);
          }

    }
    this.i+=1;
    const element = document.getElementById('top-of-page');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

  }
  
  resetInputFields() {
    this.sonarQubeProjectKey = '';
    this.sonarQubeProjectName = '';
    this.Job = '';
    this.Label = '';
    this.Container = '';
    this.Node = '';
    this.Service = '';
    this.Pod = '';
    this.Namespace = '';
  }
  
  

}