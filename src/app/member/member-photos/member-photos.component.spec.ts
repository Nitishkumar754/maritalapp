import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPhotosComponent } from './member-photos.component';

describe('MemberPhotosComponent', () => {
  let component: MemberPhotosComponent;
  let fixture: ComponentFixture<MemberPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberPhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
