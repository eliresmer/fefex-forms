import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CustomerService } from '../services/customer-service';
import { Customer } from '../models/customer';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-customer-template-validation',
  standalone: false,
  templateUrl: './customer-template-validation.html',
  styleUrl: './customer-template-validation.css',
})
export class CustomerTemplateValidation implements OnDestroy {
  private destroy$ = new Subject<void>();

  message?: string;
  customer: Customer = new Customer();

  onFormSubmit(form: NgForm): void {
    this.message = '';
    if (form.invalid) {
      this.message = "Invalid customer";
      return;
    }
    this.customer = form.value;
    this.customerService.createCustomer(this.customer).pipe(takeUntil(this.destroy$)).subscribe(
     {
      next: (success: boolean) => {
        if (success) {
          this.message = 'Customer Created';
          this.customer = new Customer();
          form.resetForm();
        }
        else {
          this.message = "Error: could not create customer";
        }
      }
     }
    );
  }

  constructor(public customerService: CustomerService) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
