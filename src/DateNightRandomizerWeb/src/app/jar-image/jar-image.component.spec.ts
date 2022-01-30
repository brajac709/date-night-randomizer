import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JarImageComponent } from './jar-image.component';

describe('JarImageComponent', () => {
  let component: JarImageComponent;
  let fixture: ComponentFixture<JarImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JarImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JarImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
