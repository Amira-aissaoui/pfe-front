import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjecthomeeditComponent } from './projecthomeedit.component';

describe('ProjecthomeeditComponent', () => {
  let component: ProjecthomeeditComponent;
  let fixture: ComponentFixture<ProjecthomeeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjecthomeeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjecthomeeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
