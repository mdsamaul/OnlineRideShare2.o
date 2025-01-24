import { AfterViewInit, Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard-all-list',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-all-list.component.html',
  styleUrl: './dashboard-all-list.component.css'
})
export class DashboardAllListComponent implements AfterViewInit {
  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.createRideStatusChart();
    this.createDriverStatsChart();
    this.createMonthlyRevenueChart();  
    this.createDriverRatingChart();  
  }
  

  // Ride Status Line Chart
  createRideStatusChart() {
    const ctx1 = document.getElementById('rideStatusChart') as HTMLCanvasElement;
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Completed Rides',
            data: [10, 20, 30, 40, 150, 120, 80, 90, 100, 120, 140, 160],
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
          },
          {
            label: 'Cancelled Rides',
            data: [5, 10, 15, 20, 25, 10, 5, 8, 12, 15, 10, 5],
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 160,
            title: {
              display: true,
              text: 'Number of Rides'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        }
      }
    });
  }

  // Driver Statistics Doughnut Chart
  createDriverStatsChart() {
    const ctx2 = document.getElementById('driverStatsChart') as HTMLCanvasElement;
    new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Approved', 'Unapproved'],
        datasets: [
          {
            label: 'Driver Status',
            data: [246, 20],
            backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem: any) {
                return tooltipItem.label + ': ' + tooltipItem.raw;
              }
            }
          }
        }
      },
    });
  }

  // Monthly Revenue Bar Chart (New)
  createMonthlyRevenueChart() {
    const ctx3 = document.getElementById('monthlyRevenueChart') as HTMLCanvasElement;
    new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Monthly Revenue',
            data: [500, 700, 600, 800, 1200, 1500, 1300, 1100, 1500, 1700, 1600, 1800],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue in USD'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        }
      }
    });
  }

  createDriverRatingChart() {
    const ctx5 = document.getElementById('driverRatingChart') as HTMLCanvasElement;
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
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Drivers'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Driver Ratings'
            }
          }
        }
      }
    });
  }
  
}
