import { Component } from '@angular/core';
import { VehicleListComponent } from "../../components/vehicle-list/vehicle-list.component";
import { VehicleWonTypeComponent } from "../../components/vehicle-won-type/vehicle-won-type.component";

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [VehicleListComponent, VehicleWonTypeComponent],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css'
})
export class VehicleComponent {

}
