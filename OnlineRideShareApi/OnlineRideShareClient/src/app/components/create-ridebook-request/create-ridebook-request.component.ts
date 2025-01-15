import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DriverCreateRequest } from '../../interfaces/driver-create-request';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-ridebook-request',
  standalone: true,
  imports: [],
  templateUrl: './create-ridebook-request.component.html',
  styleUrl: './create-ridebook-request.component.css'
})
export class CreateRidebookRequestComponent implements OnInit {

driverId!:number;
driver=Observable<DriverCreateRequest>;
sourceLocation!:string;
destinationLocation!:string;

constructor(
  private authService :AuthService,
  private activatedRoute : ActivatedRoute,
){}
ngOnInit(): void {
this.driverId= this.activatedRoute.snapshot.queryParams['driverId'];
this.sourceLocation = this.activatedRoute.snapshot.queryParams['sourceLocation'];
this.destinationLocation = this.activatedRoute.snapshot.queryParams['destinationLocation'];
// console.log(this.activatedRoute.snapshot.queryParams['sourceLocation']);
// console.log(this.activatedRoute.snapshot.queryParams['destinationLocation']);
// console.log(this.authService.getDriverById(this.driverId));
this.authService.getDriverById(this.driverId).subscribe({
  next:(res)=>{
    console.log(res);
  }
})
this.authService.detaislCustomer().subscribe({
  next:(res)=>{
    console.log(res);
  }
})
}


}
