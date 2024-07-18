import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupformComponent } from './popupform.component';

describe('PopupformComponent', () => {
  let component: PopupformComponent;
  let fixture: ComponentFixture<PopupformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
