# 🍔 Foodly - Full Stack Food Delivery Platform

Foodly is a comprehensive, production-ready food delivery management system featuring a modern React frontend and a robust Spring Boot backend integrated with PostgreSQL. It supports full role-based access control (RBAC) handling the end-to-end order lifecycle.

---

## 🛠️ Tech Stack

*   **Frontend**: React.js (v18), Lucide-React (Icons), Recharts (Analytics Data), React Router DOM
*   **Backend**: Java 17, Spring Boot 3, Spring Security 6 (JWT Authentication), Spring Data JPA
*   **Database**: PostgreSQL (Hosted on Render)
*   **Deployment**: Vercel (Frontend), Render (Backend & DB)

---

## 👥 User Roles & Features

1.  **👑 Admin**: Manage restaurants, delivery partners, view all orders, assign partners, and track global revenue.
2.  **🍽️ Restaurant Owner**: Manage menus (add/remove items), accept/reject incoming orders, and track restaurant-specific revenue and stats.
3.  **🚚 Delivery Partner**: Browse available local orders, accept deliveries, update live status (picked up, delivered), and track lifetime earnings.
4.  **🛒 Customer**: Browse restaurants, place orders, track order status in real-time.

*Note: All dashboards feature 10-second auto-polling, meaning new orders and status updates appear instantly without needing a manual page refresh.*

---

## 📁 Project Structure

```text
foodly-platform/
│
├── backend/                                   ← Spring Boot API
│   ├── pom.xml                                ← Maven dependencies
│   ├── Dockerfile                             ← Production container build instructions
│   └── src/main/java/com/foodly/
│       ├── FoodDeliveryApplication.java       ← Main Entry Point
│       ├── DataInitializer.java               ← Auto-seeds default users & menus on startup
│       ├── WebConfig.java                     ← Global CORS Configuration
│       ├── config/                            ← General configs
│       ├── security/                          ← JWT Auth, Filters, and Spring Security setup
│       ├── model/                             ← JPA Database Entities (Users, Orders, etc.)
│       ├── repository/                        ← Spring Data JPA Interfaces
│       ├── service/                           ← Business logic and RBAC checks
│       └── controller/                        ← REST API Endpoints (/api/*)
│
└── frontend/                                  ← React SPA
    ├── package.json                           ← Node dependencies
    ├── vercel.json                            ← Vercel deployment configuration
    ├── public/
    └── src/
        ├── App.js & App.css                   ← Main router and global styling system
        ├── components/                        ← Reusable UI (Sidebar, TrackingMap, etc.)
        ├── contexts/                          ← AuthContext.jsx (Global user state)
        ├── services/                          ← api.js (Axios instances and interceptors)
        └── pages/                             ← Role-specific Views:
            ├── AdminDashboard.jsx             ← Admin stats and overrides
            ├── RestaurantDashboard.jsx        ← Menu and order management
            ├── DeliveryDashboard.jsx          ← Delivery tracking and availability
            ├── CustomerHome.jsx               ← Restaurant browsing
            ├── OrdersPage.jsx                 ← Customer order tracking
            └── LoginPage.jsx & Register.jsx   ← Authentication UI
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
*   **Java 17+** & Maven
*   **Node.js 18+**
*   **PostgreSQL** (Local or Remote)

### 1. Backend Setup
1.  Navigate to `backend/`.
2.  Open `src/main/resources/application.properties`.
3.  Configure your PostgreSQL credentials. By default, it is configured to connect to a remote Render database. 
4.  Set up your JWT Secret in your environment or allow it to use the default.
5.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
6.  The backend server will start at `http://localhost:8080`.

### 2. Frontend Setup
1.  Navigate to `frontend/`.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file (optional) to point to your backend:
    ```env
    REACT_APP_API_URL=http://localhost:8080
    ```
4.  Run the dev server:
    ```bash
    npm start
    ```
5.  The application will be available at `http://localhost:3000`.

---

## 🔒 Default Logins (Test Data)

When the backend runs for the first time, `DataInitializer.java` automatically creates these accounts for you to test the platform.

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` |
| **Restaurant** | `pizza_palace` | `rest123` |
| **Delivery** | `john_doe` | `del123` |
| **Customer** | `jane_smith` | `user123` |

---

## ☁️ Deployment Guides

### Backend (Render)
1. Create a **Web Service** on Render pointing to your `backend/` directory.
2. Ensure the build command is `mvn clean install -DskipTests` (or use the provided Dockerfile).
3. Set the Environment Variables: `JWT_SECRET`, `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`.

### Frontend (Vercel)
1. Import your repository into Vercel.
2. Set the Root Directory to `frontend`.
3. Add the Environment Variable `REACT_APP_API_URL` pointing to your live Render backend URL.
4. Deploy!
