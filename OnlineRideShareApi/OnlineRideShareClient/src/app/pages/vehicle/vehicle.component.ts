import { Component } from '@angular/core';
import { VehicleWonTypeComponent } from "../../components/vehicle-won-type/vehicle-won-type.component";
import { VehicleTypeListComponent } from "../../components/vehicle-type-list/vehicle-type-list.component";
import { VehicleListComponent } from "../../components/vehicle-list/vehicle-list.component";

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [VehicleWonTypeComponent, VehicleTypeListComponent, VehicleListComponent],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css'
})
export class VehicleComponent {

}
