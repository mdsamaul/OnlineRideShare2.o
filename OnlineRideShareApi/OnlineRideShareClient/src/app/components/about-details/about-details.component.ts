import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-about-details',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatFormFieldModule,
    MatButtonModule, 
    MatInputModule, 
    FormsModule 
  ],
  templateUrl: './about-details.component.html',
  styleUrl: './about-details.component.css'
})
export class AboutDetailsComponent implements OnInit {
  counters = [
    { label: 'Drivers', target: 10000, value: 0 },
    { label: 'Passengers', target: 40000, value: 0 },
    { label: 'Partners', target: 5000, value: 0 },
  ];

  ngOnInit() {
    this.counters.forEach((counter) => this.animateCounter(counter));
  }

  animateCounter(counter: { target: number; value: number }) {
    const increment = counter.target / 200; // 200 ধাপে পূর্ণ হবে
    const interval = setInterval(() => {
      counter.value = Math.ceil(counter.value + increment);
      if (counter.value >= counter.target) {
        counter.value = counter.target;
        clearInterval(interval);
      }
    }, 10); // প্রতি 10ms অন্তর আপডেট
  }

  onSubscribe(email: string): void {
    console.log('Subscribed with email:', email);
  }

}