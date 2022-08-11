import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotTerminalComponent } from './robot-terminal.component';

describe('RobotTerminalComponent', () => {
  let component: RobotTerminalComponent;
  let fixture: ComponentFixture<RobotTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobotTerminalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RobotTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
