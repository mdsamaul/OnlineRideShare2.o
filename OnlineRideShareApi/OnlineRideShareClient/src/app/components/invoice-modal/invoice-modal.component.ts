import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthService } from '../../services/auth.service';
declare module 'jspdf-autotable';
import html2canvas from 'html2canvas';
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
  isLoading:boolean=false;
  allPaymentsMethod: any[] | undefined;
  constructor(
    public dialogRef: MatDialogRef<InvoiceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public payment: any,
    private authService: AuthService
  ) {}
  @ViewChild('invoiceSection', { static: false }) invoiceSection!: ElementRef;

  downloadInvoicePdf() {
    this.isLoading=true;
    const element = this.invoiceSection.nativeElement;

    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; 

      pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);
      pdf.save('invoice.pdf'); // Download PDF
      this.isLoading=false;
    });
    
  }
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
  printInvoice() {
    this.isLoading=true;
    let printContent = document.getElementById("invoice-section")?.innerHTML;
    let originalContent = document.body.innerHTML;
  
    if (printContent) {
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); 
    }
  }
}
