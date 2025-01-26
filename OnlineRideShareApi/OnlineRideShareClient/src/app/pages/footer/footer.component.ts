import { Component } from '@angular/core';
import { FooterDetailsComponent } from "../../components/footer-details/footer-details.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FooterDetailsComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
