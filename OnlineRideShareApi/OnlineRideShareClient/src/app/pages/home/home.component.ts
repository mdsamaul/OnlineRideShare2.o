import { Component, inject, Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BannerSearchRideDriverComponent } from "../../components/banner-search-ride-driver/banner-search-ride-driver.component";
import { HomeBodyComponent } from "../../components/home-body/home-body.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BannerSearchRideDriverComponent, HomeBodyComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
authService =inject(AuthService);
}
