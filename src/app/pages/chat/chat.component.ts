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
import { CommonModule, JsonPipe } from '@angular/common';
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
import { DataField } from '../../shared/interfaces/data-field-aranda.interface';
import { UserInformation } from '../../shared/interfaces/user-information.interface';
import { ArandaServicesService } from '../../core/services/aranda/aranda-services.service';
import { InfoCase } from './interfaces/info-case';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component'

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MaterialModule, DialogModule, SkeletonLoaderComponent],
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
    id: 85849, // number
    subject: "Prueba1", // string
    authorName: "Grajales Echeverri Cristhian Darío", // string
    companyName: "Nova Informàtica Ltda.", // string
    groupName: "Soporte Segundo Nivel", // string
    priorityName: "MEDIUM", // string
    stateName: "Registrado", // string
    registrationDate: "2024-07-04T20:24:32.000Z", // string
    solutionDateExpected: "2024-07-05T15:09:04.000Z" // strin
  };

  infoEquipo: infoEquipo = {
    usuario: { name: 'Andres', code: '1088035677' },
    placa: 0,
    resumen: '',
    ticket: 0,
    detalles: '',
    ubicacion: '',
  };

  defaultUserInformation: UserInformation = {
    document: '',
    identityType: 0,
    firstName: '',
    lastName: '',
    email: '',
    passWord: '',
    role: 0,
    charge: '',
    contractType: '',
    dependency: '',
    country: 0,
    companyId: 0
  };

  jsonData: DataField[] = [
    { Field: "Id", Value: "" },
    { Field: "FullName", Value: "" },
    { Field: "Email", Value: "" },
    { Field: "Charge", Value: "" },
    { Field: "IdentityType", Value: "" },
    { Field: "Document", Value: "" },
    { Field: "AdditionalField2", Value: "" },
    { Field: "AdditionalField3", Value: "" },
    { Field: "AdditionalField4", Value: "" },
    { Field: "Country", Value: "" },
    { Field: "CompanyId", Value: "" }
  ];

  listMensajes: any = [];
  sharedList: any[] = [];
  defaultImage = '../../../assets/img/profile.png';
  image: any = '';

  ticket = '';
  resumen = '';

  bodyCasoNuevo : InfoCase = {
    description: '',
    subject: ''
  };


  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    private messageService: MessagesService,
    protected themeService: ThemeService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    protected casosService: CasosService,
    private cdr: ChangeDetectorRef,
    private arandaService: ArandaServicesService
  ) {
    this.alreadyMessage = this.messageService.messagesListSignal().length > 0 ? true : false;
  }

  ngOnInit(): void {
    // this.listMensajes = this.messageService.getLocalMessages();
    const storedImage = sessionStorage.getItem('userImage');
    if (storedImage) {
      this.image = storedImage;
    }

  }


  getMessageType(message: any): string {
    // Asumiendo que 'success' es una propiedad única de BotMessage
    const userInfo = localStorage.getItem('InfoUsuario');
    if(!message.hasOwnProperty('success')){

      const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;
      return parsedUserInfo.firstName + ' ' + parsedUserInfo.lastName;
    }
    else{
      return 'bot'
    }
  }

  getImageForMessageType(message: any): string {
    if (message.hasOwnProperty('success')) {
      // Devuelve la ruta de la imagen para el tipo de mensaje 'bot'
      return '../../../assets/img/profile.png';
    } else {
      // Devuelve la ruta de la imagen predeterminada o para otros tipos de mensaje
      return this.image;
    }
  }

  sendMessage(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    const input = keyboardEvent.target as HTMLInputElement;
    this.alreadyMessage = true;

    const userMessageToSend: UserMessage = {
      ...this.newMessage,
      content: input.value,
    };

    //this.listMensajes.push(userMessageToSend);
    //guarda el mensaje en la lista que esta en los servicios de mensajes
    this.messageService.messagesListSignal.update(messages => ([...messages, userMessageToSend]))

    this.messageService
      .sendMessagePost(userMessageToSend)
      .subscribe((respuesta: BotMessage) => {
        this.listMensajes.push(respuesta);
        this.messageService.messagesListSignal.update(messages => ([...messages, respuesta]))
        // this.messageService.saveLocalMessage(respuesta);

        if (respuesta.content.ticket == true) {
          this.sendConfirmationCaseMessage();
        }
        this.cdr.detectChanges();
        this.scrollToLastMessage();
      });
    input.value = '';
  }

  get messages() {
    return this.messageService.messagesListSignal();
  }

  scrollToLastMessage() {
    const observer = new MutationObserver((mutations) => {
      if (mutations.length) {
        this.messagesContainer.nativeElement.lastElementChild.scrollIntoView({
          behavior: 'smooth',
        });
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

          this.snackbarService.openCustomSnackbar(
            'Caso creado',
            SnackbarType.success
          );
          this.infoEquipo.placa = result.placa;
          this.infoEquipo.ubicacion = result.ubicacion;
          this.infoEquipo.detalles = result.detalles;
          //una vez creado el caso se borran los mensajes
          this.messageService.messagesListSignal.set([]);
          setTimeout(() => {
            this.router.navigate(['/casos']);
          }, 1000);

          this.casoNuevo.id = this.infoEquipo.ticket;

          // informacion usuario guardada en el local storage traida ya como un objeto
          const storedData = this.getDataFromLocalStorage();

          this.jsonData = this.fillJsonData(this.jsonData, storedData);

          const jsonString = JSON.stringify(this.jsonData);
          this.arandaService.updateUserAranda(jsonString, 213890).subscribe(response => {
          }, error => {
            console.error('Error:', error);
    });

          // this.casosService.addCaso(this.casoNuevo);
          const stringBody = JSON.stringify(this.bodyCasoNuevo);
          const stringBodyWithoutAccents = this.removeAccents(stringBody);

          this.casosService.createCasoPost(stringBodyWithoutAccents).subscribe((respuesta) => {
          })
        } else {
          this.snackbarService.openCustomSnackbar(
            'El caso no ha sido creado',
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
        this.messageService.messagesListSignal.update(messages => ([...messages,  ]))
        this.fecha = new Date();
      });
  }

  sendMensajeResumen() {
    let ticket = 0;
    let resumen = '';
    const mensajeAux: UserMessage = {
      conversationId: this.newMessage.conversationId,
      role: this.newMessage.role,
      content:
        'Crea un json que tenga dos elementos, el resumen de la interaccion y un asunto que sintetice el motivo, solo dame el json no digas nada mas ejemplo { "description": "resumen",  "subject": "asunto"}',
    };

    this.messageService
      .sendMessagePost(mensajeAux)
      .subscribe((respuesta: BotMessage) => {
        this.botRespuesta = respuesta;
        // this.ticket = JSON.parse(this.botRespuesta.content.content).ticket;
        // this.resumen = JSON.parse(this.botRespuesta.content.content).resumen;
        console.log("resumen y asunto:",respuesta);
        this.bodyCasoNuevo = JSON.parse(respuesta.content.content);

        // ticket = JSON.parse(this.botRespuesta.content.content).ticket;
        // resumen = JSON.parse(this.botRespuesta.content.content).resumen;

        // this.infoEquipo.resumen = resumen;
        // this.infoEquipo.ticket = ticket;
        // this.fecha = new Date();
      });
  }

  // Función para quitar las tildes
  removeAccents(str : string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
    this.messageService.messagesListSignal.set([]);
  }

  getDataFromLocalStorage(): UserInformation {
    const jsonData = localStorage.getItem('InfoUsuario');
    if (jsonData) {
      return JSON.parse(jsonData) as UserInformation;
    }
    return this.defaultUserInformation;
  }

  // funcion para llenar el json que se le manda al servicio de aranda con la informacion del Usuario
  // para actualizarlo en la base de datos de aranda
  fillJsonData(jsonData: DataField[], storedData: UserInformation): DataField[] {
  return jsonData.map(field => {
    switch (field.Field) {
      case "Id":
        return { ...field, Value: storedData.document };
      case "FullName":
        return { ...field, Value: `${storedData.firstName} ${storedData.lastName}` };
      case "Email":
        return { ...field, Value: storedData.email };
      case "Charge":
        return { ...field, Value: storedData.charge };
      case "IdentityType":
        return { ...field, Value: storedData.identityType.toString() };
      case "Document":
        return { ...field, Value: storedData.document };
      case "Role":
        return { ...field, Value: storedData.role.toString() };
      case "Country":
        return { ...field, Value: storedData.country.toString() };
      case "CompanyId":
        return { ...field, Value: storedData.companyId.toString() };
      case "AdditionalField2":
        return { ...field, Value: storedData.contractType };
      case "AdditionalField3":
        return { ...field, Value: this.infoEquipo.ubicacion };
      case "AdditionalField4":
        return { ...field, Value: storedData.dependency };
      default:
        return field;
    }
  });
}
}
