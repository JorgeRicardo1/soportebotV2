import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { MaterialModule } from '../../shared/material/material.module';
import { ThemeService } from '../../core/components/navigation/services/theme.service';
import { CasosService } from './services/casos.service'
import { Caso } from './interfaces/caso';
import {MatExpansionModule} from '@angular/material/expansion';


@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [RouterLinkWithHref, MaterialModule, CommonModule ,MatExpansionModule],
  templateUrl: './cases.component.html',
  styleUrl: './cases.component.css'
})
export class CasesComponent {

  casosList : Caso[] = [];

  constructor(
    protected themeService: ThemeService,
    protected casosService: CasosService
  ){

    this.casosService.casosListSignal.set([]);

    casosService.getCasosPost().subscribe(( respuesta : Caso[] ) => {
      //this.casosList = respuesta;

      this.casosService.casosListSignal.update( (casos) => {
        console.log(casos);
        return ([...casos, ...respuesta])
      })
    });

    // this.casosList = casosService.sendCasePost();
  }

  ngAfterViewInit(){
    // setTimeout(() => {
    //   this.casosService.getCasosPost().subscribe(( respuesta : Caso[] ) => {
    //     //this.casosList = respuesta;

    //     this.casosService.casosListSignal.update( (casos) => {
    //       console.log(casos);
    //       return ([...casos, ...respuesta])
    //     })
    //   });
    // }, 5000);
  }

  get casos() {
    return this.casosService.casosListSignal();
  }
}
