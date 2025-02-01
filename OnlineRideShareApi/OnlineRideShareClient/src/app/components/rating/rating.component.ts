import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RatingService } from '../../services/rating.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent {
  stars: number[] = [1, 2, 3, 4, 5];
  selectedRating: number = 0;

  constructor(private ratingService: RatingService) { }

  rateDriver(rating: number) {
    this.selectedRating = rating;
    this.ratingService.updateRating(rating); // রেটিং আপডেট করা
  }
  }
  
