import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner-slider.component.html',
  styleUrls: ['./banner-slider.component.css'] // styleUrls should be used instead of styleUrl
})
export class BannerSliderComponent implements OnInit {
  images: string[] = [
    './assets/images/bg1.png',
    './assets/images/bg2.png',
    './assets/images/bg3.png'
  ];
  currentIndex = 0;
  translateX = 0;

  ngOnInit(): void {
    this.autoSlide();
  }

  autoSlide() {
    setInterval(() => {
      this.nextSlide();
    }, 3000);  // 3 seconds interval
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.translateX = -this.currentIndex * 100;
  }
}
