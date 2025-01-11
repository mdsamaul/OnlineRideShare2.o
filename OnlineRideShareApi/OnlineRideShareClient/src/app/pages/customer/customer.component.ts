import { Component } from '@angular/core';
import { CustomerListComponent } from "../../components/customer-list/customer-list.component";

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CustomerListComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {

}
