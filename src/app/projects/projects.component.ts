import { Component, Input } from '@angular/core';
import { HomeComponent } from '../home/home.component';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  
 @Input() status = false;

  constructor(private homeComponent: HomeComponent) { }
  
  someFunction() {
    this.homeComponent.addToggle();
    this.status = !this.status;
  } 
}
