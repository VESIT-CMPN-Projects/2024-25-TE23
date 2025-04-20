import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptSideNavComponent } from './dept-side-nav.component';

describe('DeptSideNavComponent', () => {
  let component: DeptSideNavComponent;
  let fixture: ComponentFixture<DeptSideNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeptSideNavComponent]
    });
    fixture = TestBed.createComponent(DeptSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
