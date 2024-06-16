import pytest
from app import app, clientes, profesionales
import hashlib

@pytest.fixture
def test_client():
    # Crear un cliente de prueba para la aplicación
    with app.test_client() as client:
        yield client

def test_register_cliente(test_client):
    data = {
        'tipo_usuario': 'cliente',
        'usuario': 'test_cliente',
        'email': 'test_cliente@example.com',
        'password': 'test_password',
        'telefono': '1234567890'
    }

    response = test_client.post('/register', data=data)
    assert response.status_code == 200

    # Verificar que el cliente fue registrado correctamente en la base de datos
    cliente = clientes.find_one({'usuario': 'test_cliente'})
    assert cliente is not None
    assert cliente['correo'] == 'test_cliente@example.com'

    # Limpiar el cliente de prueba de la base de datos después de completar las pruebas
    clientes.delete_one({'usuario': 'test_cliente'})
