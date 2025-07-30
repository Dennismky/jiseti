import pytest
import json
import sys
import os

# Add the parent directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app as flask_app
from models import db, NormalUser, Administrator, Record, Media

@pytest.fixture
def app():
    """Create test Flask app with in-memory database."""
    flask_app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'JWT_SECRET_KEY': 'test-secret-key'
    })
    
    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def user_data():
    return {'name': 'Test User', 'email': 'test@example.com', 'password': 'password123'}

@pytest.fixture
def admin_data():
    return {'name': 'Admin', 'email': 'admin@example.com', 'password': 'admin123', 'admin_number': 'ADM001', 'role': 'admin'}

@pytest.fixture
def user_token(client, user_data):
    """Create user and return JWT token."""
    client.post('/signup', json=user_data)
    response = client.post('/login', json={'email': user_data['email'], 'password': user_data['password']})
    return json.loads(response.data)['access_token']

@pytest.fixture
def admin_token(client, admin_data):
    """Create admin and return JWT token."""
    client.post('/signup', json=admin_data)
    response = client.post('/login', json={'email': admin_data['email'], 'password': admin_data['password'], 'role': 'admin'})
    return json.loads(response.data)['access_token']

def test_home_route(client):
    """Test home route returns welcome message."""
    response = client.get('/')
    assert response.status_code == 200
    assert b'Welcome to Jiseti' in response.data

# Authentication Tests
def test_user_signup_success(client, user_data):
    """Test successful user registration."""
    response = client.post('/signup', json=user_data)
    assert response.status_code == 201
    assert json.loads(response.data)['message'] == 'User account created'

def test_admin_signup_success(client, admin_data):
    """Test successful admin registration."""
    response = client.post('/signup', json=admin_data)
    assert response.status_code == 201
    assert json.loads(response.data)['message'] == 'Administrator account created'

def test_duplicate_email_fails(client, user_data):
    """Test duplicate email registration fails."""
    client.post('/signup', json=user_data)
    response = client.post('/signup', json=user_data)
    assert response.status_code == 400
    assert 'Email already registered' in json.loads(response.data)['error']

def test_user_login_success(client, user_data):
    """Test user login returns token."""
    client.post('/signup', json=user_data)
    response = client.post('/login', json={'email': user_data['email'], 'password': user_data['password']})
    assert response.status_code == 200
    assert 'access_token' in json.loads(response.data)

def test_invalid_login_fails(client):
    """Test invalid credentials fail."""
    response = client.post('/login', json={'email': 'fake@example.com', 'password': 'wrong'})
    assert response.status_code == 401
    assert 'Invalid credentials' in json.loads(response.data)['error']

# Authorization Tests
def test_admin_can_list_users(client, admin_token):
    """Test admin can view user list."""
    response = client.get('/normal_users', headers={'Authorization': f'Bearer {admin_token}'})
    assert response.status_code == 200

def test_user_cannot_list_users(client, user_token):
    """Test normal user cannot view user list."""
    response = client.get('/normal_users', headers={'Authorization': f'Bearer {user_token}'})
    assert response.status_code == 403

def test_no_token_unauthorized(client):
    """Test requests without token are unauthorized."""
    response = client.get('/normal_users')
    assert response.status_code == 401

# Record Tests
def test_create_record_success(client, user_token):
    """Test user can create record."""
    data = {
        'type': 'incident',
        'title': 'Test Incident',
        'description': 'Test description',
        'latitude': -1.2921,
        'longitude': 36.8219
    }
    response = client.post('/records', json=data, headers={'Authorization': f'Bearer {user_token}'})
    assert response.status_code == 201
    assert 'Record created' in json.loads(response.data)['message']

def test_admin_cannot_create_record(client, admin_token):
    """Test admin cannot create records."""
    data = {'type': 'incident', 'title': 'Test', 'description': 'Test'}
    response = client.post('/records', json=data, headers={'Authorization': f'Bearer {admin_token}'})
    assert response.status_code == 403

def test_list_records_success(client, user_token):
    """Test authenticated user can list records."""
    response = client.get('/records', headers={'Authorization': f'Bearer {user_token}'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert all(key in data for key in ['records', 'total', 'page', 'pages'])

def test_edit_own_record_success(client, user_token, app):
    """Test user can edit their own draft record."""
    # Create record
    with app.app_context():
        record = Record(type='incident', title='Original', description='Original', normal_user_id=1, status='draft')
        db.session.add(record)
        db.session.commit()
        record_id = record.id

    # Edit record
    response = client.patch(f'/records/{record_id}', 
                          json={'title': 'Updated'}, 
                          headers={'Authorization': f'Bearer {user_token}'})
    assert response.status_code == 200
    assert 'Record updated' in json.loads(response.data)['message']

def test_cannot_edit_finalized_record(client, user_token, app):
    """Test cannot edit finalized record."""
    with app.app_context():
        record = Record(type='incident', title='Test', description='Test', normal_user_id=1, status='resolved')
        db.session.add(record)
        db.session.commit()
        record_id = record.id

    response = client.patch(f'/records/{record_id}', 
                          json={'title': 'Updated'}, 
                          headers={'Authorization': f'Bearer {user_token}'})
    assert response.status_code == 403
    assert 'Cannot edit finalized record' in json.loads(response.data)['error']

def test_delete_own_record_success(client, user_token, app):
    """Test user can delete their own draft record."""
    with app.app_context():
        record = Record(type='incident', title='Test', description='Test', normal_user_id=1, status='draft')
        db.session.add(record)
        db.session.commit()
        record_id = record.id

    response = client.delete(f'/records/{record_id}', headers={'Authorization': f'Bearer {user_token}'})
    assert response.status_code == 200
    assert 'Record deleted' in json.loads(response.data)['message']

def test_admin_can_update_status(client, admin_token, app):
    """Test admin can update record status."""
    with app.app_context():
        record = Record(type='incident', title='Test', description='Test', normal_user_id=1, status='draft')
        db.session.add(record)
        db.session.commit()
        record_id = record.id

    response = client.patch(f'/records/{record_id}/status', 
                          json={'status': 'under investigation'}, 
                          headers={'Authorization': f'Bearer {admin_token}'})
    assert response.status_code == 200
    assert 'Status updated' in json.loads(response.data)['message']

def test_user_cannot_update_status(client, user_token, app):
    """Test normal user cannot update record status."""
    with app.app_context():
        record = Record(type='incident', title='Test', description='Test', normal_user_id=1, status='draft')
        db.session.add(record)
        db.session.commit()
        record_id = record.id

    response = client.patch(f'/records/{record_id}/status', 
                          json={'status': 'under investigation'}, 
                          headers={'Authorization': f'Bearer {user_token}'})
    assert response.status_code == 403
    assert 'Only admins can change record status' in json.loads(response.data)['error']

def test_add_media_success(client, user_token, app):
    """Test user can add media to their draft record."""
    with app.app_context():
        record = Record(type='incident', title='Test', description='Test', normal_user_id=1, status='draft')
        db.session.add(record)
        db.session.commit()
        record_id = record.id

    response = client.post(f'/records/{record_id}/media', 
                         json={'image_url': 'https://example.com/image.jpg'}, 
                         headers={'Authorization': f'Bearer {user_token}'})
    assert response.status_code == 201
    assert 'Media added' in json.loads(response.data)['message']

def test_nonexistent_record_404(client, user_token):
    """Test operations on non-existent record return 404."""
    response = client.patch('/records/999', 
                          json={'title': 'Updated'}, 
                          headers={'Authorization': f'Bearer {user_token}'})
    assert response.status_code == 404

def test_malformed_json_400(client):
    """Test malformed JSON returns 400."""
    response = client.post('/signup', data="invalid json", content_type='application/json')
    assert response.status_code == 400