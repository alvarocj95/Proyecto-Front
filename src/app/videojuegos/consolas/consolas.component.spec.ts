import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolasComponent } from './consolas.component';

describe('ConsolasComponent', () => {
  let component: ConsolasComponent;
  let fixture: ComponentFixture<ConsolasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsolasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsolasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
