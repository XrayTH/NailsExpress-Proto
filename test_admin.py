import pytest
from app import app, clientes

@pytest.fixture
def test_client():
    with app.test_client() as client:
        yield client

def test_eliminar_perfil_cliente(test_client):
    # Simular la inserción de un cliente de prueba
    cliente_data = {
        'usuario': 'test_cliente_eliminar',
        'email': 'test_cliente_eliminar@example.com',
        'password': 'test_password',
        'telefono': '1234567890'
    }

    clientes.insert_one(cliente_data)

    # Verificar que el cliente fue registrado correctamente en la base de datos
    cliente = clientes.find_one({'usuario': 'test_cliente_eliminar'})
    assert cliente is not None

    # Simular la eliminación del cliente
    delete_data = {
        'usuario': 'test_cliente_eliminar'
    }
    response_eliminar = test_client.post('/eliminar', data=delete_data)
    assert response_eliminar.status_code == 302  # Redirección después de eliminar

    # Verificar que el cliente ya no está en la base de datos
    cliente_eliminado = clientes.find_one({'usuario': 'test_cliente_eliminar'})
    assert cliente_eliminado is None
