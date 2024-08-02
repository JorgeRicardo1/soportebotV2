import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from "../../../loader/loader.component";

@Component({
  selector: 'utp-layout',
  standalone: true,
  imports: [RouterModule, LoaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
