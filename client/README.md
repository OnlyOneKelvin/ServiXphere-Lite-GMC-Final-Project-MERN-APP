# ServiXphere Lite 🚀

ServiXphere Lite is a modern full-stack service marketplace platform that connects users with trusted and verified service professionals across multiple categories including Home Services, Technology, Beauty & Wellness, and Automobile Services.

The platform is designed to make finding skilled professionals fast, reliable, and secure.

---

## ✨ Features

### 👥 Users
- Browse service categories
- View verified service providers
- Book services easily
- Leave ratings and reviews
- Secure authentication (JWT)

### 🧑‍🔧 Service Providers
- Profile management
- Service listings
- Booking management
- Ratings & reviews visibility

### 🛠️ Admin
- Manage categories
- Manage services
- Manage providers
- View all bookings
- Platform statistics dashboard

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- Context API (Auth)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- REST API

---

## 📁 Project Structure

ServiXphere-Lite/
│
├── client/ # Frontend (React + Vite)
│ ├── src/
│ ├── package.json
│ └── vite.config.js
│
├── server/ # Backend (Node + Express)
│ ├── src/
│ ├── package.json
│ └── .env.example
│
├── .gitignore
└── README.md

yaml
Copy code

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

shell
Copy code

### Frontend (`client/.env`)
VITE_API_BASE_URL=http://localhost:5000/api/v1

yaml
Copy code

---

## 🚀 Getting Started (Local Development)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/ServiXphere-Lite.git
cd ServiXphere-Lite
2️⃣ Backend setup
bash
Copy code
cd server
npm install
npm run seed     # Seed initial data (categories, admin user)
npm run dev
Backend runs on:
👉 http://localhost:5000

3️⃣ Frontend setup
bash
Copy code
cd ../client
npm install
npm run dev
Frontend runs on:
👉 http://localhost:3000

🔐 Default Test Accounts (after seeding)
Admin

makefile
Copy code
Email: admin@servixphere.com
Password: admin123
User

makefile
Copy code
Email: john@example.com
Password: user123
📌 Core Highlights
Responsive modern UI

Clean component architecture

Secure API communication

Role-based access control

Scalable service-oriented design

🧠 Vision
ServiXphere is built to scale into a trusted digital infrastructure for service discovery and booking in emerging markets, starting with Nigeria.

📄 License
This project is for educational and startup development purposes.
All rights reserved.

👤 Author
Kelvin Marcus
Founder — ServiXphere / ZEK Africa