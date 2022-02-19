import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartLoaderComponent } from './heart-loader.component';

describe('HeartLoaderComponent', () => {
  let component: HeartLoaderComponent;
  let fixture: ComponentFixture<HeartLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeartLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeartLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
