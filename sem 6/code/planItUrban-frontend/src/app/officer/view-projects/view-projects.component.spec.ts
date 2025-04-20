import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProjectsComponent } from './view-projects.component';

describe('ViewProjectsComponent', () => {
  let component: ViewProjectsComponent;
  let fixture: ComponentFixture<ViewProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewProjectsComponent]
    });
    fixture = TestBed.createComponent(ViewProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
