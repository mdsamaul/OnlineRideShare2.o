// import { CommonModule, DatePipe } from '@angular/common';
// import { Component, Inject, OnInit } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import jsPDF from 'jspdf';
// @Component({
//   selector: 'app-invoice-modal',
//   standalone: true,
//   imports: [CommonModule ],
//   templateUrl: './invoice-modal.component.html',
//   styleUrl: './invoice-modal.component.css'
// })

// export class InvoiceModalComponent implements OnInit{
//   constructor(
//     public dialogRef: MatDialogRef<InvoiceModalComponent>,
//     @Inject(MAT_DIALOG_DATA) public invoice: any
//   ) {}
//   ngOnInit(): void {
// console.log(this.invoice);
//   }

//   closeModal(): void {
//     this.dialogRef.close();
//   }

//   downloadInvoicePdf(): void {
//     const doc = new jsPDF();
//     doc.text(`Invoice ID: ${this.invoice.invoiceId}`, 10, 10);
//     doc.text(`Payment Time: ${this.invoice.paymentTime}`, 10, 20);
//     doc.text(`Amount: ${this.invoice.amount}`, 10, 30);
//     doc.text(`Customer: ${this.invoice.customer?.name || 'N/A'}`, 10, 40);
//     doc.text(`Driver: ${this.invoice.driver?.name || 'N/A'}`, 10, 50);
//     doc.text(`Payment Method: ${this.invoice.paymentMethod?.methodName || 'N/A'}`, 10, 60);
//     doc.save(`Invoice_${this.invoice.invoiceId}.pdf`);
//   }
// }

import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthService } from '../../services/auth.service';
declare module 'jspdf-autotable';

@Component({
  selector: 'app-invoice-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-modal.component.html',
  styleUrls: ['./invoice-modal.component.css'],
})
export class InvoiceModalComponent implements OnInit {
  invoice: any = undefined;
  driver: any = undefined;
  customer: any = undefined;
  allPaymentsMethod: any[] | undefined;
  constructor(
    public dialogRef: MatDialogRef<InvoiceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public payment: any,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // console.log(this.payment);

    this.authService.invoiceGetById(this.payment.invoiceId).subscribe((res) => {
      this.invoice = res;
      console.log(res);
      this.authService.getDriverById(res.driverId).subscribe((resdriver) => {
        this.driver = resdriver;
        // console.log(resdriver);
      });
      this.authService
        .getIdByCustomer(res.customerId)
        .subscribe((resCustomer) => {
          this.customer = resCustomer;
        });
    });    
    this.authService.getAllPaymentMethod().subscribe((res) => {
      console.log('method ', res);
      this.allPaymentsMethod = res;
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  downloadInvoicePdf(): void {
    const doc = new jsPDF();

    // Adding content to the PDF
    doc.setFontSize(16);
    doc.text('Invoice Details', 10, 10);

    doc.setFontSize(12);
    doc.text(`Invoice ID: ${this.payment.paymentId}`, 10, 20);
    doc.text(`Payment Time: ${this.payment.paymentTime}`, 10, 30);
    doc.text(`Amount: ${this.payment.amount}`, 10, 40);
    doc.text(`Customer: ${this.payment.customer?.name || 'N/A'}`, 10, 50);
    doc.text(`Driver: ${this.payment.driver?.name || 'N/A'}`, 10, 60);
    doc.text(
      `Payment Method: ${this.payment.paymentMethod?.methodName || 'N/A'}`,
      10,
      70
    );

    // If there are more details, you can continue to add them similarly
    // For example, adding a date or other attributes from the invoice

    // Adding a footer with the current date (Optional)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 80);

    // Save the PDF with a dynamic filename
    doc.save(`Invoice_${this.payment.paymentId}.pdf`);
  }
}
