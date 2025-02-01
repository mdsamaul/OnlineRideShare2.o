import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private ratingSource = new BehaviorSubject<number>(0); // ডিফল্ট রেটিং ০
  currentRating$ = this.ratingSource.asObservable();  // প্রকাশযোগ্য ভ্যালু

  // রেটিং আপডেট করা
  updateRating(rating: number) {
    this.ratingSource.next(rating);
  }
}
