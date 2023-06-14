import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastTrainingComponent } from './past-training.component';

describe('PastTrainingComponent', () => {
  let component: PastTrainingComponent;
  let fixture: ComponentFixture<PastTrainingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PastTrainingComponent]
    });
    fixture = TestBed.createComponent(PastTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
