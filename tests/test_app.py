# tests/test_app.py
import pytest
import json
from app import create_app
from models import db, NormalUser, Administrator, Record

@pytest.fixture
def app():
    """Create test app"""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()

@pytest.fixture
def auth_headers(client):
    """Create authenticated user and return headers"""
    # Register user
    response = client.post('/auth/signup', 
        json={'name': 'Test User', 'email': 'test@gmail.com', 'password': 'password123'})
    
    data = json.loads(response.data)
    token = data['access_token']
    
    return {'Authorization': f'Bearer {token}'}

@pytest.fixture
def admin_headers(client):
    """Create authenticated admin and return headers"""
    # Register admin
    response = client.post('/admin/signup',
        json={'name': 'Test Admin', 'email': 'admin@gmail.com', 'password': 'admin123'})
    
    data = json.loads(response.data)
    token = data['access_token']
    
    return {'Authorization': f'Bearer {token}'}

class TestAuthentication:
    """Test authentication endpoints"""
    
    def test_user_signup_success(self, client):
        """Test successful user registration"""
        response = client.post('/auth/signup', json={
            'name': 'John Doe',
            'email': 'john@gmail.com',
            'password': 'password123'
        })
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert 'access_token' in data
        assert data['user']['name'] == 'John Doe'
        assert data['user']['email'] == 'john@gmail.com'
    
    def test_user_signup_invalid_email(self, client):
        """Test user registration with invalid email"""
        response = client.post('/auth/signup', json={
            'name': 'John Doe',
            'email': 'john@yahoo.com',  # Not Gmail
            'password': 'password123'
        })
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Gmail' in data['error']
    
    def test_user_login_success(self, client):
        """Test successful user login"""
        # First register user
        client.post('/auth/signup', json={
            'name': 'Jane Doe',
            'email': 'jane@gmail.com', 
            'password': 'password123'
        })
        
        # Then login
        response = client.post('/auth/login', json={
            'email': 'jane@gmail.com',
            'password': 'password123'
        })
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'access_token' in data
        assert data['user']['email'] == 'jane@gmail.com'
    
    def test_admin_signup_success(self, client):
        """Test successful admin registration"""
        response = client.post('/admin/signup', json={
            'name': 'Admin User',
            'email': 'admin@gmail.com',
            'password': 'admin123'
        })
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert 'access_token' in data
        assert 'admin_number' in data['admin']

class TestRecords:
    """Test record management endpoints"""
    
    def test_create_record_success(self, client, auth_headers):
        """Test successful record creation"""
        response = client.post('/records', 
            headers=auth_headers,
            json={
                'title': 'Test Corruption Report',
                'description': 'This is a test report',
                'type': 'red-flag',
                'latitude': -1.2921,
                'longitude': 36.8219
            })
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['record']['title'] == 'Test Corruption Report'
        assert data['record']['status'] == 'draft'
    
    def test_create_record_missing_title(self, client, auth_headers):
        """Test record creation without title"""
        response = client.post('/records',
            headers=auth_headers,
            json={'description': 'No title provided'})
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Title is required' in data['error']
    
    def test_get_my_records(self, client, auth_headers):
        """Test getting user's own records"""
        # Create a record first
        client.post('/records',
            headers=auth_headers,
            json={
                'title': 'My Test Record',
                'description': 'Test description',
                'type': 'red-flag'
            })
        
        # Get records
        response = client.get('/my-records', headers=auth_headers)
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data['records']) == 1
        assert data['records'][0]['title'] == 'My Test Record'
    
    def test_update_record_success(self, client, auth_headers):
        """Test successful record update"""
        # Create a record first
        create_response = client.post('/records',
            headers=auth_headers,
            json={
                'title': 'Original Title',
                'description': 'Original description',
                'type': 'red-flag'
            })
        
        record_id = json.loads(create_response.data)['record']['id']
        
        # Update the record
        response = client.patch(f'/records/{record_id}',
            headers=auth_headers,
            json={'title': 'Updated Title'})
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['record']['title'] == 'Updated Title'
    
    def test_delete_record_success(self, client, auth_headers):
        """Test successful record deletion"""
        # Create a record first
        create_response = client.post('/records',
            headers=auth_headers,
            json={
                'title': 'To Be Deleted',
                'description': 'This will be deleted',
                'type': 'red-flag'
            })
        
        record_id = json.loads(create_response.data)['record']['id']
        
        # Delete the record
        response = client.delete(f'/records/{record_id}', headers=auth_headers)
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'deleted successfully' in data['message']

class TestPublicEndpoints:
    """Test public endpoints that don't require authentication"""
    
    def test_get_public_records(self, client, auth_headers):
        """Test getting public records"""
        # Create a record and change its status
        create_response = client.post('/records',
            headers=auth_headers,
            json={
                'title': 'Public Record',
                'description': 'This should be visible publicly',
                'type': 'red-flag'
            })
        
        # Get public records (should be empty since record is draft)
        response = client.get('/public/records')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data['records']) == 0  # Draft records not shown publicly
    
    def test_anonymous_report_success(self, client):
        """Test anonymous report submission"""
        response = client.post('/public/report', json={
            'title': 'Anonymous Corruption Report',
            'description': 'This is submitted anonymously',
            'type': 'red-flag',
            'latitude': -1.2921,
            'longitude': 36.8219
        })
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert 'tracking_token' in data
        assert data['record']['is_anonymous'] is True
        assert data['record']['status'] == 'under-investigation'

class TestVoting:
    """Test voting system"""
    
    def test_vote_on_record(self, client, auth_headers, admin_headers):
        """Test voting on a record"""
        # Create a record
        create_response = client.post('/records',
            headers=auth_headers,
            json={
                'title': 'Votable Record',
                'description': 'This can be voted on',
                'type': 'red-flag'
            })
        
        record_id = json.loads(create_response.data)['record']['id']
        
        # Change status to make it public (using admin)
        client.patch(f'/records/{record_id}/status',
            headers=admin_headers,
            json={'status': 'under-investigation'})
        
        # Vote on the record
        response = client.post(f'/records/{record_id}/vote',
            headers=auth_headers,
            json={'vote_type': 'support'})
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['vote_count'] == 1
        assert data['user_vote'] == 'support'

class TestAdminFunctions:
    """Test admin-specific functionality"""
    
    def test_update_record_status(self, client, auth_headers, admin_headers):
        """Test admin updating record status"""
        # Create a record as user
        create_response = client.post('/records',
            headers=auth_headers,
            json={
                'title': 'Status Test Record',
                'description': 'Testing status update',
                'type': 'red-flag'
            })
        
        record_id = json.loads(create_response.data)['record']['id']
        
        # Update status as admin
        response = client.patch(f'/records/{record_id}/status',
            headers=admin_headers,
            json={
                'status': 'under-investigation',
                'reason': 'Starting investigation'
            })
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['record']['status'] == 'under-investigation'
    
    def test_get_admin_stats(self, client, admin_headers):
        """Test getting admin statistics"""
        response = client.get('/admin/stats', headers=admin_headers)
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'total_records' in data
        assert 'total_users' in data
        assert 'status_distribution' in data

class TestValidation:
    """Test input validation"""
    
    def test_invalid_coordinates(self, client, auth_headers):
        """Test record creation with invalid coordinates"""
        response = client.post('/records',
            headers=auth_headers,
            json={
                'title': 'Invalid Location',
                'description': 'Testing invalid coordinates',
                'type': 'red-flag',
                'latitude': 999,  # Invalid latitude
                'longitude': 36.8219
            })
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'coordinates' in data['error'].lower()
    
    def test_invalid_media_url(self, client, auth_headers):
        """Test record creation with invalid media URL"""
        response = client.post('/records',
            headers=auth_headers,
            json={
                'title': 'Invalid Media',
                'description': 'Testing invalid media URL',
                'type': 'red-flag',
                'image_url': 'not-a-valid-url'
            })
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Invalid image URL' in data['error']

# Run tests with: python -m pytest tests/ -v
