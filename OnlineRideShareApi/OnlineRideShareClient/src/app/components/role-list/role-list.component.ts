import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Role } from '../../interfaces/tole';
import { MatButtonModule } from '@angular/material/button';
import {  MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [MatButtonModule , AsyncPipe, MatIconModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent implements OnInit{
  authService = inject(AuthService);
roleService = inject(RoleService);
ngOnInit(): void {
console.log("auth " , this.authService.getRoles());
console.log("role " , this.roleService.getRoles());
}

torole = this.roleService.getRoles();

@Input({ required: true }) roles!: Role[] | null;
@Output () deleteRole: EventEmitter<string> = new EventEmitter<string>();
delete(id:string){
this.deleteRole.emit(id);
}
}
