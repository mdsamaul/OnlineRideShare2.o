import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RideTrackService {

  constructor() { }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param lat1 Latitude of point 1
   * @param lon1 Longitude of point 1
   * @param lat2 Latitude of point 2
   * @param lon2 Longitude of point 2
   * @returns distance in kilometers
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);  // Convert latitude difference to radians
    const dLon = this.toRad(lon2 - lon1);  // Convert longitude difference to radians
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));  // Calculate the great-circle distance
    return R * c;  // Distance in kilometers
  }

  /**
   * Convert degrees to radians
   * @param value Value in degrees
   * @returns value in radians
   */
  private toRad(value: number): number {
    return value * Math.PI / 180;
  }
}
