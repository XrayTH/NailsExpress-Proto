import pytest
from app import app, domicilios  # Importa tu aplicación Flask
import json
from bson.objectid import ObjectId

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_solicitar_servicio(client):
    # Datos de ejemplo para enviar con la solicitud
    datos = {
        'cliente': 'cliente@example.com',
        'direccion': 'Dirección de prueba',
        'telefono': '123456789',
        'ubicacion': {
            'lat': 123.456,
            'lng': -78.910
        }
    }

    # Realizar la solicitud POST
    response = client.post('/solicitarServicio', json=datos)
    
    # Verificar el código de estado y el contenido de la respuesta
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'mensaje' in data
    assert 'id' in data

    # Opcional: Verificar que el mensaje de éxito sea el esperado
    assert data['mensaje'] == 'Solicitud recibida exitosamente'

    # Opcional: Verificar que el ID devuelto sea válido
    assert isinstance(data['id'], str)
    assert len(data['id']) > 0

    # Aquí podrías agregar más pruebas según la lógica específica que quieras verificar
    
    # Por ejemplo, puedes asegurarte de que la sesión tenga el ID de domicilio
    with client.session_transaction() as session:
        assert 'domicilio' in session
        assert session['domicilio'] == data['id']
        
    dom = domicilios.find_one({'_id': ObjectId(data['id'])})
    assert dom is not None
    
    domicilios.delete_one({'_id': ObjectId(data['id'])})
