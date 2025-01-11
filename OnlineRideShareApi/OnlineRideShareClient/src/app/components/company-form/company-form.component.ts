import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CompanyCreateRequest } from '../../interfaces/company-create-request';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css'],
})
export class CompanyFormComponent implements OnInit, OnDestroy {
  // Injected services
  authServices = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  isEdit = false;
  id: number = 0;
  // Reactive form variable
  form!: FormGroup;
  companyFormSubscription!: Subscription;
  paramsSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnDestroy(): void {
    if (this.companyFormSubscription) {
      this.companyFormSubscription.unsubscribe();
    }
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    if (!this.isEdit) {
      if (this.form.invalid) {
        // If form is invalid, show an error message
        this.matSnackBar.open(
          'Please fill in all required fields correctly.',
          'Close',
          {
            duration: 3000,
          }
        );
        return;
      }
      // Call the API to create the company
      // debugger
      this.companyFormSubscription = this.authServices
        .createCompany(this.form.value)
        .subscribe({
          next: (response) => {
            this.toastr.success('Added Company Successfully');
            console.log(response);
            this.router.navigateByUrl('/company');
            this.matSnackBar.open('added company', 'Close', {
              duration: 5000,
            });
            // this.router.navigate(['/company']);
          },
          error: (err) => {
            console.log(err);
            this.toastr.error(err.error.message!);
            this.matSnackBar.open('Compnay Create Failed', 'Close', {
              duration: 5000,
            });
          },
        });
    } else {
      if (this.form.invalid) {
        // If form is invalid, show an error message
        this.matSnackBar.open(
          'Please fill in all required fields correctly.',
          'Close',
          {
            duration: 3000,
          }
        );
        return;
      }
      // Call the API to create the company
      // debugger

      this.authServices.editCompany(this.id, this.form.value).subscribe({
        next: (response) => {
          console.log('Edit', Response);
          this.router.navigateByUrl('/company');
          this.toastr.success('Edit Successfully');
          this.matSnackBar.open('Edit company', 'Close', {
            duration: 5000,
          });
          // this.router.navigate(['/company']);
        },
        error: (err) => {
          console.log(err);
          this.toastr.error('Edit Successfully faild');
          this.matSnackBar.open('Compnay Edit Failed', 'Close', {
            duration: 5000,
          });
        },
      });
    }
  }

  ngOnInit(): void {
    this.paramsSubscription = this.activatedRouter.params.subscribe({
      next: (response) => {
        console.log(response['id']);
        this.id = response['id'];
        if (!this.id) return;
        this.authServices.getCompanyById(this.id).subscribe({
          next: (response) => {
            console.log(response);
            this.form.patchValue(response);
            this.isEdit = true;
          },
          error: (err) => {
            console.log(err);
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.form = this.fb.group({
      companyName: ['', [Validators.required]],
      address: [''],
      companyEmail: ['', [Validators.required, Validators.email]],
      // companyPhoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]]  // Required and 10 digit phone number
      companyPhoneNumber: ['', [Validators.required]],
    });
  }
}
