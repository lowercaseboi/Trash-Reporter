# Trash Reporter - Full-Stack Community Reporting App

A full-stack web application designed for the general public to report, track, and visualize local trash-dumping issues. This web application features a complete user-facing site and a separate, secure admin panel for issue management and resolution.

This project is built with two main, separate parts that run concurrently:
1.  **User Application** (`/Backend` + `/Frontend`): The public-facing website where users can sign up, log in, and submit reports.
2.  **Admin Application** (`/Admin/AdminBackend` + `/Admin/AdminFrontend`): A separate, secure portal for administrators to manage and resolve the reports.

## Key Features

* **Developed** a secure **MERN-stack** (MongoDB, Express, Node.js) backend with a RESTful API to manage user, admin, and report data in MongoDB collections.
* **Implemented** robust user authentication and session management using **JSON Web Tokens (JWT)** and **bcryptjs** for password hashing.
* **Engineered** a client-side reporting feature using the **Media API** for live camera access and **HTML Canvas** to capture and apply a live timestamp to the image proof.
* **Integrated** the **Geolocation API** and **Leaflet.js** to capture precise user coordinates and display all complaint locations on an interactive map.
* **Built** a separate, secure admin dashboard where officials can review uploaded reports, view evidence, and update complaint statuses (e.g., Pending, In Progress, Resolved).

## Technology Stack

### Backend (User & Admin)
* **Node.js**
* **Express.js**: For routing and API creation.
* **MongoDB (Mongoose)**: As the primary database for users and complaints.
* **JSON Web Tokens (JWT)**: For secure, token-based authentication.
* **bcryptjs**: For hashing user and admin passwords.
* **Multer**: For handling `multipart/form-data` and image uploads.
* **CORS**: For managing cross-origin requests between servers.
* **Dotenv**: For managing environment variables.

### Frontend (User & Admin)
* **HTML5**
* **CSS3**: (Flexbox, Grid, and modern UI enhancements).
* **Vanilla JavaScript (ES6+)**: For all client-side logic, API calls, and dynamic content.
* **Leaflet.js**: For interactive map integration.
* **Browser APIs**: `fetch` (for API calls), `navigator.geolocation` (Location), `navigator.mediaDevices` (Camera), `HTML Canvas API`.

---

## How to Run

This project consists of two separate servers that must be run simultaneously in two different terminals.

### Prerequisites

* **Node.js** and **npm** installed.
* **MongoDB** (local instance or a cloud URI from MongoDB Atlas).

### Server 1: Main User Application (Port 5000)

1.  **Navigate to the main backend directory:**
    ```bash
    cd "Trash Reporter/Backend"
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `Trash Reporter/Backend` directory. Add the following variables (use `generatekey.js` to create a key):
    ```.env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_long_random_secret_key_for_users
    ```

4.  **Start the server:**
    ```bash
    node server.js
    ```
    *This server will run on `http://localhost:5000` and also serve the main frontend.*

### Server 2: Admin Panel (Port 5001)

1.  **Open a new terminal** and navigate to the admin backend:
    ```bash
    cd "Trash Reporter/Admin/AdminBackend"
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `Trash Reporter/Admin/AdminBackend` directory. Add the following variables (use *different* keys):
    ```.env
    MONGODB_URI=your_mongodb_connection_string (can be the same as Server 1)
    JWT_SECRET=your_DIFFERENT_long_random_secret_key_for_admins
    ```

4.  **Seed the Admin Database** (One-time setup):
    This script creates the initial admin accounts specified in `seedAdmin.js`.
    ```bash
    node seedAdmin.js
    ```

5.  **Start the admin server:**
    ```bash
    node server.js
    ```
    *This server will run on `http://localhost:5001`.*

---

## Accessing the Application

* **Main User Website:** [http://localhost:5000](http://localhost:5000)
* **Admin Login Page:** [http://localhost:5001/login](http://localhost:5001/login)