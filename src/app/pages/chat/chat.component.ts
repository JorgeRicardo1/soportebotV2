import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { ObserversModule } from '@angular/cdk/observers';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MaterialModule } from '../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { MessagesService } from './services/messages.service';
import { BotMessage } from './interfaces/bot-message';
import { UserMessage } from './interfaces/user-message';
import { ThemeService } from '../../core/components/navigation/services/theme.service';
import {
  Dialog,
  DialogRef,
  DIALOG_DATA,
  DialogModule,
} from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../../core/components/dialog/confirmation/confirmation.component';
import { infoEquipo } from './interfaces/info-equipo';
import { SnackbarService } from '../../core/components/snackbar/services/snackbar.service';
import { SnackbarType } from '../../core/components/snackbar/models/snackbar-type';
import { Router } from '@angular/router';
import { CasosService } from '../cases/services/casos.service';
import { Caso } from '../cases/interfaces/caso';
import { finalize } from 'rxjs';
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de instalar uuid si no lo tienes instalado

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MaterialModule, DialogModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  alreadyMessage = false;
  fecha = new Date();

  newMessage: UserMessage = {
    conversationId: uuidv4(),
    role: 'user',
    content: '',
  };

  botRespuesta: BotMessage = {
    success: false,
    content: {
      ticket: false,
      content: '',
    },
  };

  casoNuevo: Caso = {
    ticket: '',
    user: { name: 'Andres', code: '1088035677' },
    date: new Date(),
    resume: '',
    state: {
      recibido: true,
      enviado: true,
      enRevision: false,
      solucionado: false,
    },
  };

  infoEquipo: infoEquipo = {
    usuario: { name: 'Andres', code: '1088035677' },
    placa: 0,
    resumen: '',
    ticket: '',
    detalles: '',
    ubicacion: '',
  };

  listMensajes: any = [];
  sharedList: any[] = [];
  imagen: '../../../assets/img/profile.png' | undefined;

  ticket = '';
  resumen = '';

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    private messageService: MessagesService,
    protected themeService: ThemeService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    protected casosService: CasosService,
    private cdr: ChangeDetectorRef
  ) {
    this.alreadyMessage = false;
  }

  ngOnInit(): void {
    // this.listMensajes = this.messageService.getLocalMessages();
  }

  ngAfterViewInit(): void {
    console.log('afterViewInit');
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

    this.messageService
      .sendMessagePost(userMessageToSend)
      .subscribe((respuesta: BotMessage) => {
        this.listMensajes.push(respuesta);
        // this.messageService.saveLocalMessage(respuesta);

        if (respuesta.content.ticket == true) {
          this.sendConfirmationCaseMessage();
        }
        this.cdr.detectChanges();
        console.log('dectectchanges');
        this.scrollToLastMessage();

        // this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      });
    input.value = '';
  }

  scrollToLastMessage() {
    const observer = new MutationObserver((mutations) => {
      if (mutations.length) {
        this.messagesContainer.nativeElement.lastElementChild.scrollIntoView({
          behavior: 'smooth',
        });
        console.log('scrolie');
        // observer.disconnect(); // Importante desconectar el observer para evitar fuga de memoria
      }
    });

    observer.observe(this.messagesContainer.nativeElement, {
      childList: true, // Observar cambios en los elementos hijos del contenedor
    });
  }

  sendConfirmationCaseMessage() {
    this.sendMensajeResumen();
    this.snackbarService.openCustomSnackbar(
      'Creando caso...',
      SnackbarType.saving
    );
    this.openDialog();
  }

  openDialog(): void {
    setTimeout(() => {
      const dialogRef = this.dialog.open(ConfirmationComponent, {
        width: '300px',
        disableClose: true,
        data: { ticket: this.ticket, resumen: this.resumen },
      });

      dialogRef.afterClosed().subscribe((result: infoEquipo) => {
        if (result) {
          console.log(result);

          this.snackbarService.openCustomSnackbar(
            'Caso creado',
            SnackbarType.success
          );
          this.infoEquipo.placa = result.placa;
          this.infoEquipo.ubicacion = result.ubicacion;
          this.infoEquipo.detalles = result.detalles;

          setTimeout(() => {
            this.router.navigate(['/casos']);
          }, 1000);

          console.log(this.infoEquipo);
          this.casoNuevo.ticket = this.infoEquipo.ticket;

          this.casosService.addCaso(this.casoNuevo);
        } else {
          this.snackbarService.openCustomSnackbar(
            'Caso no creado',
            SnackbarType.error
          );
          this.sendMensajeCancelar();
        }
      });
    }, 2000); // 5000 milisegundos = 5 segundos
  }

  sendMensajeCancelar() {
    const mensajeAux: UserMessage = {
      conversationId: this.newMessage.conversationId,
      role: this.newMessage.role,
      content: 'No, no quiero crear un caso para esta situacion gracias',
    };

    this.messageService
      .sendMessagePost(mensajeAux)
      .subscribe((respuesta: BotMessage) => {
        this.botRespuesta = respuesta;
        this.listMensajes.push(this.botRespuesta);

        this.fecha = new Date();
      });
  }

  sendMensajeResumen() {
    let ticket = '';
    let resumen = '';
    const mensajeAux: UserMessage = {
      conversationId: this.newMessage.conversationId,
      role: this.newMessage.role,
      content:
        'Crea un json que tenga dos elementos, el resumen de la interaccion y el ticket, solo dame el json no digas nada mas',
    };

    this.messageService
      .sendMessagePost(mensajeAux)
      .subscribe((respuesta: BotMessage) => {
        this.botRespuesta = respuesta;
        // this.ticket = JSON.parse(this.botRespuesta.content.content).ticket;
        // this.resumen = JSON.parse(this.botRespuesta.content.content).resumen;
        ticket = JSON.parse(this.botRespuesta.content.content).ticket;
        resumen = JSON.parse(this.botRespuesta.content.content).resumen;

        this.infoEquipo.resumen = resumen;
        this.infoEquipo.ticket = ticket;
        this.fecha = new Date();
      });
  }

  sendSuggestion(suggestionText: string) {
    this.alreadyMessage = true;

    // Crear el mensaje del usuario basado en la sugerencia
    const userMessage: UserMessage = {
      ...this.newMessage,
      content: suggestionText,
    };

    // Agregar el mensaje a la lista de mensajes
    this.listMensajes.push(userMessage);

    // Enviar el mensaje al servicio y manejar la respuesta
    this.messageService
      .sendMessagePost(userMessage)
      .subscribe((respuesta: BotMessage) => {
        this.botRespuesta = respuesta;
        this.listMensajes.push(this.botRespuesta);
        this.fecha = new Date();
      });
  }

  // Nuevo método para reiniciar la conversación
  resetConversation() {
    this.newMessage.conversationId = uuidv4(); // Generar un nuevo UUID
    this.listMensajes = []; // Limpiar la lista de mensajes
    this.alreadyMessage = false; // Reiniciar la variable de estado
  }
}
