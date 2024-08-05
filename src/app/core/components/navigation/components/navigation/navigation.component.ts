import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ChatComponent } from '../../../../../pages/chat/chat.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { MenuEntry } from '../../interfaces/menu-entry.interface';
import { MenuService } from '../../services/menu.service';
import { Subscription } from 'rxjs';
import { LayoutComponent } from '../layout/layout.component';
import { ThemeService } from '../../services/theme.service';
import { TechModeService } from '../../services/tech-mode.service';
import { ImagesService } from '../../../../services/images/images.service';
import { ImageStorageService } from '../../services/image-storage.service'
import { AuthService } from '../../../../../auth/auth.service';
import { UserInformation } from '../../../../../shared/interfaces/user-information.interface';
import { DataField } from '../../../../../shared/interfaces/data-field-aranda.interface';
import { ArandaServicesService } from '../../../../services/aranda/aranda-services.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
  imports: [
    MatSidenavModule,
    MaterialModule,
    CommonModule,
    RouterModule,
    ChatComponent,
    ToolbarComponent,
    LayoutComponent,
  ],
})
export class NavigationComponent {
  isMenuOpen = true;
  contentMargin = 275;
  private subscription = new Subscription();
  events: string[] = [];
  opened: boolean = true;
  isTechMode: boolean = false;
  private techModeSubscription!: Subscription;

  menuEntries: MenuEntry[] = [];

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


  constructor(
    private router: Router,
    private menuService: MenuService,
    protected themeService: ThemeService,
    private techModeService: TechModeService,
    private imageService: ImagesService,
    private imageStoreService: ImageStorageService,
    private authService: AuthService,
    private arandaService: ArandaServicesService
  ) {
    this.imageService.getImage().subscribe((res) => {

      const reader = new FileReader();
      reader.readAsDataURL(res);
      reader.onloadend = () => {
        const image = reader.result;
        sessionStorage.setItem('userImage', image as string);
        this.imageStoreService.setImage(image as string);
      };
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.menuService.getMenu().subscribe((menu) => {
        this.menuEntries = menu;
      })
    );
    this.techModeSubscription = this.techModeService.techMode$.subscribe(
      (isTech) => (this.isTechMode = isTech)
    );
    this.setUserInformation();

    // json que se enviará para registrar a un usurio en aranda
    let jsonData: DataField[] = [
      { Field: "Alias", Value: "" },
      { Field: "FirstName", Value: "" },
      { Field: "LastName", Value: "" },
      { Field: "Email", Value: "" },
      { Field: "PassWord", Value: "" },
      { Field: "Document", Value: "" },
      { Field: "Role", Value: "" }
    ];

    // informacion usuario guardada en el local storage traida ya como un objeto
    const storedData = this.getDataFromLocalStorage();

    jsonData = this.fillJsonData(jsonData, storedData);

    const jsonString = JSON.stringify(jsonData);
    this.arandaService.insertUserAranda(jsonString).subscribe(response => {
    }, error => {
      console.error('Error:', error);
    });
  }

  onToolbarMenuToggle() {
    this.isMenuOpen = !this.isMenuOpen;
    this.contentMargin = this.isMenuOpen ? 275 : 83;
  }

  navigateRoute(route: string | undefined) {
    if (route) {
      this.router.navigate([route]);
    } else {
      // Manejar el caso cuando la ruta sea undefined
    }
  }

  toggleTechMode() {
    const currentMode = this.techModeService.getTechMode();
    this.techModeService.setTechMode(!currentMode);
    if (!currentMode == true) {
      this.isMenuOpen = false;
      this.contentMargin = this.isMenuOpen ? 275 : 83;
      this.router.navigate(['/chatTech']);
    } else {
      this.router.navigate(['/chat']);
    }
  }

  navigateModoTech() {
    this.toggleTechMode();
    this.isMenuOpen = false;
    this.contentMargin = this.isMenuOpen ? 275 : 83;
    this.router.navigate(['/chatTech']);
  }

  setUserInformation() {
    this.authService.getUserInfo().subscribe((respuesta: UserInformation) => {
      localStorage.setItem('InfoUsuario', JSON.stringify(respuesta))
    });
  }

  getDataFromLocalStorage(): UserInformation {
    const jsonData = localStorage.getItem('InfoUsuario');
    if (jsonData) {
      return JSON.parse(jsonData) as UserInformation;
    }
    return this.defaultUserInformation;
  }

  // funcion para llenar el json que se le manda al servicio de aranda con la informacion del Usuario
  // para insertarlo en la base de datos de aranda
  fillJsonData(jsonData: DataField[], storedData: UserInformation): DataField[] {
    return jsonData.map(field => {
      switch (field.Field) {
        case "Alias":
          return { ...field, Value: storedData.document };
        case "Document":
          return { ...field, Value: storedData.document };
        case "FirstName":
          return { ...field, Value: storedData.firstName };
        case "LastName":
          return { ...field, Value: storedData.lastName };
        case "Email":
          return { ...field, Value: storedData.email };
        case "PassWord":
          return { ...field, Value: storedData.passWord };
        case "Role":
          return { ...field, Value: storedData.role.toString() };
        default:
          return field;
      }
    });
  }
}
