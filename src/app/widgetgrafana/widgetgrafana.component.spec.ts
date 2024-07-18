import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetgrafanaComponent } from './widgetgrafana.component';

describe('WidgetgrafanaComponent', () => {
  let component: WidgetgrafanaComponent;
  let fixture: ComponentFixture<WidgetgrafanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetgrafanaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetgrafanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
