import { Component } from '@angular/core';
import { RideMapComponent } from "../../components/ride-map/ride-map.component";

@Component({
  selector: 'app-ride-track',
  standalone: true,
  imports: [RideMapComponent],
  templateUrl: './ride-track.component.html',
  styleUrl: './ride-track.component.css'
})
export class RideTrackComponent {

}
