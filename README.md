# School Management System

A full-stack web application for managing school information built with React (Vite), Express.js, MySQL, and Cloudinary.

## Features

- **Add Schools**: Form with validation to add new schools
- **View Schools**: Display schools in a responsive grid layout
- **Search Functionality**: Search schools by name, city, or state
- **Image Upload**: Store school images using Cloudinary
- **Responsive Design**: Works on both desktop and mobile devices
- **Form Validation**: Client-side and server-side validation

## Tech Stack

### Frontend
- React 18 with Vite
- Bootstrap 5 & React Bootstrap
- React Hook Form for form handling
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express.js
- MySQL database (hosted on Railway)
- Cloudinary for image storage
- Multer for file uploads
- Express Validator for validation

## Project Structure

```
School Management/
├── backend/
│   ├── config/
│   │   ├── database.js       # Database configuration
│   │   └── cloudinary.js     # Cloudinary configuration
│   ├── controllers/
│   │   └── schoolController.js
│   ├── routes/
│   │   └── schoolRoutes.js
│   ├── uploads/              # Temporary file storage
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── server.js             # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navigation.jsx
│   │   ├── pages/
│   │   │   ├── AddSchool.jsx
│   │   │   └── ShowSchools.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                  # Frontend environment variables
│   ├── package.json
│   └── vite.config.js
└── package.json              # Root package for concurrent scripts
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Railway account (for MySQL database)
- Cloudinary account (for image storage)

### 1. Database Setup (Railway)

1. Sign up at [Railway.app](https://railway.app)
2. Create a new project
3. Add a MySQL service
4. Copy the connection details from the Railway dashboard

### 2. Cloudinary Setup

1. Sign up at [Cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from the dashboard

### 3. Environment Configuration

#### Backend Environment (backend/.env)
```env
# Environment Variables
PORT=5000

# MySQL Database Configuration (Railway)
# Copy the DATABASE_URL from your Railway MySQL service
DATABASE_URL=mysql://root:your_password@containers-us-west-150.railway.app:6543/railway

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

#### Frontend Environment (frontend/.env)
```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=School Management System
```

### 4. Installation and Running

#### Option 1: Run both frontend and backend together (Recommended)
```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend
npm run dev
```

#### Option 2: Run separately
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## API Endpoints

### Schools
- `GET /api/schools` - Get all schools (with pagination and search)
- `POST /api/schools` - Add a new school
- `GET /api/schools/:id` - Get school by ID
- `PUT /api/schools/:id` - Update school
- `DELETE /api/schools/:id` - Delete school

### Query Parameters for GET /api/schools
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term for name, city, or state

## Database Schema

### Schools Table
```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  contact VARCHAR(20) NOT NULL,
  image TEXT NOT NULL,
  email_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Form Validation

### Add School Form
- **Name**: Required, 2-100 characters
- **Address**: Required, 5-200 characters
- **City**: Required, 2-50 characters
- **State**: Required, 2-50 characters
- **Contact**: Required, exactly 10 digits
- **Email**: Required, valid email format
- **Image**: Required, image file (max 5MB)

## Features

### Frontend
- Responsive design using Bootstrap
- Form validation with react-hook-form
- Image preview before upload
- Search functionality with real-time results
- Pagination for large datasets
- Loading states and error handling

### Backend
- RESTful API design
- Input validation and sanitization
- Image upload to Cloudinary
- MySQL database with connection pooling
- Error handling and logging
- CORS configuration

## Development Scripts

### Root level
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run install-all` - Install all dependencies

### Backend
- `npm run dev` - Start with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

### Backend (Railway)
1. Push your code to GitHub
2. Connect Railway to your repository
3. Set environment variables in Railway dashboard
4. Deploy

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Update `VITE_API_URL` to your deployed backend URL

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify Railway MySQL connection string
   - Check if DATABASE_URL is correctly set

2. **Image Upload Fails**
   - Verify Cloudinary credentials
   - Check image file size (max 5MB)

3. **CORS Error**
   - Ensure FRONTEND_URL in backend .env matches your frontend URL

4. **Port Already in Use**
   - Change PORT in backend .env
   - Update VITE_API_URL in frontend .env

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
