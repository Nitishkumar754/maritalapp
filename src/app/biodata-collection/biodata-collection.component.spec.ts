import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiodataCollectionComponent } from './biodata-collection.component';

describe('BiodataCollectionComponent', () => {
  let component: BiodataCollectionComponent;
  let fixture: ComponentFixture<BiodataCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiodataCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiodataCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
