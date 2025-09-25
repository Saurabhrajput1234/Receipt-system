# Subh Sankalp Estate Receipt Management System

A complete full-stack application for managing real estate receipts with React + Vite frontend and Node.js + SQL Server backend.

## Project Structure

```
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx    # Main receipt form component
│   │   ├── App.css    # Vanilla CSS styling
│   │   └── ...
│   ├── package.json
│   └── README.md
├── backend/            # Node.js + Express backend
│   ├── config/        # Database configuration
│   ├── models/        # Data models
│   ├── routes/        # API routes
│   ├── database/      # SQL scripts
│   ├── server.js      # Main server file
│   ├── package.json
│   └── README.md
└── README.md          # This file
```

## Features

### Frontend
- **Digital Receipt Form**: Exact replica of physical receipt
- **Real-time Form Handling**: React state management
- **Print Functionality**: Generate printable receipts
- **Responsive Design**: Works on all devices
- **Clean Vanilla CSS**: Professional document appearance

### Backend
- **RESTful API**: Express.js with proper error handling
- **SQL Server Integration**: Full CRUD operations
- **Data Validation**: Input validation and type conversion
- **Auto Table Creation**: Database setup automation
- **CORS Support**: Frontend-backend communication

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
# Configure .env file with your SQL Server credentials
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Database Setup
- Install SQL Server
- Run the setup script: `backend/database/setup.sql`
- Update database credentials in `backend/.env`

## API Endpoints

- `POST /api/receipts` - Create new receipt
- `GET /api/receipts` - Get all receipts
- `GET /api/receipts/:id` - Get specific receipt
- `GET /api/health` - Server health check

## Technology Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Vanilla CSS** - Styling (no frameworks)
- **ESLint** - Code linting

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **mssql** - SQL Server driver
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Database
- **SQL Server** - Primary database
- **Auto-generated tables** - Receipt storage schema

## Development

### Frontend Development
```bash
cd frontend
npm run dev    # Start dev server on port 3000
npm run build  # Build for production
npm run lint   # Run linting
```

### Backend Development
```bash
cd backend
npm run dev    # Start with nodemon (auto-restart)
npm start      # Start production server
```

## Configuration

### Frontend (vite.config.js)
- Development server on port 3000
- API proxy to backend on port 5000

### Backend (.env)
```env
PORT=5000
DB_SERVER=localhost
DB_DATABASE=ReceiptDB
DB_USER=sa
DB_PASSWORD=your_password
```

## Database Schema

The receipts table includes:
- Customer information (name, address, mobile)
- Receipt details (number, token, dates)
- Payment information (amounts, methods)
- Property details (plot info, rates)
- Timestamps (created, updated)

## Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to your web server
```

### Backend
```bash
cd backend
npm start
# Deploy to your Node.js hosting service
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for Subh Sankalp Estate Pvt. Ltd.

## Support

For technical support or questions:
- Check the individual README files in frontend/ and backend/
- Review the database setup scripts
- Ensure all dependencies are installed correctly