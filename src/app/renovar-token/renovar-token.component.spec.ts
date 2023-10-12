import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovarTokenComponent } from './renovar-token.component';

describe('RenovarTokenComponent', () => {
  let component: RenovarTokenComponent;
  let fixture: ComponentFixture<RenovarTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenovarTokenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenovarTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
