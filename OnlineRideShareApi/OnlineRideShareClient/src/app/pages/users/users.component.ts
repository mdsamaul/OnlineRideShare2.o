import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,AsyncPipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements  OnInit{

authService = inject(AuthService);
allUser$= this.authService.getAll();
ngOnInit(): void {
  console.log("asmaul",this.authService.getAll());
}
}
