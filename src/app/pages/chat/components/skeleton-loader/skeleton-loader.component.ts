import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderService } from '../../services/skeleton-loader.service';
import { ThemeService } from '../../../../core/components/navigation/services/theme.service';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.css'
})
export class SkeletonLoaderComponent {
  constructor(
    public skeletonLoaderService : SkeletonLoaderService,
    public themeService : ThemeService
  ) {

  }
}
