import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProjectDTO } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class StateServiceService {
  private projectKey = 'project';
  project: BehaviorSubject<ProjectDTO | null> = new BehaviorSubject<ProjectDTO | null>(null);

  constructor() {
    // Retrieve project from localStorage on initialization
    const storedProject = localStorage.getItem(this.projectKey);
    if (storedProject) {
      this.project.next(JSON.parse(storedProject));
    }
  }

  setProject(project: ProjectDTO) {
    localStorage.setItem(this.projectKey, JSON.stringify(project));
    this.project.next(project);
    console.log(project);
  }

  getProject() {
    return this.project.value;
  }
  
}
