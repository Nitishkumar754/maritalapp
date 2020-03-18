import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentinterestComponent } from './sentinterest.component';

describe('SentinterestComponent', () => {
  let component: SentinterestComponent;
  let fixture: ComponentFixture<SentinterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentinterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentinterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
