import pytest
from app import app, clientes, profesionales
import hashlib

@pytest.fixture
def test_client():
    # Crear un cliente de prueba para la aplicación
    with app.test_client() as client:
        yield client

def test_register_profesional(test_client):
    data = {
        'tipo_usuario': 'profesional',
        'usuario': 'test_profesional',
        'email': 'test_profesional@example.com',
        'password': 'test_password',
        'nombre': 'Test Profesional',
        'nombre_local': 'Local Test',
        'direccion': 'Carrera 13 #5_21',
        'telefono_local': '987654321',
        'ciudad': 'Buga',
        'pais': 'Colombia',
        'departamento': 'Valle del Cauca',
        'cod_postal': '763042'
    }

    response = test_client.post('/register', data=data)
    assert response.status_code == 200

    # Verificar que el profesional fue registrado correctamente en la base de datos
    profesional = profesionales.find_one({'usuario': 'test_profesional'})
    assert profesional is not None
    assert profesional['correo'] == 'test_profesional@example.com'

    # Limpiar el profesional de prueba de la base de datos después de completar las pruebas
    profesionales.delete_one({'usuario': 'test_profesional'})

def test_register_profesional_wrong_ubication(test_client):
    data = {
        'tipo_usuario': 'profesional',
        'usuario': 'test_profesional',
        'email': 'test_profesional@example.com',
        'password': 'test_password',
        'nombre': 'Test Profesional',
        'nombre_local': 'Local Test',
        'direccion': 'Dirección de prueba',
        'telefono_local': '987654321',
        'ciudad': 'Ciudad Test',
        'pais': 'País Test',
        'departamento': 'Departamento Test',
        'cod_postal': '12345'
    }

    response = test_client.post('/register', data=data)
    assert response.status_code == 200

    # Verificar que el profesional no fue registrado en la base de datos
    profesional = profesionales.find_one({'usuario': 'test_profesional_invalid'})
    assert profesional is None

    # Asegurarse de que el correo electrónico no se haya registrado en ningún tipo de usuario
    assert not profesionales.find_one({'correo': 'test_profesional_invalid@example.com'})

    # Limpiar el profesional de prueba de la base de datos después de completar las pruebas
    profesionales.delete_one({'usuario': 'test_profesional'})