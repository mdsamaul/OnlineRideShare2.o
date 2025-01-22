import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { InvoiceModalComponent } from '../../invoice-modal/invoice-modal.component';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.css',
})
export class PaymentListComponent implements OnInit {
  allPayments: any[] | undefined;
  allPaymentsMethod: any[] | undefined;
  allInvoice: any[] | undefined;

  constructor(private authService: AuthService, private dialog: MatDialog) {}
  ngOnInit(): void {
    if (this.authService.getUserDetail()?.roles == 'Admin') {
      this.authService.getAllPayment().subscribe({
        next: (res: any[]) => {
          console.log(res);
          this.allPayments = res;
        },
      });
      this.authService.getAllInvoice().subscribe((res) => {
        console.log('invoice ', res);
        this.allInvoice = res;
      });
      this.authService.getAllPaymentMethod().subscribe((res) => {
        console.log('method ', res);
        this.allPaymentsMethod = res;
      });
    }else{
      this.authService.getPaymentDetails().subscribe({
        next: (res) => {
          console.log(res);
          this.allPayments = res;
        },
    })
    this.authService.getAllInvoice().subscribe(res=>{
      console.log("invoice ",res);
      this.allInvoice=res;
    })
    this.authService.getAllPaymentMethod().subscribe(res=>{
      console.log("method ",res)
      this.allPaymentsMethod= res;
    })
    }
  }

  onInvoiceClick(invoice: any): void {
    this.dialog.open(InvoiceModalComponent, {
      data: invoice,
      width: '600px',
    });
  }
}
