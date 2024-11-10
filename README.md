# International Payments Portal

## Setup Instructions for Testing

### Prerequisites
- Node.js (v18+)
- MongoDB (v4.4+)
- Angular CLI (v18+)

### Database Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a new database named `international_payments_db`
3. For testing purposes, you can use either:
   - Local MongoDB: `mongodb://localhost:27017/international_payments_db`
   - Or create a free MongoDB Atlas cluster

### Environment Setup
1. Backend Configuration:
   ```powershell
   Set-Location -Path backend
   Copy-Item .env.template .env
   ```
   Update the `.env` file with your MongoDB connection:
   - For local testing: Use the default connection string
   - For MongoDB Atlas: Replace with your connection string

2. Seed Test Data:
   ```powershell
   npm run seed:employees
   ```
   This will create 5 employee accounts with one that has the following credentials, given to test the portal:
   - Email: john.smith@bank.com
   - Password: Employee123!

### Running the Application
1. Start Backend:
   ```powershell
   cd backend (from root directory)
   npm install
   npm start
   ```

2. Start Frontend:
   ```powershell
   cd frontend (from root directory)
   npm install
   ng serve
   ```

3. Access the application at: http://localhost:4200

### Test Credentials
Employee Login:
- Account Number: 9876543210
- Password: Employee123!

### Important Security Notes
- The provided JWT_SECRET in .env.template is for development only
- In production, use strong, randomly generated secrets
- Never commit the actual .env file
- The seed data contains test accounts - not for production use 

## More Setup Instructions

### Frontend Setup
1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Copy environment template: `Copy-Item src/environments/environment.template.ts src/environments/environment.ts`
4. Update environment variables in `src/environments/environment.ts`
5. Generate SSL certificates:
   ```powershell
   New-Item -ItemType Directory -Path ssl -Force
   Set-Location -Path ssl
   openssl req -newkey rsa:2048 -nodes -keyout privatekey.pem -x509 -days 365 -out certificate.pem
   Set-Location ..
   ```
6. Start the application: `ng serve`

### Backend Setup
1. Navigate to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Copy environment template: `Copy-Item .env.template .env`
4. Update environment variables in `.env`
5. Start the server: `npm start`

## Development

### Frontend Scripts
