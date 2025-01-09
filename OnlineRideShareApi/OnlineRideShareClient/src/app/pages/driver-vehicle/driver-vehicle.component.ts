import { Component } from '@angular/core';
import { DriverVehicleListComponent } from "../../components/DriverVehicle/driver-vehicle-list/driver-vehicle-list.component";

@Component({
  selector: 'app-driver-vehicle',
  standalone: true,
  imports: [DriverVehicleListComponent],
  templateUrl: './driver-vehicle.component.html',
  styleUrl: './driver-vehicle.component.css'
})
export class DriverVehicleComponent {

}
