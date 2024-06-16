import pytest
from app import app, profesionales, clientes, administradores
import hashlib

@pytest.fixture
def test_client():
    # Crear un cliente de prueba para la aplicación
    with app.test_client() as client:
        yield client

@pytest.fixture
def add_test_profesional():
    # Encriptar la contraseña del profesional de prueba
    hashed_password = hashlib.sha512('test_password'.encode()).hexdigest()

    # Agregar un profesional de prueba a la base de datos
    profesionales.insert_one({
        'usuario': 'test_user',
        'correo': 'test@example.com',
        'contraseña': hashed_password
    })

    yield  # Esto indica el final del bloque yield
    
    # Limpiar el profesional de prueba de la base de datos después de completar las pruebas
    profesionales.delete_one({'usuario': 'test_user'})

@pytest.fixture
def add_test_cliente():
    # Encriptar la contraseña del cliente de prueba
    hashed_password = hashlib.sha512('test_password'.encode()).hexdigest()

    # Agregar un cliente de prueba a la base de datos
    clientes.insert_one({
        'usuario': 'test_user',
        'correo': 'test@example.com',
        'contraseña': hashed_password
    })

    yield  # Esto indica el final del bloque yield
    
    # Limpiar el cliente de prueba de la base de datos después de completar las pruebas
    clientes.delete_one({'usuario': 'test_user'})

@pytest.fixture
def add_test_administrador():
    # Encriptar la contraseña del administrador de prueba
    hashed_password = hashlib.sha512('test_password'.encode()).hexdigest()

    # Agregar un administrador de prueba a la base de datos
    administradores.insert_one({
        'usuario': 'test_user',
        'correo': 'test@example.com',
        'contraseña': hashed_password
    })

    yield  # Esto indica el final del bloque yield
    
    # Limpiar el administrador de prueba de la base de datos después de completar las pruebas
    administradores.delete_one({'usuario': 'test_user'})

def test_login_correct_profesional_credentials(test_client, add_test_profesional):
    response = test_client.post('/login', data={'email': 'test@example.com', 'password': 'test_password'})
    assert response.status_code == 302
    assert response.headers['Location'] == '/pantalla_inicio_pro'

def test_login_correct_cliente_credentials(test_client, add_test_cliente):
    response = test_client.post('/login', data={'email': 'test@example.com', 'password': 'test_password'})
    assert response.status_code == 302
    assert response.headers['Location'] == '/pantalla_inicio_cli'

def test_login_correct_administrador_credentials(test_client, add_test_administrador):
    response = test_client.post('/login', data={'email': 'test@example.com', 'password': 'test_password'})
    assert response.status_code == 302
    assert response.headers['Location'] == '/pantalla_inicio_admin'

def test_login_incorrect_password(test_client, add_test_profesional):
    response = test_client.post('/login', data={'email': 'test@example.com', 'password': 'wrong_password'})
    assert response.status_code == 200

def test_login_unregistered_email(test_client):
    response = test_client.post('/login', data={'email': 'unknown@example.com', 'password': 'password'})
    assert response.status_code == 200
