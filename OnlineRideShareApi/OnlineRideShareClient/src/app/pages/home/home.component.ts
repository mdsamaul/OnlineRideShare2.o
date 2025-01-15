import { Component, inject, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RideSearchViewComponent } from "../../components/ride-search-view/ride-search-view.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RideSearchViewComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
authService =inject(AuthService);

}
