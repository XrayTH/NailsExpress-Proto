import pytest
from app import app, profesionales
import hashlib

@pytest.fixture
def test_client():
    # Crear un cliente de prueba para la aplicación
    with app.test_client() as client:
        yield client

@pytest.fixture
def add_test_user():
    # Encriptar la contraseña del usuario de prueba
    hashed_password = hashlib.sha512('test_password'.encode()).hexdigest()

    # Agregar un usuario de prueba a la base de datos
    profesionales.insert_one({
        'usuario': 'test_user',
        'correo': 'test@example.com',
        'contraseña': hashed_password
    })

    yield  # Esto indica el final del bloque yield
    
    # Limpiar el usuario de prueba de la base de datos después de completar las pruebas
    profesionales.delete_one({'usuario': 'test_user'})

def test_login_correct_credentials(test_client, add_test_user):
    # Simula una solicitud POST con datos de formulario válidos
    response = test_client.post('/login', data={'email': 'test@example.com', 'password': 'test_password'})
    # Verifica que la respuesta sea una redirección a la página 'mapa'
    assert response.status_code == 302
    assert response.headers['Location'] == '/mapa.html'

def test_login_incorrect_password(test_client, add_test_user):
    # Simula una solicitud POST con una contraseña incorrecta
    response = test_client.post('/login', data={'email': 'test@example.com', 'password': 'wrong_password'})
    # Verifica que la respuesta contenga el mensaje de contraseña incorrecta
    assert b'Contrasena incorrecta. Intentalo de nuevo.' in response.data

def test_login_unregistered_email(test_client):
    # Simula una solicitud POST con un correo no registrado
    response = test_client.post('/login', data={'email': 'unknown@example.com', 'password': 'password'})
    # Verifica que la respuesta contenga el mensaje de correo no registrado
    assert b'Correo no registrado. Registrate primero.' in response.data


