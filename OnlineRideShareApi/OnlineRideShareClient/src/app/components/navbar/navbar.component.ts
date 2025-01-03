import { Component } from '@angular/core';
import {  MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import{MatToolbarModule} from '@angular/material/toolbar'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIcon, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
