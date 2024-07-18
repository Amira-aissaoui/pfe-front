import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DroppedItemsService } from '../services/droppeditems.service';


interface DashboardUidResponse {
  uid: string;
}

interface PanelIdResponse {
  panelIds: string[];
}

interface DroppedItem {
  positionX: number;
  positionY: number;
  content: any;
}
@Component({
  selector: 'app-editdashboard',
  templateUrl: './editdashboard.component.html',
  styleUrls: ['./editdashboard.component.css']
})
export class EditdashboardComponent {


udroppedItems: DroppedItem[] = [];
uid: string='';
dashboardTitle:string="";
panelIds: string[] = [];
projectName!:string;
ipAddresses: {ipaddr: string, port: string}[] = [];
urlList: SafeResourceUrl[] = [];
showPopup = false;
status = true;
responseValue!: PanelIdResponse;

  constructor(private location: Location,
    private activatedRoute: ActivatedRoute,private droppedItemsService: DroppedItemsService,private router: Router,private http:HttpClient,    private sanitizer: DomSanitizer
    ) { }

  ngOnInit() {
    
    this.activatedRoute.params.subscribe((params) => {
      this.projectName = params['projectName'];
     this.ipAddresses=params['ipAddresses'];
    });
    console.log(this.ipAddresses[0])
    this.getDashboardUidByName();
    this.getAllPanelIds();
 
  }



addToggle()
{
  this.status = !this.status;
}

  handleClose() {
    console.log("Popup closed");
  }


  getDashboardUidByName() {
    const dashboardTitle=this.projectName;
    this.http.post<DashboardUidResponse>('http://localhost:8080/dashboard-uid',null,{params :{
    dashboardTitle
    }})
      .subscribe((response) => {
        this.uid = response.uid;
        console.log(this.uid);
      });
  }

  getAllPanelIds() {

    const params = {
      dashboardTitle: this.projectName
    };
  console.log("params"+params.dashboardTitle);
    this.http.get<PanelIdResponse>('http://localhost:8080/allpanels', { params: params })
      .subscribe(
        (response) => {    
          this.responseValue = response;
          this.getPanelsUrl();

          //console.log(response);
        },
        (error) => {
          console.error('Error fetching panel IDs:', error);
        }
      );
  }  

  getPanelsUrl() {

    if (Array.isArray(this.responseValue)) {
      for (const panelId of this.responseValue) {
        const panelurl = `http://localhost:3000/d-solo/${this.uid}/template?orgId=1&panelId=${panelId}&theme=light&refresh=5s`;
        const panelsecuredurl= this.sanitizer.bypassSecurityTrustResourceUrl(panelurl);
        console.log(panelsecuredurl);
        this.urlList.push(panelsecuredurl); // Add the value to the list
      }
    }  else {
      console.error('Unable to iterate over responseValue. Invalid data type.');
    }
  }
  

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


goHome(){
  this.router.navigate(['/home']);  }
    
goAlert(){

  this.router.navigateByUrl('/alert');
 }
 selectedItem: number = 0; // Default selected item index

 selectItem(index: number): void {
  this.selectedItem = index;
}
refreshPage() {
  location.reload();
}

addPanel(){
  console.log("navigate");
this.router.navigate(['/addpanelpopup',{ projectName: this.projectName,ipAddresses:this.ipAddresses }]);
this.getAllPanelIds();

}

getPanelId(url: SafeResourceUrl):string{

  const urlParts = url.toString().split('&');

  const panelIdParam = urlParts.find(part => part.startsWith('panelId'));
  
  if (panelIdParam === undefined) {
    console.log('The panelId parameter was not found in the URL.');
    return "";
  } else {
    const panelId = panelIdParam.split('=')[1];
    console.log(panelId);
    return (panelId);
  }
}


deletePanel(url: SafeResourceUrl) {
  const PanelId = this.getPanelId(url);

  if (PanelId !=="") {
    const dashboardTitle = this.projectName;
    this.http.delete('http://localhost:8080/delete-Panel', {
      params: {
        dashboardTitle,
        PanelId,
      },
    })
      .subscribe((response:any) => {
        this.refreshPage();


        if (response === 200) {
          // The panel was deleted successfully.
          this.getAllPanelIds();

      this.refreshPage();
        } else {
          // An error occurred while deleting the panel.
          console.log("Error");
        }

      });
  }
}


  

}
