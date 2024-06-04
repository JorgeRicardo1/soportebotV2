import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/components/navigation/services/theme.service';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent {

  constructor(
    protected themeService: ThemeService
  ) {

  }
}
