import { Component } from '@angular/core';
import { DriverDetailsComponent } from "../../components/driver-details/driver-details.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-driver-info',
  standalone: true,
  imports: [DriverDetailsComponent, FooterComponent],
  templateUrl: './driver-info.component.html',
  styleUrl: './driver-info.component.css'
})
export class DriverInfoComponent {

}
