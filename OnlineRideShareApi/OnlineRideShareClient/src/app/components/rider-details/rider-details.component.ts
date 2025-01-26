import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
declare var $: any;
@Component({
  selector: 'app-rider-details',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    CommonModule,
    FormsModule,  
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './rider-details.component.html',
  styleUrl: './rider-details.component.css'
})
export class RiderDetailsComponent implements AfterViewInit  {
 
  selectedValue: string = 'standard';
  pickupLocation:string='';
  destination:string='';



  rides = [
    {
      name: 'Standard',
      image: 'assets/img/icon/car_1_1.png',
      description: 'Sit venenatis ultricies interdum amet hendrerit nascetur.',
    },
    {
      name: 'Luxury',
      image: 'assets/img/icon/car_1_2.png',
      description: 'Ut arcu duis massa mauris purus id.',
    },
    {
      name: 'Vespa',
      image: 'assets/img/icon/car_1_3.png',
      description: 'Dis dolor pharetra aliquet vitae.',
    },
    {
      name: 'XL',
      image: 'assets/img/icon/car_1_4.png',
      description: 'Sit venenatis ultricies interdum amet hendrerit nascetur.',
    },
    {
      name: 'Scooter',
      image: 'assets/img/icon/car_1_5.png',
      description: 'Bibendum lectus posuere.',
    },
  ];

  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    arrows: true,
    infinite: true,
  };

  ngAfterViewInit() {
    $('#rideSlide').slick({
      slidesToShow: 3, // একবারে দেখানোর স্লাইড সংখ্যা
      slidesToScroll: 1, // স্ক্রল করার স্লাইড সংখ্যা
      infinite: true, // লুপ চালু
      dots: true, // নেভিগেশনের জন্য ডটস
      arrows: true, // আগের/পরের বোতাম
      autoplay: true, // অটোপ্লে চালু
      autoplaySpeed: 3000, // প্রতি ৩ সেকেন্ডে স্লাইড পরিবর্তন
      responsive: [
        {
          breakpoint: 768, // মোবাইল ডিভাইসের জন্য
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  }
}
