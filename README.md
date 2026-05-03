# 🍔 Foodly - Full Stack Food Delivery Platform
### React + Spring Boot + PostgreSQL (Render)
**DBMS Mini Project | Role-Based Access Control**

---

## 📁 PROJECT OVERVIEW
Foodly is a comprehensive 4-role food delivery management system designed to handle the end-to-end order lifecycle. It features a modern React frontend and a robust Spring Boot backend integrated with a cloud-hosted PostgreSQL database.

### 👥 User Roles
1.  **Admin**: Manage restaurants, delivery partners, orders, and system-wide statistics.
2.  **Restaurant Owner**: Manage menus, accept/reject incoming orders, and track business performance.
3.  **Delivery Partner**: Accept deliveries, update real-time tracking, and track earnings.
4.  **Customer**: Browse restaurants, place orders, apply coupons, and track delivery status.

---

## 🏗️ PROJECT STRUCTURE

```
foodly-platform/
│
├── backend/                        ← Spring Boot (Java 17)
│   ├── pom.xml                     ← Maven dependencies
│   └── src/main/java/com/foodly/
│       ├── FoodDeliveryApplication.java    ← Main entry point
│       ├── model/                  ← Entity classes
│       ├── repository/             ← Spring Data JPA (PostgreSQL)
│       ├── service/                ← Business logic
│       └── controller/             ← REST API endpoints
│
├── frontend/                       ← React (JavaScript)
│   ├── src/
│   │   ├── pages/                  ← Role-specific dashboards
│   │   ├── components/             ← Reusable UI elements
│   │   ├── services/               ← API integration (Axios)
│   │   └── contexts/               ← Auth & State Management
│   └── vercel.json                 ← Deployment config
```

---

## 🚀 GETTING STARTED

### 1. Prerequisites
*   **Java 17+** & Maven
*   **Node.js 18+**
*   **PostgreSQL** (Local or Remote)

### 2. Backend Setup
1.  Navigate to `backend/`.
2.  Configure `src/main/resources/application.properties` with your PostgreSQL credentials.
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
4.  The server starts at `http://localhost:8080`.

### 3. Frontend Setup
1.  Navigate to `frontend/`.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the dev server:
    ```bash
    npm start
    ```
4.  The application will be available at `http://localhost:3000`.

---

## 🔒 AUTHENTICATION & LOGIN
The system uses JWT-based authentication. Use the following default credentials for testing:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` |
| **Restaurant** | `pizza_palace` | `rest123` |
| **Delivery** | `john_doe` | `del123` |
| **Customer** | `jane_smith` | `user123` |

---

## 🛠️ KEY FEATURES
*   **Role-Based Dashboards**: Custom UI for Admin, Restaurants, and Delivery Partners.
*   **Order Lifecycle**: Placed -> Accepted -> Assigned -> Picked Up -> Delivered.
*   **Cloud Integration**: Fully configured for Render PostgreSQL.
*   **Responsive UI**: Premium design with smooth animations and dark-mode aesthetics.
*   **Security**: Restricted status updates and data isolation per restaurant/partner.

---
**Developed by:** Partha Sarathi Mistri | Aditya Srivastava | SRMIST
