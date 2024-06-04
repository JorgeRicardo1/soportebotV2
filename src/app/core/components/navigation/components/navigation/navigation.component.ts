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

  constructor(
    private router: Router,
    private menuService: MenuService,
    protected themeService: ThemeService,
    private techModeService: TechModeService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.menuService.getMenu().subscribe((menu) => {
        this.menuEntries = menu;
      })
    );
    this.techModeSubscription = this.techModeService.techMode$.subscribe(
      (isTech) => (this.isTechMode = isTech)
    );
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
}
