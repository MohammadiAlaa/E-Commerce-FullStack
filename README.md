# 🛒 E-Commerce Full-Stack Solution

A comprehensive, enterprise-level E-Commerce platform built with a modern **Angular** frontend and a robust **.NET Core Web API** backend.

---

## 🏗️ Architectural Patterns (Backend)

To ensure scalability, clean code, and maintainability, the API follows professional design patterns:

- **Generic Repository Pattern**: Centralizes data logic and minimizes code duplication across different entities.
- **Unit of Work**: Manages transactions and ensures that multiple repository operations share a single database context for data integrity.
- **DTOs (Data Transfer Objects)**: Used for secure and efficient data mapping between the API and the client, protecting sensitive internal models.

## 👥 User Roles & Permissions

The system features a multi-role architecture with dedicated workflows:

- **Admin**: Full access to the dashboard, managing products, categories, monitoring all orders, and managing user accounts.
- **Driver**: Dedicated interface to view assigned deliveries and update order status (e.g., Shipped, Delivered).
- **Customer**: Can browse products, manage a dynamic shopping cart, place orders, and track order history.

## ✨ Key Features

- **Secure Authentication**: Identity management with JWT (JSON Web Tokens).
- **Product Management**: Full CRUD operations with image upload support.
- **Order Lifecycle**: From checkout and payment to delivery tracking.
- **Advanced UI**: Built with Angular 17+, featuring Route Guards and HTTP Interceptors for security.

## 🚀 Tech Stack

- **Frontend**: Angular, Bootstrap 5, SweetAlert2, Reactive Forms.
- **Backend**: .NET 8 Web API, ASP.NET Core Identity, Entity Framework Core.
- **Database**: SQL Server.

---

## 🛠️ Setup & Installation

### 1. Backend (API)

1. Navigate to `E-CommerceApi/E-CommerceApi`.
2. Open `appsettings.json` (or use `appsettings.Example.json` as a template).
3. Update your **Connection String**.
4. Run migrations: `dotnet ef database update`.
5. Start the API: `dotnet run`.

### 2. Frontend (UI)

1. Navigate to `E-CommerceUi`.
2. Install dependencies: `npm install`.
3. Run the application: `ng serve`.
4. Access the app at `http://localhost:4200`.

---

## 👤 Author

**Mohammadi Alaa** - _Full Stack .Net (Angular) Developer_
