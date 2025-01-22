import { Component } from '@angular/core';
import { PaymentListComponent } from "../../components/Payment/payment-list/payment-list.component";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [PaymentListComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {

}
