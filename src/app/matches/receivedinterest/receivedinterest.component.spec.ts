import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedinterestComponent } from './receivedinterest.component';

describe('ReceivedinterestComponent', () => {
  let component: ReceivedinterestComponent;
  let fixture: ComponentFixture<ReceivedinterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivedinterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedinterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
