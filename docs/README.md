# IndoCafe - SaaS Restaurant Management System

## 📖 Project Abstract

**IndoCafe** is a scalable, cloud-native Restaurant Management System (RMS) designed for a hybrid business model. It unifies operations for **Cloud Kitchens**, **Dine-in Restaurants**, and **Delivery Services** under a single platform. The system is built to handle multiple geographically distributed outlets with ease, offering a centralized management console while retaining local autonomy for outlet operations.

## 🏗 Architecture

The project follows a **Multi-Tenant w/ Single Database** architecture:

- **Logical Partitioning**: All data resides in a single MongoDB cluster but is logically separated by `outletId`. This ensures data isolation while maintaining easy aggregation for super-admin reporting.
- **API-First Design**: The backend is decoupled from the frontend, exposing RESTful endpoints. This aligns with our future roadmap to build a native Android app (Kotlin) without rewriting backend logic.
- **Config-Driven UI**: The frontend uses a white-label architecture where UI elements and themes can be dynamically configured per outlet/brand.

## 💻 Tech Stack

### Frontend

- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS (with config-driven theming)
- **State Management**: Context API
- **Routing**: React Router DOM

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT with Hierarchical RBAC (Role-Based Access Control)
- **Validation**: Joi / express-validator

### DevOps & Infrastructure

- **Containerization**: Docker
- **Backend Hosting**: Render
- **Frontend Hosting**: Vercel
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas URI)
- Docker (Optional)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/your-org/indocafe.git
    cd indocafe
    ```

2.  **Setup Server**

    ```bash
    cd server
    npm install
    cp .env.example .env
    # Update .env with your MongoDB URI
    npm run dev
    ```

3.  **Setup Client**
    ```bash
    cd client
    npm install
    npm run dev
    ```

### Documentation Index

- [Development Roadmap & Logs](./PHASES_AND_LOGS.md)
- **Role Guides**:
  - [Admin / Owner](./roles/ADMIN.md)
  - [Manager](./roles/MANAGER.md)
  - [Kitchen Staff](./roles/STAFF_KITCHEN.md)
  - [Waiter](./roles/STAFF_WAITER.md)
  - [Customer](./roles/CUSTOMER.md)
