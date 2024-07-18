import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupMetricComponent } from './popupMetric.component';


describe('PopupmMtricComponent', () => {
  let component: PopupMetricComponent;
  let fixture: ComponentFixture<PopupMetricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupMetricComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupMetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
