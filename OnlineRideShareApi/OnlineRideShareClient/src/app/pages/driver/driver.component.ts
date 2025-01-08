import { CommonModule } from '@angular/common';
import { Component,  inject,  OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { DriverCreateRequest } from '../../interfaces/driver-create-request';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatSlideToggle  } from '@angular/material/slide-toggle'

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [RouterModule, CommonModule,MatSlideToggle ],
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.css'
})
export class DriverComponent implements OnInit{
 authService = inject(AuthService);
 toastrService = inject(ToastrService);
  drivers$!:Observable<DriverCreateRequest[]>;

  deleteDriver(id:number){
    console.log(id);
    this.authService.deleteDriver(id).subscribe({
      next:(response)=>{
        this.toastrService.success(response.message);
        this.getDriver();
      },
      error:(err)=>{
        this.toastrService.error(err.error.message);
      }
    })
  }
  ngOnInit(): void {
    this.getDriver();
  }

  private getDriver(): void{
    this.drivers$= this.authService.getDrivers();
  }
}
