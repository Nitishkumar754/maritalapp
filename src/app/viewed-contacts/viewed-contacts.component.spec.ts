import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewedContactsComponent } from './viewed-contacts.component';

describe('ViewedContactsComponent', () => {
  let component: ViewedContactsComponent;
  let fixture: ComponentFixture<ViewedContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewedContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewedContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
