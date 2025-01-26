import { Component } from '@angular/core';
import { DashboardAllListComponent } from "../../components/dashboard-all-list/dashboard-all-list.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardAllListComponent,CommonModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
