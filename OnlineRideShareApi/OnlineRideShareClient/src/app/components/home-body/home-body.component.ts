import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-home-body',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-body.component.html',
  styleUrl: './home-body.component.css'
})
export class HomeBodyComponent  implements AfterViewInit {

  ngAfterViewInit() {
    $('#testiSlide').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      arrows: true,
      dots: true,
      prevArrow: '.nav-btn:first-child',
      nextArrow: '.nav-btn:last-child',
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  }
}