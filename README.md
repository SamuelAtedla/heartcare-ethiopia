# Heart Care Ethiopia

A specialized cardiology consultancy platform connecting patients with top cardiologists via digital channels.

## Project Structure

- `frontend/`: React + Vite application (Dashboard & Landing Page).
- `backend/`: Express.js API (Appointment management).
- `index.html`: (Legacy) Original static landing page reference.

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (if running backend)

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Run tests:
   ```bash
   npm test
   ```

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server (ensure .env is configured):
   ```bash
   npm start
   ```

## Features

- **Landing Page**: Information about services, doctors, and a multi-step booking wizard.
- **Doctor Dashboard**: Admin interface for doctors to manage appointments (requires login).
- **Booking Flow**: Registration -> Payment Simulation -> Confirmation (WhatsApp/Telegram redirection).
