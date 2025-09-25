# Frontend Environment Setup

## Environment Variables

The frontend uses environment variables to configure various settings. These are managed through `.env` files.

### Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the values in `.env`:**
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:5000/api

   # Development/Production Mode
   VITE_NODE_ENV=development

   # App Configuration
   VITE_APP_NAME=Subh Sankalp Estate Receipt System
   VITE_APP_VERSION=1.0.0
   ```

### Available Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_NODE_ENV` | Environment mode | `development` |
| `VITE_APP_NAME` | Company/App name displayed | `SUBH SANKALP ESTATE PVT. LTD.` |
| `VITE_APP_VERSION` | App version | `1.0.0` |

### Environment-Specific Configurations

#### Development
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_NODE_ENV=development
```

#### Production
```env
VITE_API_BASE_URL=https://your-production-api.com/api
VITE_NODE_ENV=production
```

### Important Notes

1. **Vite Prefix**: All environment variables must start with `VITE_` to be accessible in the frontend
2. **No Secrets**: Don't put sensitive information in frontend environment variables (they're visible to users)
3. **Restart Required**: After changing `.env` files, restart the development server
4. **Git Ignore**: The `.env` file is ignored by git, but `.env.example` is tracked

### Usage in Code

Environment variables are accessed using `import.meta.env`:

```javascript
// Get API base URL
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Get app name with fallback
const appName = import.meta.env.VITE_APP_NAME || "Default App Name";
```

### Customization

You can customize the company name, API endpoints, and other settings by updating the `.env` file without modifying the source code.