import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError, timer } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { DroppedItemsService } from '../services/droppeditems.service';


interface DroppedItem {
  content: string;
  positionX: number;
  positionY: number;
  panelId: string;
  chart:String;

} 

interface DashboardUidResponse {
  uid: string;
}

  @Component({
    selector: 'app-draggable-iframe',
    templateUrl: './draggable-iframe.component.html',
    styleUrls: ['./draggable-iframe.component.css']
  })
  export class DraggableIframeComponent {
    
    droppedItems: DroppedItem[] = [];
    draggedItem: any;
    showSidebar = false;
    showText = true;
    dashboardUrl: string=""; // Define the dashboardUrl property
    uid: string='';
    projectName:string="";
    ipAddresses: {ipaddr: string, port: string}[] = [];
    selectedMetric:string[]=[];
    i=0;
    j=2;


    constructor(
      private router: Router,private activatedRoute: ActivatedRoute,
      private droppedItemsService: DroppedItemsService,private http:HttpClient,private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
      this.getDashboardUid();
      console.log(this.projectName);
      this.activatedRoute.params.subscribe((params) => {
        this.projectName = params['projectName'];
        this.ipAddresses = params['ipAddresses'];

      });
      console.log(this.projectName);
    }


    onDragStart(event: any) {
      this.draggedItem = event.target;
      event.dataTransfer.setData('text/plain', this.draggedItem.innerHTML);
      event.dataTransfer.dropEffect = 'move';
    }

    onDragOver(event: any) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }


    onDrop(event: any) {
      event.preventDefault();
      const data = event.dataTransfer.getData('text/plain');
      const target = event.target;
      if (target && target.classList.contains('dropbox')) {
        target.appendChild(this.draggedItem);
        event.target.classList.add("dropped");
    
        const posX = event.clientX - event.target.getBoundingClientRect().left;
        const posY = event.clientY - event.target.getBoundingClientRect().top;
    
        const iframeElement = this.draggedItem.querySelector('iframe');
        if (iframeElement instanceof HTMLIFrameElement) {
          const srcAttribute = iframeElement.getAttribute('src');
          const panelId = this.extractPanelId(srcAttribute || '');
          const chart = iframeElement.getAttribute('class');
    
          console.log(chart);
    
          const droppedItem: DroppedItem = {
            content: srcAttribute ? srcAttribute : '',
            positionX: posX,
            positionY: posY,
            panelId: panelId,
            chart: chart  ? chart : ''
          };
          this.droppedItems.push(droppedItem);
    
          console.log(droppedItem);
          console.log(this.droppedItems);
          this.showSidebar=false;
    
          // Add your logic to handle the dropped item
        }
      }
    }
    
  extractPanelId(url: string): string {
  const regex = /panelId=(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : '';
    }

  saving=false;
    saveData() {
      this.droppedItemsService.setDroppedItems(this.droppedItems);

      const dashboardTitle = this.projectName;
    
      this.droppedItems.forEach((item, index) => {
        console.log(item);
        const PanelTitle = "paneltest"; 
        const target = "1";
        const panelChart = item.chart.toString();
    
        console.log(PanelTitle);
        console.log(target);
        console.log(panelChart);
    
        // Send a POST request to add the panel with a delay
        timer(index * 100) //
          .pipe(
            concatMap(() => this.http.post('http://localhost:8080/panel', null, { params: { dashboardTitle, PanelTitle, target, panelChart } })),
            catchError((error) => {
              // Handle the error here
              console.error('Error adding panel:', error);
              return throwError(error);
            })
          )
          .subscribe(() => {
            console.log('Panel added successfully.');
               
      
          });
      });
      this.saving=true;

      timer(2000) .subscribe(() => {
        this.router.navigate(['/dashboard',{ projectName: this.projectName,ipAddresses:this.ipAddresses }])
  
      }
      )
 
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



    getDashboardUid() {
      this.http.get<DashboardUidResponse>('http://localhost:8080/get-template-uid')
        .subscribe((response) => {
          this.uid = response.uid;
          console.log(this.uid);
        });
    }
   panelId: string = "";
   panelsId=this.getAllPanelIds();
//mazeli bch n'implementi l recuperation taa les ids wl parcours aalihom 
   setPanelUrl(panelId: string): SafeResourceUrl {
    const dashboardUrl = `http://localhost:3000/d-solo/${this.uid}/template?orgId=1&panelId=${panelId}&theme=light`;
  //  console.log(dashboardUrl);
    return this.sanitizer.bypassSecurityTrustResourceUrl(dashboardUrl);
  }

  getAllPanelIds() {
    const url = `http://localhost:8080/template/panels`;
    return this.http.get<string[]>(url);
  }

  metricselected!:string;

  getSelectedMetric(metric:string){
    this.metricselected=metric;
     console.log(this.metricselected);
     console.log(metric);
     this.selectedMetric.push(metric);
     console.log(this.selectedMetric);

  }


      }


    
