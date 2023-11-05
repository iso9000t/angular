import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedInformationPageComponent } from './detailed-information-page.component';

describe('DetailedInformationPageComponent', () => {
  let component: DetailedInformationPageComponent;
  let fixture: ComponentFixture<DetailedInformationPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailedInformationPageComponent]
    });
    fixture = TestBed.createComponent(DetailedInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
