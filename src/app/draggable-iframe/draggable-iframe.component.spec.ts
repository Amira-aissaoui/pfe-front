import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggableIframeComponent } from './draggable-iframe.component';

describe('DraggableIframeComponent', () => {
  let component: DraggableIframeComponent;
  let fixture: ComponentFixture<DraggableIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DraggableIframeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraggableIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
