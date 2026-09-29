# PhotoHub .NET Backend (ASP.NET Core 8 Web API)

This is a complete, production-ready backend template built with **.NET 8.0**, **ASP.NET Core Web API**, and **Entity Framework Core (MySQL)**, designed to serve as the backend for the PhotoHub frontend application.

## 🚀 Features & Endpoints Implemented
- **GET** `/api/photographers` (Supports filtering by `?category=`, `?location=`, `?search=`)
- **GET** `/api/photographers/{id}`
- **POST** `/api/photographers`
- **PUT** `/api/photographers/{id}`
- **PATCH** `/api/photographers/{id}/verify`
- **DELETE** `/api/photographers/{id}`
- Full CORS and Swagger UI integration (`/swagger`) allowing cross-origin requests from your frontend (`http://localhost:5173`).

## 🛠️ Prerequisites
- **.NET 8.0 SDK** or higher
- **Visual Studio 2022**, **JetBrains Rider**, or **VS Code** (with C# Dev Kit)
- **MySQL Server** running locally

## ⚙️ Configuration
Open `appsettings.json` and update your MySQL database connection string:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Port=3306;Database=photohub_db;User=root;Password=your_password;"
}
```

## ▶️ How to Run
Run from terminal in this directory:
```bash
dotnet restore
dotnet run
```
Once running, navigate to `http://localhost:5000/swagger` in your browser to test endpoints interactively!
