import { Injectable, HostBinding } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeKey: string = 'theme';
  @HostBinding('class') componentScssClass: any;
  theme: boolean = false;

  constructor(
    private readonly overlayContainer: OverlayContainer
  ) {
    const storedTheme = localStorage.getItem(this.themeKey);
    if (storedTheme) {
      this.theme = JSON.parse(storedTheme);
    }

    if (typeof this.theme === 'boolean') {
      this.overlayContainer.getContainerElement().classList.add(this.theme ? 'dark-mode' : 'light-mode')
      this.componentScssClass = this.theme ? 'dark-mode' : 'light-mode';
    }
  }

  /** Cambia el valor del tema y actualiza el valor que almacena
    * en el localStorage.
    * */
  toggleTheme(): void {
    this.overlayContainer.getContainerElement().classList.remove(this.componentScssClass)
    this.overlayContainer.getContainerElement().classList.add(!this.theme ? 'dark-mode' : 'light-mode')
    this.componentScssClass = !this.theme ? 'dark-mode' : 'light-mode';

    this.theme = !this.theme
    localStorage.setItem(this.themeKey, JSON.stringify(this.theme));
  }
}
