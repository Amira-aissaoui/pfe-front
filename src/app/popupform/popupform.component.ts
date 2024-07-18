import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data-service.service';
import { ProjectService } from '../services/project.service';

import { ProjectDTO } from '../services/project.service';

interface deploymentResponse{
  Deployment:string;
}



@Component({
  selector: 'app-popupform',

  templateUrl: './popupform.component.html',
  styleUrls: ['./popupform.component.css']
})

export class PopupformComponent implements OnInit {

  @Input() showPopup: boolean | undefined;
  @Output() closed = new EventEmitter<boolean>();
  constructor(private router: Router,private http:HttpClient,private route : Router,private dataService:DataService,private projetService:ProjectService) { }
  Status=false;
  AlertMode=false;
  MonitoringMode=false;
  StatusHealthy=false;
  userID: Number = 0;

  ngOnInit(): void {
    const userInfo = this.dataService.getUserInfo();
    if (userInfo && userInfo.user && userInfo.user.id) {
      this.userID = userInfo.user.id;
    }
    console.log("userID"+this.userID);

  }
  

  i=0;
  getInputs() {
    return this.inputs;
  }


  closeModal() {
    console.log("Close button clicked");

    this.closed.emit();
    }
    
    inputs: any[] = [{}];

    addInput() {
      const lastInput = this.inputs[this.inputs.length - 1];
      const newInput = {
        ipaddr: '',
        port: ''
      };
      // copy the values of the last input object into the new input object
      Object.assign(newInput, lastInput);
      this.inputs.push({ ...newInput });
      this.StatusHealthy=false;

    }
    
    microservicename!:string;
    removeInput(input: any,i:number) {
      const index = this.inputs.indexOf(input);
      this.inputs.splice(index, 1);
      this.connectivityStatus.splice(i,1);
      this.connectivityfailed.splice(i,1);

    }
    projectID!:Number;
    /*addUserToProject(){
    this.projetService.addUserToProject(this.projectID,this.userID,"EDITOR");
    
    }*/
    monitoringMode(){
      this.MonitoringMode=true;
      console.log(this.MonitoringMode);
    }
    alertMode(){
      this.AlertMode=true;
      console.log(this.AlertMode);

    }
    deployment!:string;
    connectivityStatus:boolean[]=[false];
    connectivityfailed:boolean[]=[false];
    //aamalt l deployment check lena ama bch tetbadel baed

    testConnectivity(ipaddr: string, port: string,i:number) {
      console.log("hereee");
      console.log("hereee"+ipaddr);

      const toast = document.getElementById("toast-message")!;

      const url = `http://localhost:8080/api/app/healthcheck/health?ipaddr=${ipaddr}&port=${port}`;
      this.http.get<boolean>(url).subscribe(result => {
        if (result) {
          toast.innerHTML = "Connectivity test successful!";
          toast.classList.remove("toast-failed");
          toast.classList.add("toast-success");
          console.log("checked");

          this.StatusHealthy=true;
          this.i=1;
          const index = this.ipAddresses.findIndex((obj) => obj.ipaddr === ipaddr && obj.port === port);
          if (index === -1) {
            this.ipAddresses.push({ ipaddr, port });
          }
          

          console.log("OK");

          this.connectivityStatus[i]=true;
          this.connectivityfailed[i]=false;


        } else {
          toast.innerHTML = "Connectivity test failed!";
          toast.classList.remove("toast-success");
          toast.classList.add("toast-failed");
          this.connectivityfailed[i]=true;
          this.connectivityStatus[i]=false;


        }
        toast.classList.add("show");
    
        setTimeout(() => {
          document.getElementById("toast-message")!.classList.remove("show");
        }, 3000);
      });
      toast.innerHTML = "Connectivity test failed!";
      toast.classList.remove("toast-success");
      toast.classList.add("toast-failed");
      setTimeout(() => {
        document.getElementById("toast-message")!.classList.remove("show");
      }, 3000);

    }
    whereDeployed!:string;
    checkDeployment(ipaddr:string,port:string){
      const url = `http://localhost:8080/api/prometheus/query/check_deployment?ip=${ipaddr}&port=${port}`;
      this.http.get<deploymentResponse>(url).subscribe((response)=>{
        this.whereDeployed=response.Deployment;
        
      console.log("depk"+this.whereDeployed);
      });
  

    
  
    }
    lesIPPort!:Array<string>;
    projectName: string="";
    monitoring: boolean=false;
    alerting: boolean=false;
    appType: string="";
    ipAddresses: {ipaddr: string, port: string}[] = [];
    checked = false;
    microserviceNames: string[] = [];
    visibility!:string;
    saveMicroserviceNames(){
      console.log("microserviceNames"+this.microserviceNames);

    }
    onSubmit() {

      console.log("visibility"+this.visibility);
      if (!this.visibility || !this.projectName || !this.appType || !this.ipAddresses || (this.monitoring === false && this.alerting === false || 
        ( (this.appType ==='Microservices Based app') && this.microserviceNames.length !=this.ipAddresses.length) )) {
        const toast = document.getElementById("toast-message")!;
        toast.innerHTML = "Please fill out all fields!";
        toast.classList.remove("toast-success");
        toast.classList.add("toast-failed");
        toast.classList.add("show");
        setTimeout(() => {
          document.getElementById("toast-message")!.classList.remove("show");
        }, 3000);
        return;
      }    
  

      const ipAddresses = this.ipAddresses.map(ip => ip.ipaddr + ':' + ip.port).join(',');
      const ipAddressesArray = ipAddresses.split(',');
      console.log("ipAddressesArray"+ipAddressesArray);
      console.log("ipAddressesArraytype"+typeof(ipAddressesArray));

      console.log("ouwah"+ipAddressesArray[1]);
      console.log("ouwah"+ipAddressesArray[0]);
      console.log("ouwah"+ipAddressesArray[2]);


      const [ip, port] = ipAddressesArray[0].split(':');
  
      console.log(ip,port);
  
      const data :ProjectDTO= {
        projectName: this.projectName,
        monitoring: this.monitoring,
        alerting: this.alerting,
        appType: this.appType,
        ipAddresses: ipAddresses ,
        visibility:this.visibility ,
        deployment:"",
        msnames:this.microserviceNames.toString(),
        id:0,
        uid:"",
        teams:[],
        users:[]
      };
      this.dataService.setProjProv(data);
      
      const toast = document.getElementById("toast-message")!;
      
      console.log(data);
      

    
     //   console.log('Data saved successfully:', response);
        const title=this.projectName;
        const targets="";
        
        console.log("l size lena"+this.ipAddresses.length);
        if(this.MonitoringMode){
          this.http.post('http://localhost:8080/api/grafana/dashboard',null,{params:{title,targets}}).subscribe(()=>
          {   console.log("alert"+this.alerting);
 
          this.router.navigate(["/loading"]);

         /* this.http.post('http://localhost:8080/api/project/save-doproject', data).subscribe((response :any) => {
            toast.innerHTML = "Project Created !";
            toast.classList.remove("toast-failed");
            toast.classList.add("toast-success")

            this.projectID = response; // Assign the response to projectID
            this.projetService.addUserToProject(this.projectID, this.userID, "EDITOR").subscribe(
              (response) => {
                console.log("mrigllllllll");
              },
              (error) => {
                console.error("moch mrigl");
              }
            );
   


        this.router.navigate(['/draft',
        { projectName: this.projectName,
          ipAddressesArray : ipAddressesArray ,
          nbms:ipAddressesArray.length,
          appTyp:this.appType,
          deployment:this.whereDeployed,
          alertMode: this.alerting
        }]);
        
        if(this.alerting && !this.monitoring){
          this.router.navigate(['/addalert',{
            projectName: this.projectName,
            ipAddressesArray : ipAddressesArray ,
            nbms:ipAddressesArray.length,
            appType:this.appType,
          }]);

        }
        

            }, error => {
              console.error('Error saving data:', error);
              toast.innerHTML = "Project Creation failed!";
              toast.classList.remove("toast-success");
              toast.classList.add("toast-failed");
            });


           
*/
          
  
          }
          , (error) => {
            console.error('Error creating dashboard:', error);
            toast.innerHTML = "Project Name Already Exists !";
            toast.classList.remove("toast-success");
            toast.classList.add("toast-failed");
          });
        }
    

    
      toast.classList.add("show");
    
      setTimeout(() => {
        document.getElementById("toast-message")!.classList.remove("show");
      }, 3000);
    }


  }