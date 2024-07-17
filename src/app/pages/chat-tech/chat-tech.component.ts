import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { TechModeService } from '../../core/components/navigation/services/tech-mode.service';
import { Subscription } from 'rxjs';
import { MessagesService } from '../chat/services/messages.service';
import { ThemeService } from '../../core/components/navigation/services/theme.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../core/components/snackbar/services/snackbar.service';
import { Router } from '@angular/router';
import { CasosService } from '../cases/services/casos.service';
import { UserMessage } from '../chat/interfaces/user-message';
import { BotMessage } from '../chat/interfaces/bot-message';
import { Caso } from '../cases/interfaces/caso';
import { infoEquipo } from '../chat/interfaces/info-equipo';
import { MaterialModule } from '../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de instalar uuid si no lo tienes instalado

@Component({
  selector: 'app-chat-tech',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './chat-tech.component.html',
  styleUrl: './chat-tech.component.css'
})
export class ChatTechComponent {

  isTechMode = false;
  private techModeSubscription!: Subscription;

  constructor(
    private techModeService: TechModeService,
    private messageService: MessagesService,
    protected themeService: ThemeService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    protected casosService: CasosService,
    private cdr: ChangeDetectorRef
  ){

  }

  alreadyMessage = false;
  fecha = new Date();

  newMessage : UserMessage = {
    conversationId: '123e4567-e89b-12d3-a456-426614174023',
    role: 'user',
    content: '',
  };

  botRespuesta : BotMessage = {
    success: false,
    content: {
      ticket: false,
      content: ""
    },
  };

  casoNuevo : Caso = {
    id: 85849, // number
    subject: "Prueba1", // string
    authorName: "Grajales Echeverri Cristhian Darío", // string
    companyName: "Nova Informàtica Ltda.", // string
    groupName: "Soporte Segundo Nivel", // string
    priorityName: "MEDIUM", // string
    stateName: "Registrado", // string
    registrationDate: "2024-07-04T20:24:32.000Z", // string
    solutionDateExpected: "2024-07-05T15:09:04.000Z" // strin
  }

  infoEquipo : infoEquipo = {
    usuario: {name : 'Andres', code : '1088035677'},
    placa: 0,
    resumen: '',
    ticket: 0,
    detalles: '',
    ubicacion: ''
  }

  listMensajes: any = []
  sharedList: any[] = [];
  imagen: '../../../assets/img/profile.png' | undefined;

  ticket = '';
  resumen = '';

  @ViewChild('messagesContainer') messagesContainer! : ElementRef;
  @ViewChild('scrollContainer') scrollContainer! : ElementRef;


  ngOnInit(): void {
    // this.listMensajes = this.messageService.getLocalMessages();
  }


  getMessageType(message: any): 'user' | 'bot' {
    // Asumiendo que 'success' es una propiedad única de BotMessage
    return message.hasOwnProperty('success') ? 'bot' : 'user';
   }

  sendMessage(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    const input = keyboardEvent.target as HTMLInputElement;
    this.alreadyMessage = true;

    const userMessageToSend: UserMessage = {
      ...this.newMessage,
      content: input.value,
    };

    this.listMensajes.push(userMessageToSend);
    // this.messageService.saveLocalMessage(userMessageToSend);

    // this.sendConfirmationCaseMessage();

    this.messageService.sendMessagePost(userMessageToSend).subscribe((respuesta : BotMessage) => {

      this.listMensajes.push(respuesta)
      // this.messageService.saveLocalMessage(respuesta);

      this.cdr.detectChanges()
      this.scrollToLastMessage();

      // this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    });
    input.value = '';
  }

  scrollToLastMessage() {
    const observer = new MutationObserver((mutations) => {
      if (mutations.length) {
        this.messagesContainer.nativeElement.lastElementChild.scrollIntoView({ behavior: 'smooth' });
        // observer.disconnect(); // Importante desconectar el observer para evitar fuga de memoria
      }
    });

    observer.observe(this.messagesContainer.nativeElement, {
      childList: true // Observar cambios en los elementos hijos del contenedor
    });
  }


  ngOnDestroy() {
    this.techModeService.setTechMode(false);
  }

  // Nuevo método para reiniciar la conversación
  resetConversation() {
    this.newMessage.conversationId = uuidv4(); // Generar un nuevo UUID
    this.listMensajes = []; // Limpiar la lista de mensajes
    this.alreadyMessage = false; // Reiniciar la variable de estado
  }
}
