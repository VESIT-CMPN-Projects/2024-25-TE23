import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionerSideNavComponent } from './commissioner-side-nav.component';

describe('CommissionerSideNavComponent', () => {
  let component: CommissionerSideNavComponent;
  let fixture: ComponentFixture<CommissionerSideNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommissionerSideNavComponent]
    });
    fixture = TestBed.createComponent(CommissionerSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
