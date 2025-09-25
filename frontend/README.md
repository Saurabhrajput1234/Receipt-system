# Receipt Frontend

React + Vite frontend for Subh Sankalp Estate Receipt Management System.

## Features

- **Digital Receipt Form**: Exact replica of the physical receipt form
- **Real-time Form Handling**: State management for all form fields
- **Backend Integration**: Saves data to SQL Server via Node.js API
- **Print Functionality**: Generate printable receipts
- **Responsive Design**: Works on desktop and mobile devices
- **Clean UI**: Professional document-like appearance

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

## Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.jsx          # Main receipt form component
│   ├── App.css          # Vanilla CSS styling
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── package.json
├── vite.config.js       # Vite configuration with proxy
└── index.html
```

## Configuration

The frontend is configured to proxy API requests to the backend:

```javascript
// vite.config.js
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```

## Form Fields

The receipt form includes all fields from the original document:

- **Receipt Info**: Receipt number, token, date
- **Customer Details**: Name, address, mobile, token expiry
- **Payment Info**: Amount received, payment method, cheque details
- **Property Details**: Plot/villa number, size, rates
- **Payment Breakdown**: EDC, PLC, cash, cheque, RTGS/NEFT amounts
- **Terms & Conditions**: Legal terms and conditions

## API Integration

The form submits data to the backend API:

```javascript
const response = await fetch('http://localhost:5000/api/receipts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData)
});
```

## Styling

- **Vanilla CSS**: No external CSS frameworks
- **Document-like Design**: Mimics the original paper receipt
- **Print-friendly**: Clean print styles
- **Mobile Responsive**: Adapts to different screen sizes

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Notes

- The form uses controlled components with React state
- All form fields are mapped to the database schema
- Error handling for API communication
- Form validation can be added as needed