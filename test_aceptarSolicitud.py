import pytest
from app import app, domicilios, session, extraerDatosSesion  # Asegúrate de importar tu aplicación Flask y la colección de MongoDB
import json
from bson.objectid import ObjectId
from unittest.mock import patch

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.secret_key = 'testing'  # Establece una clave secreta para las sesiones en el entorno de prueba
    client = app.test_client()

    # Simular la sesión para la prueba
    with client.session_transaction() as sess:
        sess['email'] = 'profesional@example.com'  # Simula un usuario profesional con un correo electrónico

    yield client

@patch('app.extraerDatosSesion')
def test_aceptar_solicitud(mock_extraerDatosSesion, client):
    # Mockear la función extraerDatosSesion para devolver datos simulados
    mock_extraerDatosSesion.return_value = {'usuario': 'usuario_profesional'}

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

    # Datos para la solicitud POST a /aceptarSolicitud
    datos_aceptar = {
        'id': domicilio_id,
        'ubicacion': {
            'lat': 1.234,
            'lng': -9.876
        }
    }

    # Realizar la solicitud POST a /aceptarSolicitud
    aceptar = client.post('/aceptarSolicitud', json=datos_aceptar)
    response_data = json.loads(aceptar.data)

    # Verificar si el domicilio se aceptó correctamente
    assert response_data['message'] == 'Domicilio aceptado correctamente'
    assert response_data['id'] == domicilio_id

    # Verificar el estado del domicilio en la base de datos
    domicilio_actualizado = domicilios.find_one({'_id': ObjectId(domicilio_id)})
    assert domicilio_actualizado['estado'] == 'aceptado'
    assert domicilio_actualizado['profesional'] == 'usuario_profesional'

    # Limpiar la base de datos después de la prueba
    domicilios.delete_one({'_id': ObjectId(domicilio_id)})
