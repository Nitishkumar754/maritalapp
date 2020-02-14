import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchedresultComponent } from './searchedresult.component';

describe('SearchedresultComponent', () => {
  let component: SearchedresultComponent;
  let fixture: ComponentFixture<SearchedresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchedresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchedresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
