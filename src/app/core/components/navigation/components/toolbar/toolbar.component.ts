import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { MenuComponent } from "../menu/menu.component";
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { TechModeService } from '../../services/tech-mode.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'utp-toolbar',
    standalone: true,
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.css',
    imports: [MaterialModule, MenuComponent, CommonModule]
})
export class ToolbarComponent {

  @Input() customTitle: string = '';
  @Output() emit = new EventEmitter();
  public title: string = 'Chat'; //Título por defecto
  isTechMode = false;
  private techModeSubscription!: Subscription;

  constructor(
    protected themeService: ThemeService,
    private techModeService: TechModeService
  ){
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.techModeSubscription = this.techModeService.techMode$.subscribe(
      isTech => this.isTechMode = isTech
    );
  }

}
