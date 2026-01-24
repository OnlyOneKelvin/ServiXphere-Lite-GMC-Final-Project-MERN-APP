# ServiXphere Lite - Frontend

React frontend for the ServiXphere Lite service marketplace application.

## Features

- **Public Pages:**
  - Home page with service categories
  - Browse services (filterable by category)
  - Browse service providers (filterable by service)
  - View provider profiles with ratings and reviews
  - User authentication (Login/Signup)

- **User Features:**
  - Book services from providers
  - Submit anonymous reviews
  - View and manage personal bookings
  - Update booking status

- **Admin Features:**
  - Admin dashboard with statistics
  - CRUD operations for categories
  - CRUD operations for services
  - CRUD operations for service providers
  - View all bookings

## Tech Stack

- React 18
- React Router v6
- Axios for API calls
- Context API for state management
- Tailwind CSS for styling
- Vite as build tool

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   - Copy `.env.example` to `.env`
   - Update `VITE_API_BASE_URL` if your backend runs on a different port
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

4. **Build for Production:**
   ```bash
   npm run build
   ```

5. **Preview Production Build:**
   ```bash
   npm run preview
   ```

## Project Structure

```
client/
├── src/
│   ├── api/              # API service functions
│   │   ├── axios.js      # Axios instance with interceptors
│   │   ├── auth.js       # Authentication API calls
│   │   └── services.js   # All other API calls
│   ├── components/       # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Loading.jsx
│   │   └── Alert.jsx
│   ├── context/          # React Context providers
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── Providers.jsx
│   │   ├── ProviderProfile.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── UserDashboard.jsx
│   │   └── admin/        # Admin pages
│   ├── routes/           # Route protection
│   │   └── ProtectedRoute.jsx
│   ├── styles/           # CSS files
│   │   └── index.css
│   ├── config.js         # Configuration
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── .env.example
├── package.json
└── vite.config.js
```

## Authentication Flow

1. User registers/logs in through the auth pages
2. JWT token is stored in localStorage
3. AuthContext manages authentication state
4. Protected routes check authentication status
5. Axios interceptor adds token to all API requests
6. On 401 errors, user is automatically logged out

## API Integration

All API calls are made through centralized service functions in `src/api/`. The Axios instance automatically:
- Adds the base URL
- Includes JWT token in headers
- Handles authentication errors
- Manages request/response interceptors

## Protected Routes

- **User Routes:** Require authentication (any logged-in user)
- **Admin Routes:** Require authentication + admin role

Routes are protected using the `ProtectedRoute` component which checks:
- Authentication status
- User role (for admin routes)

## Default Credentials

After seeding the backend database, you can use:

**Admin:**
- Email: `admin@servixphere.com`
- Password: `admin123`

**Regular User:**
- Email: `john@example.com`
- Password: `user123`

## Notes

- Ensure the backend server is running before starting the frontend
- CORS is configured in the backend to allow requests from `http://localhost:3000`
- The app uses Tailwind CSS for styling - all components are responsive
- Error handling is implemented throughout with user-friendly error messages
