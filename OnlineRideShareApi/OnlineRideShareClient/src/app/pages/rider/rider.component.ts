import { Component } from '@angular/core';
import { RiderDetailsComponent } from "../../components/rider-details/rider-details.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-rider',
  standalone: true,
  imports: [RiderDetailsComponent, FooterComponent],
  templateUrl: './rider.component.html',
  styleUrl: './rider.component.css'
})
export class RiderComponent {

}
