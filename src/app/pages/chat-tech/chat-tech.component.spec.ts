import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatTechComponent } from './chat-tech.component';

describe('ChatTechComponent', () => {
  let component: ChatTechComponent;
  let fixture: ComponentFixture<ChatTechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatTechComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatTechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
