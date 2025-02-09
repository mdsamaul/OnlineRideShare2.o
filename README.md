
# Online Ride-Sharing Project

## Overview
This document provides an overview of the technologies used in the development of the Online Ride-Sharing Project. The project is built using **ASP.NET Web API** for the backend and **Angular** for the frontend.

---

## Technologies Used

### Backend Technologies
- **ASP.NET Web API** - Used for building RESTful web services.
- **C#** - Primary programming language for backend development.
- **Entity Framework Core** - ORM for database interaction.
- **SQL Server** - Database management system.
- **Identity Framework** - Used for authentication and authorization.
- **JWT (JSON Web Token)** - Used for securing API endpoints.
- **Swagger** - API documentation and testing tool.
- **MailKit (4.10.0)** - Used for sending emails.
- **Microsoft.AspNetCore.Authentication.JwtBearer (8.0.1)** - Middleware for JWT authentication.
- **Microsoft.AspNetCore.Identity.EntityFrameworkCore (8.0.1)** - Integration of Identity with Entity Framework Core.
- **Microsoft.EntityFrameworkCore.Design (8.0.1)** - Design-time tools for Entity Framework Core.
- **Microsoft.EntityFrameworkCore.Sqlite (8.0.1)** - SQLite provider for Entity Framework Core.
- **Microsoft.EntityFrameworkCore.SqlServer (8.0.1)** - SQL Server provider for Entity Framework Core.
- **Microsoft.EntityFrameworkCore.Tools (8.0.1)** - Tools for managing migrations and updates in Entity Framework Core.
- **Microsoft.VisualStudio.Web.CodeGeneration.Design (8.0.7)** - Scaffolding tools for ASP.NET Core.
- **RestSharp (110.2.0)** - Library for RESTful API consumption.
- **Swashbuckle.AspNetCore (6.6.2)** - Used for generating Swagger documentation.

### Frontend Technologies
- **Angular** - Frontend framework for building dynamic web applications.
- **TypeScript** - Primary language used in Angular development.
- **HTML5** - Markup language for structuring web pages.
- **CSS3** - Styling for frontend UI.
- **Bootstrap/Tailwind CSS** - Used for responsive and modern UI design.
- **Angular Material** - UI component library for Angular.
- **Chart.js (4.4.7)** - Library for interactive charts and graphs.
- **Express (4.18.2)** - Backend framework used for SSR (Server-Side Rendering).
- **HTML2Canvas (1.4.1)** - Used for capturing screenshots of HTML content.
- **jQuery (3.7.1)** - JavaScript library for DOM manipulation.
- **jsPDF (2.5.2)** - Library for generating PDF documents.
- **jsPDF-AutoTable (3.8.4)** - Plugin for creating table-based PDFs.
- **JWT-Decode (4.0.0)** - Library for decoding JSON Web Tokens.
- **Leaflet (1.9.4)** - Interactive map library.
- **Leaflet Routing Machine (3.2.12)** - Plugin for route planning with Leaflet.
- **ngx-toastr (19.0.0)** - Angular library for toast notifications.
- **RxJS (~7.8.0)** - Reactive programming library for asynchronous data streams.
- **Slick Carousel (1.8.1)** - Library for creating responsive carousels.
- **TailwindCSS (3.4.17)** - Utility-first CSS framework for styling.
- **Zone.js (~0.14.3)** - Angular library for managing asynchronous operations.

### DevDependencies
- **@angular-devkit/build-angular (17.3.11)** - Build tools for Angular.
- **@angular/cli (17.3.11)** - Angular command-line interface.
- **@angular/compiler-cli (17.3.0)** - Compiler CLI for Angular.
- **@types/express (4.17.17)** - Type definitions for Express.
- **@types/jasmine (~5.1.0)** - Type definitions for Jasmine.
- **@types/jquery (3.5.32)** - Type definitions for jQuery.
- **@types/leaflet (1.9.16)** - Type definitions for Leaflet.
- **@types/leaflet-routing-machine (3.2.8)** - Type definitions for Leaflet Routing Machine.
- **@types/node (18.18.0)** - Type definitions for Node.js.
- **@types/slick-carousel (1.6.40)** - Type definitions for Slick Carousel.
- **Autoprefixer (10.4.20)** - PostCSS plugin for adding vendor prefixes.
- **Jasmine-Core (~5.1.0)** - Testing framework for Angular.
- **Karma (~6.4.0)** - Test runner for Angular.
- **Karma-Chrome-Launcher (~3.2.0)** - Karma plugin for running tests in Chrome.
- **Karma-Coverage (~2.2.0)** - Code coverage reporter for Karma.
- **Karma-Jasmine (~5.1.0)** - Jasmine plugin for Karma.
- **Karma-Jasmine-HTML-Reporter (~2.1.0)** - HTML reporter for Karma-Jasmine.
- **PostCSS (8.4.49)** - CSS processing tool.
- **TypeScript (~5.4.2)** - Type definitions and transpiler for Angular.

---

## Installation
---
## Getting Started

1. *Clone the repository:*  
   bash
 git clone https://github.com/mdsamaul/OnlineRideShare2.o
   

2. *Navigate to the project directory:*  
   bash
   cd OnlineRideShareApi
   

3. *Setup Backend:*  
   - Navigate to the API folder and run:
     bash
     dotnet restore
     dotnet run
     

4. *Setup Frontend:*  
   - Navigate to the Angular project folder and run:
     bash
     npm install
     ng serve
     

5. *Access the Application:*  
   Open your browser and go to http://localhost:4200 for the frontend and http://localhost:5000/swagger for API documentation.

---
   

## Conclusion
This documentation provides an outline of the technologies implemented in the Online Ride-Sharing Project. The combination of **ASP.NET Web API** and **Angular** ensures a scalable, secure, and high-performance application.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Contact
For further information or inquiries, please contact [mdsamaul843@gmail.com](mailto:mdsamaul843@gmail.com).

