import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedWorkspaceComponent } from './selected-workspace.component';

describe('SelectedWorkspaceComponent', () => {
  let component: SelectedWorkspaceComponent;
  let fixture: ComponentFixture<SelectedWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedWorkspaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
