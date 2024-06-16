import pytest
from app import app, domicilios  # Asegúrate de importar tu aplicación Flask y la colección de MongoDB
import json
from bson.objectid import ObjectId

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_verificar_estado(client):
    # Datos de ejemplo para enviar con la solicitud a /solicitarServicio
    datos_solicitud = {
        'cliente': 'cliente@example.com',
        'direccion': 'Dirección de prueba',
        'telefono': '123456789',
        'ubicacion': {
            'lat': 123.456,
            'lng': -78.910
        }
    }

    # Realizar la solicitud POST a /solicitarServicio
    solicitud_servicio = client.post('/solicitarServicio', json=datos_solicitud)
    solicitud_data = json.loads(solicitud_servicio.data)
    domicilio_id = solicitud_data['id']

    # Datos para la solicitud POST a /verificar-estado
    datos_verificacion = {
        'objectId': domicilio_id
    }

    # Realizar la solicitud POST a /verificar-estado
    estado = client.post('/verificar-estado', json=datos_verificacion)
    response_data = json.loads(estado.data)

    # Verificar si se encuentra el domicilio en la respuesta
    assert response_data['estado'] == "enviado"  # Acceder correctamente al campo 'estado' en response_data

    # Limpiar la base de datos después de la prueba
    domicilios.delete_one({'_id': ObjectId(domicilio_id)})