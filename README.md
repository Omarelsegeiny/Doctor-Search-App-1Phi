# Doctor Search App - 1Phi FSD Challenge

A full-stack web application that helps patients find relevant healthcare providers using natural language search. Users can describe their needs in plain English (e.g., "I need a cardiologist who does ultrasounds near downtown Chicago"), and the system intelligently returns matching providers based on specialty, location, and performed procedures.

## 🌐 Live Application

- **Frontend**: [https://doctor-search-1phi.vercel.app/](https://doctor-search-1phi.vercel.app/)
- **Backend API**: [https://doctor-search-backend-jlby.onrender.com/](https://doctor-search-backend-jlby.onrender.com/)

## 🎯 Features

- **Natural Language Search**: Describe what you need in plain English
- **Intelligent Query Parsing**: Automatically extracts specialty, location, and procedures from queries
- **Smart Fallback**: Provides helpful suggestions when queries don't match specific providers
- **Fast Results**: Optimized database queries for quick response times
- **Responsive UI**: Clean, modern interface built with Material-UI
- **Comprehensive Testing**: 95%+ test coverage on both frontend and backend
- **Error Handling**: Graceful error handling with user-friendly messages

## 🛠️ Tech Stack

### Frontend

- **React** 19.2.1 - UI framework
- **Material-UI (MUI)** 7.3.6 - Component library
- **React Testing Library** - Component testing
- **Jest** - Test runner

### Backend

- **Node.js** - Runtime environment
- **Express** 5.2.1 - Web framework
- **MySQL2** 3.15.3 - Database driver
- **Jest** 30.2.0 - Test framework
- **Supertest** 7.1.4 - HTTP assertion library

### Database

- **MySQL** - Relational database (external data source)

### Deployment

- **Frontend**: Vercel
- **Backend**: Render

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher) or **yarn**
- **MySQL** database access (credentials required)
- **Git** (for cloning the repository)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Doctor-Search-App-1Phi-1
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=your_database_host
DB_PORT=database_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# Server Configuration
PORT=5001
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
# For local development
REACT_APP_API_URL=http://localhost:5001

# For production (already configured)
# REACT_APP_API_URL=https://doctor-search-backend-jlby.onrender.com
```

### 4. Running the Application

#### Development Mode

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5001`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

#### Production Build

**Backend:**

```bash
cd backend
npm start
# or
node src/index.js
```

**Frontend:**

```bash
cd frontend
npm run build
# Serve the build folder using a static file server
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Test Coverage:**

- 97.76% statement coverage
- 95.83% branch coverage
- 99.21% line coverage

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

**Test Coverage:**

- 96.09% statement coverage
- 92.68% branch coverage
- 95.9% line coverage

## 📁 Project Structure

```
Doctor-Search-App-1Phi-1/
├── backend/
│   ├── __tests__/           # Test files
│   │   ├── routes/          # Route tests
│   │   ├── services/        # Service layer tests
│   │   └── utils/           # Utility tests
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── db.js            # Database connection
│   │   └── index.js         # Application entry point
│   ├── jest.config.js       # Jest configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── __tests__/       # Test files
│   │   ├── components/      # React components
│   │   │   └── styled/      # Styled components
│   │   ├── utils/           # Utility functions
│   │   ├── App.js           # Main application component
│   │   └── setupTests.js    # Test configuration
│   └── package.json
│
└── README.md
```

## 🔌 API Documentation

### Base URL

**Production:**

```
https://doctor-search-backend-jlby.onrender.com/api
```

**Local Development:**

```
http://localhost:5001/api
```

### Endpoints

#### POST `/api/search`

Search for healthcare providers using natural language.

**Request Body:**

```json
{
  "query": "I need a cardiologist in Chicago",
  "limit": 12
}
```

**Parameters:**

- `query` (string, required): Natural language search query
- `limit` (number, optional): Maximum number of results (default: 12, max: 100)

**Success Response (200):**

```json
{
  "results": [
    {
      "npi": "1234567890",
      "first_name": "John",
      "last_name": "Doe",
      "specialty": "Cardiology",
      "city": "Chicago",
      "state": "IL",
      "zip": "60601"
    }
  ],
  "parsed": {
    "specialty": "Cardiology",
    "location": {
      "city": "Chicago",
      "state": "IL",
      "keyword": null
    },
    "procedures": []
  },
  "isFallback": false
}
```

**Fallback Response (200):**

```json
{
  "results": [...],
  "message": "We couldn't find any doctors matching your input. Try a specialty (like cardiology) or city.",
  "isFallback": true,
  "parsed": {...}
}
```

**Error Responses:**

- `400 Bad Request`: Missing or invalid query

  ```json
  {
    "error": "Query is required"
  }
  ```

- `500 Internal Server Error`: Server or database error
  ```json
  {
    "error": "Error message"
  }
  ```

#### GET `/`

Health check endpoint.

**Response (200):**

```json
{
  "status": "Backend is running"
}
```

**Try it:** [https://doctor-search-backend-jlby.onrender.com/](https://doctor-search-backend-jlby.onrender.com/)

## 🏗️ Architecture

### Backend Architecture

1. **Routes Layer** (`routes/`): Defines API endpoints
2. **Controllers Layer** (`controllers/`): Handles HTTP requests/responses
3. **Services Layer** (`services/`): Business logic and database queries
4. **Utils Layer** (`utils/`): Helper functions (query parsing, validation)

### Frontend Architecture

1. **Components**: Reusable UI components
2. **Utils**: Helper functions for API calls and data processing
3. **Styled Components**: Material-UI styled components
4. **State Management**: React hooks (useState, useMemo)

### Query Processing Flow

1. User enters natural language query
2. Frontend sends POST request to `/api/search`
3. Backend parses query using `queryParser` utility:
   - Extracts specialty (e.g., "cardiologist" → "Cardiology")
   - Extracts location (city, state)
   - Extracts procedures
4. Backend validates query (checks for gibberish, meaningful info)
5. If valid: searches database with filters
6. If invalid/gibberish: returns fallback results from popular specialties
7. Results returned to frontend and displayed

## 🔍 Query Parsing

The system supports various query formats:

- **Specialty-based**: "I need a cardiologist"
- **Location-based**: "Doctors in Chicago"
- **Combined**: "Cardiologist in Chicago Illinois"
- **With procedures**: "I need a cardiologist who does ultrasounds"
- **Natural language**: "I'm looking for a heart doctor near downtown"

### Supported Specialties

The parser recognizes common specialty terms:

- Cardiology (cardiologist, heart, cardiac)
- Dermatology (dermatologist, skin)
- Pediatrics (pediatrician, children, child)
- Orthopedic Surgery (orthopedic, orthopedist, bone)
- And many more...

### Supported Locations

- Major US cities (Chicago, New York, Los Angeles, etc.)
- US states (full names and abbreviations)
- Location keywords (near, in, at, around, downtown)

## 🚀 Deployment

### Frontend (Vercel)

The frontend is deployed on Vercel. The deployment automatically builds and serves the React application.

**Live URL:** [https://doctor-search-1phi.vercel.app/](https://doctor-search-1phi.vercel.app/)

### Backend (Render)

The backend is deployed on Render as a web service.

**Live URL:** [https://doctor-search-backend-jlby.onrender.com/](https://doctor-search-backend-jlby.onrender.com/)

**API Base URL:** `https://doctor-search-backend-jlby.onrender.com/api`

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error:**

- Verify database credentials in `.env`
- Ensure database server is running
- Check network connectivity

**Port Already in Use:**

- Change `PORT` in `.env` file
- Kill process using the port: `lsof -ti:5001 | xargs kill`

### Frontend Issues

**API Connection Error:**

- Verify `REACT_APP_API_URL` in `.env`
- Ensure backend server is running (or use production API URL)
- Check CORS settings in backend

**Build Errors:**

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### Deployment Issues

**Frontend not connecting to backend:**

- Verify `REACT_APP_API_URL` environment variable in Vercel
- Check CORS configuration in backend
- Verify backend is running and accessible

**Backend not responding:**

- Check Render service logs
- Verify database connection
- Check environment variables in Render dashboard

## 📝 Development Guidelines

### Code Style

- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and small

### Testing

- Write tests for new features
- Maintain test coverage above 90%
- Test edge cases and error scenarios
- Run tests before committing

### Git Workflow

1. Create a feature branch
2. Make changes and test
3. Commit with descriptive messages
4. Push and create pull request

## 📄 License

This project is part of the 1Phi FSD Challenge.

## 👤 Author

Created as part of the 1Phi Full Stack Developer Challenge.

---

**Note**: This application requires access to a MySQL database with provider information. The production deployment uses a configured database. For local development, ensure you have the necessary database credentials and permissions.
