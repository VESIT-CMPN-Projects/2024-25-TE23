import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProjectRequestsComponent } from './view-project-requests.component';

describe('ViewProjectRequestsComponent', () => {
  let component: ViewProjectRequestsComponent;
  let fixture: ComponentFixture<ViewProjectRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewProjectRequestsComponent]
    });
    fixture = TestBed.createComponent(ViewProjectRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
