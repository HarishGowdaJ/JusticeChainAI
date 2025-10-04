# Justice System Backend Server

A Node.js backend server for the Justice System application with MongoDB integration and real-time notifications.

## Features

- **User Authentication**: JWT-based authentication for citizens, police, and court officials
- **Complaint Management**: Citizens can register complaints with evidence upload
- **FIR Management**: Police can file FIRs for registered complaints
- **Case File Management**: Court officials can create case files and manage hearings
- **Real-time Notifications**: Socket.io integration for instant notifications
- **File Upload**: Support for evidence and document uploads
- **Role-based Access**: Different permissions for different user roles

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Multer** - File upload handling
- **Bcryptjs** - Password hashing

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/justice_system
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

4. Start MongoDB service (make sure MongoDB is installed and running)

5. Run the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Complaints
- `POST /api/complaints` - Register a new complaint
- `GET /api/complaints` - Get all complaints (filtered by role)
- `GET /api/complaints/:id` - Get complaint by ID
- `PUT /api/complaints/:id/assign` - Assign complaint to police officer
- `PUT /api/complaints/:id/status` - Update complaint status

### FIRs
- `POST /api/firs` - File a new FIR
- `GET /api/firs` - Get all FIRs (filtered by role)
- `GET /api/firs/:id` - Get FIR by ID
- `PUT /api/firs/:id/status` - Update FIR status
- `POST /api/firs/:id/investigation-notes` - Add investigation notes

### Case Files
- `POST /api/casefiles` - Create a new case file
- `GET /api/casefiles` - Get all case files (filtered by role)
- `GET /api/casefiles/:id` - Get case file by ID
- `PUT /api/casefiles/:id/status` - Update case file status
- `POST /api/casefiles/:id/hearings` - Schedule a hearing
- `POST /api/casefiles/:id/judgment` - Record judgment

### Notifications
- `GET /api/notifications` - Get all notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/unread-count` - Get unread count

## Database Models

### User
- Citizens, Police officers, Court officials
- Role-based authentication and permissions

### Complaint
- Filed by citizens
- Contains evidence, location, description
- Status tracking through the justice system

### FIR
- Filed by police for complaints
- Contains investigation details, sections, accused/witness info

### CaseFile
- Created by court for FIRs
- Contains case details, hearings, judgments

### Notification
- Real-time notifications for all user types
- Bell icon integration for frontend

## Real-time Features

The server uses Socket.io for real-time notifications:

- **New Complaint**: Notifies all police officers
- **FIR Filed**: Notifies citizen and court officials
- **Case Filed**: Notifies citizen and police
- **Status Updates**: Notifies relevant parties
- **Hearing Scheduled**: Notifies all parties

## File Upload

- Evidence uploads for complaints
- Document uploads for case files
- 10MB file size limit
- Supported formats: images, PDFs, documents

## Security

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- File upload validation
- Input validation with express-validator

## Development

```bash
# Install nodemon for development
npm install -g nodemon

# Run in development mode
npm run dev
```

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a production MongoDB instance
3. Set secure JWT secret
4. Configure proper CORS settings
5. Use a process manager like PM2

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend URL for CORS
