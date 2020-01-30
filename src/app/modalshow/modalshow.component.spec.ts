import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalshowComponent } from './modalshow.component';

describe('ModalshowComponent', () => {
  let component: ModalshowComponent;
  let fixture: ComponentFixture<ModalshowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalshowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
