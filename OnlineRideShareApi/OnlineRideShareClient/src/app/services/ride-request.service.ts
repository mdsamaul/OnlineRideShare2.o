import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RideRequestService {
  private requestIdSource = new BehaviorSubject<number | null>(null); // Default null
  currentRequestId = this.requestIdSource.asObservable(); // Exposing observable

  constructor() {}

  changeRequestId(requestId: number): void {
    this.requestIdSource.next(requestId); // Updating BehaviorSubject value
  }
}
