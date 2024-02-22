import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageChatModalComponent } from './image-chat-modal.component';

describe('ImageChatModalComponent', () => {
  let component: ImageChatModalComponent;
  let fixture: ComponentFixture<ImageChatModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageChatModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageChatModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
