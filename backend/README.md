# Receipt Backend API

Node.js backend for Subh Sankalp Estate Receipt Management System with SQL Server integration.

## Prerequisites

1. **Node.js** (v14 or higher)
2. **SQL Server** (Express, Developer, or Standard edition)
3. **SQL Server Management Studio** (optional, for database management)

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Database Setup

#### Option A: Using SQL Server Management Studio
1. Open SQL Server Management Studio
2. Connect using Windows Authentication
3. Open and execute `database/setup-windows-auth.sql`

#### Option B: Using Command Line (Windows Authentication)
```bash
sqlcmd -S localhost -E -i database/setup-windows-auth.sql
```

#### Option C: Test Database Connection
```bash
node test-db-connection.js
```

### 3. Environment Configuration

#### Option A: Windows Authentication (No Password Required)
If you're using Windows Authentication (recommended for local development):
```env
PORT=5000
DB_SERVER=localhost
DB_DATABASE=ReceiptDB
DB_USER=
DB_PASSWORD=
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_CERT=true
DB_USE_WINDOWS_AUTH=true
```

#### Option B: SQL Server Authentication (With Password)
If you have SQL Server credentials:
```env
PORT=5000
DB_SERVER=localhost
DB_DATABASE=ReceiptDB
DB_USER=sa
DB_PASSWORD=your_actual_password
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_CERT=true
DB_USE_WINDOWS_AUTH=false
```

### 4. Start the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status

### Receipts
- **POST** `/api/receipts` - Create new receipt
- **GET** `/api/receipts` - Get all receipts
- **GET** `/api/receipts/:id` - Get receipt by ID

## Sample API Usage

### Create Receipt
```javascript
POST http://localhost:5000/api/receipts
Content-Type: application/json

{
  "receiptNo": "1641",
  "token": "TK001",
  "date": "2024-01-15",
  "fromName": "John Doe",
  "address": "123 Main Street",
  "mobile": "9876543210",
  "receivedAmount": "Fifty Thousand Only",
  "amount": 50000.00
}
```

### Response
```json
{
  "success": true,
  "message": "Receipt created successfully",
  "data": {
    "id": 1,
    "receiptNo": "1641",
    "token": "TK001",
    ...
  }
}
```

## Database Schema

The `receipts` table includes all fields from the original receipt form:
- Basic info: receiptNo, token, date
- Customer details: fromName, address, mobile
- Payment details: amount, cash, cheque, rtgsNeft
- Property details: plotVillaNo, plotSize, basicRate
- Timestamps: createdAt, updatedAt

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check SQL Server is running
   - Verify credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing process: `taskkill /f /im node.exe`

3. **CORS Issues**
   - Frontend and backend must run on different ports
   - CORS is configured for all origins in development

## Development

- Server runs on `http://localhost:5000`
- Frontend should run on `http://localhost:5173` (Vite default)
- Database auto-creates tables on first run