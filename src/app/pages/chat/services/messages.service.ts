import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../../../core/services/http/crud.service';
import { BotMessage } from '../interfaces/bot-message';
import { UserMessage } from '../interfaces/user-message';


@Injectable({
  providedIn: 'root'
})
export class MessagesService extends CrudService {

  endpoint = 'chat/completion';
  private userMessagesKey = 'userMessages';
  private botMessagesKey = 'botMessages';

  messagesListSignal: WritableSignal<any[]> = signal([]);

  constructor(http: HttpClient) {
    super(http);
  }


  sendMessagePost(body: any): Observable<BotMessage> {
    return this.post<any>(body);
  }

  saveLocalMessage(message: UserMessage | BotMessage): void {
    const messages = this.getLocalMessages();
    messages.push(message);
    localStorage.setItem(this.userMessagesKey, JSON.stringify(messages));
  }

  getLocalMessages(): any[] {
    const listLocalMessages = [];
    const userMessages = JSON.parse(localStorage.getItem(this.userMessagesKey) || '[]');
    if(userMessages != null){
      listLocalMessages.push(userMessages);
    }
    ;
    // const botMessages = JSON.parse(localStorage.getItem(this.botMessagesKey) || '[]');
    // listLocalMessages.push(botMessages);
    return listLocalMessages;
  }

  clearLocalMessages(): void {
    localStorage.removeItem(this.userMessagesKey);
    localStorage.removeItem(this.botMessagesKey);
  }

}
