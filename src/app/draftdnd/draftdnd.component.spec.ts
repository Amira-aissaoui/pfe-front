import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftdndComponent } from './draftdnd.component';

describe('DraftdndComponent', () => {
  let component: DraftdndComponent;
  let fixture: ComponentFixture<DraftdndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DraftdndComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraftdndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
