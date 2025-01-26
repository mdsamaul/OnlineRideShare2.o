import { Component } from '@angular/core';
import { AboutDetailsComponent } from "../../components/about-details/about-details.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [AboutDetailsComponent, FooterComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
