import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllOfficersComponent } from './view-all-officers.component';

describe('ViewAllOfficersComponent', () => {
  let component: ViewAllOfficersComponent;
  let fixture: ComponentFixture<ViewAllOfficersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewAllOfficersComponent]
    });
    fixture = TestBed.createComponent(ViewAllOfficersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
