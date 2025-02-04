import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-all-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-all-list.component.html',
  styleUrl: './dashboard-all-list.component.css',
})
export class DashboardAllListComponent implements AfterViewInit, OnInit {
  successRide: number = 0;
  authService = inject(AuthService);
  constructor() {
    Chart.register(...registerables);
  }

  allDrivers$: any[] = [];
  allCustomers$: any[] = [];
  completeRide$: any;
  Cancelled$: any;
  totalFare$: any;
  driver$: any;
  customer$: any;
  ngOnInit(): void {
    if (this.authService.getUserDetail()?.roles == 'Admin') {
      console.log('admin');
    }
    this.authService.getDrivers().subscribe({
      next: (allDriver) => {
        this.allDrivers$ = allDriver;
        allDriver.forEach((driver) => {
          if (this.authService.getUserDetail()?.id == driver.userId) {
            console.log(driver);
            this.driver$ = driver;
          }
        });
      },
    });
    this.authService.getAllCustomer().subscribe({
      next: (resAllCustomer) => {
        // console.log(res);
        this.allCustomers$ = resAllCustomer;
        resAllCustomer.forEach((customer) => {
          if (this.authService.getUserDetail()?.id == customer.userId) {
            console.log(customer);
            this.customer$ = customer;
          }
        });
      },
    });
    this.allRideBook();
  }

  allRideBook(): void {
    this.authService.getAllRidebookRequest().subscribe((allRideBooks) => {
      if (this.authService.getUserDetail()?.roles == 'Driver') {
        this.completeRide$ = allRideBooks.filter(
          (ridebook: any) =>
            ridebook.driverId == this.driver$.driverId &&
            ridebook.requestStatus == 'Pickup Confirmed'
        );
        this.Cancelled$ = allRideBooks.filter(
          (ridebook: any) =>
            ridebook.driverId == this.driver$.driverId &&
            ridebook.requestStatus == 'Cancelled'
        );

        this.authService.getAllRidebook().subscribe((resRidebook) => {
          console.log(resRidebook);
          let ridebook$ = resRidebook.filter(
            (ridebook: any) =>
              ridebook.userId == this.authService.getUserDetail()?.id
          );
          let totalFare = ridebook$.reduce((total: number, element: any) => {
            return total + (element.totalFare || 0); 
          }, 0); 
          this.totalFare$ = totalFare;
          console.log(this.totalFare$);
        });
        this.createDriverStatsChart(this.completeRide$.length, this.Cancelled$.length);
      } else if (this.authService.getUserDetail()?.roles == 'Rider') {
        this.completeRide$ = allRideBooks.filter(
          (ridebook: any) =>
            ridebook.userId == this.customer$.userId &&
            ridebook.requestStatus == 'Pickup Confirmed'
        );
        this.Cancelled$ = allRideBooks.filter(
          (ridebook: any) =>
            ridebook.userId == this.authService.getUserDetail()?.id &&
            ridebook.requestStatus == 'Cancelled'
        );

        this.authService.getAllRidebook().subscribe((resRidebook) => {
          console.log(resRidebook);
          let ridebook$ = resRidebook.filter(
            (ridebook: any) =>
              ridebook.customerId == this.customer$.customerId
          );
          console.log(ridebook$);
          let totalFare = ridebook$.reduce((total: number, element: any) => {
            return total + (element.totalFare || 0); 
          }, 0);
          console.log(totalFare)
          this.totalFare$ = totalFare;
        });


        this.createDriverStatsChart(this.completeRide$.length, this.Cancelled$.length);

      }else{
        this.completeRide$ = allRideBooks.filter(
          (ridebook: any) =>
            ridebook.requestStatus == 'Pickup Confirmed'
        );
        this.Cancelled$ = allRideBooks.filter(
          (ridebook: any) =>
            ridebook.requestStatus == 'Cancelled'
        );

        this.authService.getAllRidebook().subscribe((resRidebook) => {
          console.log(resRidebook);
        
          let totalFare = resRidebook.reduce((total: number, element: any) => {
            return total + (element.totalFare || 0);
          }, 0);
          console.log(totalFare)
          this.totalFare$ = totalFare;
        });
        this.createDriverStatsChart(this.completeRide$.length, this.Cancelled$.length);

      }

    });
  }



  ngAfterViewInit(): void {
    this.createRideStatusChart();
    this.createMonthlyRevenueChart();
    this.createDriverRatingChart();
  }

  // Ride Status Line Chart
  createRideStatusChart() {
    const ctx1 = document.getElementById(
      'rideStatusChart'
    ) as HTMLCanvasElement;
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Completed Rides',
            data: [10, 20, 30, 40, 150, 120, 80, 90, 100, 120, 140, 160],
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
          },
          {
            label: 'Cancelled Rides',
            data: [5, 10, 15, 20, 25, 10, 5, 8, 12, 15, 10, 5],
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 160,
            title: {
              display: true,
              text: 'Number of Rides',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Month',
            },
          },
        },
      },
    });
  }

  // Driver Statistics Doughnut Chart
  createDriverStatsChart(complete : any, cancelled: any) {   
    console.log(complete)
    const ctx2 = document.getElementById(
      'driverStatsChart'
    ) as HTMLCanvasElement;
    new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Confirmed', 'Canceled'],
        datasets: [
          {
            label: 'Driver Status',
            data: [complete,cancelled],
            backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem: any) {
                return tooltipItem.label + ': ' + tooltipItem.raw;
              },
            },
          },
        },
      },
    });
  }

  // Monthly Revenue Bar Chart (New)
  createMonthlyRevenueChart() {
    const ctx3 = document.getElementById(
      'monthlyRevenueChart'
    ) as HTMLCanvasElement;
    new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Monthly Revenue',
            data: [
              500, 700, 600, 800, 1200, 1500, 1300, 1100, 1500, 1700, 1600,
              1800,
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue in USD',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Month',
            },
          },
        },
      },
    });
  }

  createDriverRatingChart() {
    const ctx5 = document.getElementById(
      'driverRatingChart'
    ) as HTMLCanvasElement;
    new Chart(ctx5, {
      type: 'bar',
      data: {
        labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
        datasets: [
          {
            label: 'Number of Drivers',
            data: [5, 12, 25, 50, 80], // Example data for the number of drivers with each rating
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Drivers',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Driver Ratings',
            },
          },
        },
      },
    });
  }
}
