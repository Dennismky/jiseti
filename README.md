# Jiseti - Anti-Corruption Platform

A comprehensive platform empowering African citizens to report corruption incidents and request government intervention. Built with modern web technologies for transparency and accountability.

## 🌟 Overview

Jiseti provides a secure, transparent, and efficient way for citizens to:
- Report corruption anonymously or with an account
- Track investigation progress in real-time
- Support community reports through voting
- Visualize incidents on interactive maps
- Receive multi-channel notifications (email/SMS)

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (or SQLite for development)
- Google Maps API key (optional)

### Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd jiseti

# Install Python dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Initialize database
python app.py

# Optional: Seed with sample data
python seed.py
```

### Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API configuration

# Start development server
npm run dev
```

Visit `http://localhost:5173` for frontend and `http://localhost:5000` for API.

## 📋 Key Features

### Core Functionality
- **Anonymous Reporting** - Submit reports without creating an account
- **User Authentication** - Secure Gmail-based registration system
- **Admin Dashboard** - Comprehensive report management interface
- **Real-time Status Updates** - Track report progress from submission to resolution

### Advanced Features
- **Interactive Maps** - Google Maps integration with location picking
- **Community Voting** - Support system for public reports
- **Multi-channel Notifications** - Email and SMS status updates
- **Search & Filtering** - Advanced search across all reports
- **Media Attachments** - Support for images and videos
- **Audit Trail** - Complete status change history

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **React Query** - Server state management

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **Alembic** - Database migrations

### External Services
- **Google Maps API** - Location services
- **SendGrid** - Email notifications
- **Twilio** - SMS notifications

## 🔧 Configuration

### Backend Environment (.env)
```env
# Application
FLASK_ENV=development
PORT=5000
JWT_SECRET_KEY=your-super-secret-jwt-key

# Database
SQLALCHEMY_DATABASE_URI=postgresql://user:password@localhost:5432/jiseti_db

# Email Service
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@jiseti.go.ke

# SMS Service
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Frontend Environment (client/.env)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=10000

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Application
VITE_APP_NAME=Jiseti
VITE_ENVIRONMENT=development
```

## 📦 Database Schema

### Core Models
- **Users** - Citizen accounts (Gmail required)
- **Administrators** - Admin accounts with management rights
- **Records** - Corruption reports and interventions
- **Media** - Image/video attachments
- **Votes** - Community support system
- **Status History** - Audit trail for all changes
- **Notifications** - Email/SMS delivery logs

### Sample Data
```bash
# Create sample data for testing
python seed.py
```

**Default Test Accounts:**
- **User:** `alice.wanjiku@gmail.com` / `password123`
- **Admin:** `admin@jiseti.go.ke` / `admin123`

## 📊 API Documentation

### Public Endpoints
```
GET    /public/records          # View all public reports
GET    /public/records/:id      # Get specific report details
POST   /public/report           # Submit anonymous report
```

### Authentication
```
POST   /auth/signup             # User registration
POST   /auth/login              # User login
POST   /admin/login             # Admin login
```

### User Endpoints (Authenticated)
```
GET    /my-records              # Get user's reports
POST   /records                 # Create new report
PATCH  /records/:id             # Update report (draft only)
DELETE /records/:id             # Delete report (draft only)
POST   /records/:id/vote        # Vote on report
```

### Admin Endpoints
```
GET    /admin/records           # View all reports
PATCH  /records/:id/status      # Update report status
GET    /admin/stats             # Platform statistics
```

## 🎯 User Workflows

### Anonymous Reporting
1. Visit `/report` page
2. Fill out report form with details
3. Optionally add location and media
4. Submit and receive tracking token
5. Use token to check status later

### Registered User Flow
1. Register with Gmail account
2. Login to access dashboard
3. Create detailed reports
4. Track all reports in one place
5. Edit drafts before submission
6. Vote on community reports

### Admin Management
1. Login to admin panel
2. Review incoming reports
3. Assign to investigators
4. Update status with notes
5. Send notifications to users
6. View platform analytics

## 🔒 Security & Privacy

### Authentication
- JWT-based session management
- Password hashing with bcrypt
- Gmail-only registration for verification
- Role-based access control

### Data Protection
- Input validation and sanitization
- CORS protection for API
- Anonymous reporting support
- Personal data encryption
- Audit logging for admin actions

### Privacy Features
- Anonymous report submission
- Optional user identity protection
- Data retention policies
- GDPR compliance considerations

## 🗺️ Map Integration

### Location Features
- **Interactive Map** - Click to select locations
- **Current Location** - GPS-based location detection
- **Address Geocoding** - Convert coordinates to addresses
- **Map Visualization** - View all reports on map
- **Location Validation** - Coordinate range checking

### Setup Google Maps
1. Get API key from Google Cloud Console
2. Enable Maps JavaScript API
3. Add key to environment variables
4. Configure billing (if needed)

## 📱 Mobile Support

- **Responsive Design** - Mobile-first approach
- **Touch Interface** - Optimized for mobile devices
- **GPS Integration** - Native location services
- **Offline Capability** - Basic offline functionality
- **Progressive Web App** - PWA features ready

## 🚀 Deployment

### Production Backend
```bash
# Install production server
pip install gunicorn

# Run with multiple workers
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# With process management
pip install supervisor
# Configure supervisor for auto-restart
```

### Production Frontend
```bash
cd client

# Build for production
npm run build

# Serve with nginx
sudo cp -r dist/* /var/www/jiseti/
```

### Environment Considerations
- Use PostgreSQL in production
- Configure proper CORS origins
- Set up SSL certificates
- Enable monitoring and logging
- Configure backup strategies

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=.

# Run specific test file
pytest tests/test_auth.py
```

### Frontend Testing
```bash
cd client

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e
```

### Manual Testing Scenarios
1. Anonymous report submission
2. User registration and login
3. Report creation with location
4. Admin status updates
5. Email/SMS notifications
6. Map functionality

## 🔧 Development

### Code Structure
```
jiseti/
├── app.py              # Flask application factory
├── routes.py           # API endpoints
├── models.py           # Database models
├── utils/              # Helper functions
├── client/             # React frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── store/      # Redux store
│   │   └── services/   # API services
└── requirements.txt    # Python dependencies
```

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint/Prettier for JavaScript
- Write tests for new features
- Update documentation
- Use meaningful commit messages

## 📈 Performance

### Optimization Features
- Database query optimization
- Frontend code splitting
- Image lazy loading
- Response caching
- Pagination for large datasets

### Monitoring
- Application logging
- Error tracking
- Performance metrics
- Database monitoring
- User analytics

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

### Contribution Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Get code review approval

## 📄 License

MIT License - Open source for building a corruption-free Africa.

## 🌍 Impact

Jiseti aims to strengthen democracy and governance across Africa by providing citizens with the tools to report corruption and demand accountability from their governments. Every report contributes to building a more transparent society.
