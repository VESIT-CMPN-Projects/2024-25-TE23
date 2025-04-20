import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerSideNavComponent } from './officer-side-nav.component';

describe('OfficerSideNavComponent', () => {
  let component: OfficerSideNavComponent;
  let fixture: ComponentFixture<OfficerSideNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfficerSideNavComponent]
    });
    fixture = TestBed.createComponent(OfficerSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
