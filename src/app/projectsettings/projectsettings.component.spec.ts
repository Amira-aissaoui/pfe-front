import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsettingsComponent } from './projectsettings.component';

describe('ProjectsettingsComponent', () => {
  let component: ProjectsettingsComponent;
  let fixture: ComponentFixture<ProjectsettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
