import { Component, ElementRef, Renderer2 } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { AccountComponent } from "../account/account.component";
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'utp-menu',
    standalone: true,
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css',
    imports: [MaterialModule, CommonModule, AccountComponent]
})
export class MenuComponent {

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    protected themeService: ThemeService
  ){}

  showMenu: boolean = false;

  ngOnInit() {
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

}
