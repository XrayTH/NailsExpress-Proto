import pytest
from app import app, profesionales, clientes  # Importa la aplicación Flask y las colecciones necesarias
import json

@pytest.fixture
def test_client():
    with app.test_client() as client:
        yield client

def test_actualizar_datos_profesional(test_client):
    # Simular la inserción de un profesional de prueba
    profesional_data = {
        'usuario': 'test_profesional_actualizar',
        'correo': 'test_profesional_actualizar@example.com',
        'contrasena': 'test_password',
        'nombre': 'Nombre Inicial',
        'nombre_local': 'Local Inicial',
        'telefono_local': '1234567890',
        'DatosApartado': {},
        'ubicacionLocal': {
            'lat': 0.0,
            'lng': 0.0
        }
    }

    # Insertar el profesional de prueba en la base de datos
    profesionales.insert_one(profesional_data)

    # Datos nuevos para actualizar
    nuevos_datos = {
        'usuario': 'test_profesional_actualizar',
        'DatosApartado': {
            'titulo': 'Nuevo Título',
            'descripcion': 'Nueva Descripción',
            'perfil': '/nueva/ruta/perfil.png',
            'portada': '/nueva/ruta/portada.png',
            'servicios': ['Servicio 1', 'Servicio 2'],
            'direccion': 'Nueva Dirección',
            'ubicacionLocal': {
                'lat': 1.0,
                'lng': 1.0
            },
            'reseñas': [
                {
                    'nombre': 'Nuevo Reseñador',
                    'contenidoReseña': 'Nueva Reseña',
                    'calificacion': 4
                }
            ],
            'publicaciones': [
                {
                    'contenido': 'Nueva Publicación',
                    'imagenURL': '/nueva/ruta/publicacion.png'
                }
            ]
        }
    }

    # Enviar solicitud POST para actualizar los datos del profesional
    response = test_client.post('/actualizarDatos', json={'usuario': 'test_profesional_actualizar', 'apartado': nuevos_datos['DatosApartado']})

    # Verificar que la respuesta sea exitosa (código 200)
    assert response.status_code == 200

    # Verificar que los datos del profesional se hayan actualizado correctamente en la base de datos
    profesional_actualizado = profesionales.find_one({'usuario': 'test_profesional_actualizar'})
    assert profesional_actualizado is not None
    assert profesional_actualizado['DatosApartado']['titulo'] == 'Nuevo Título'
    assert profesional_actualizado['DatosApartado']['descripcion'] == 'Nueva Descripción'
    assert profesional_actualizado['DatosApartado']['perfil'] == '/nueva/ruta/perfil.png'
    assert profesional_actualizado['DatosApartado']['portada'] == '/nueva/ruta/portada.png'
    assert profesional_actualizado['DatosApartado']['servicios'] == ['Servicio 1', 'Servicio 2']
    assert profesional_actualizado['DatosApartado']['direccion'] == 'Nueva Dirección'
    assert profesional_actualizado['DatosApartado']['ubicacionLocal']['lat'] == 1.0
    assert profesional_actualizado['DatosApartado']['ubicacionLocal']['lng'] == 1.0
    assert len(profesional_actualizado['DatosApartado']['reseñas']) == 1
    assert profesional_actualizado['DatosApartado']['reseñas'][0]['nombre'] == 'Nuevo Reseñador'
    assert profesional_actualizado['DatosApartado']['reseñas'][0]['contenidoReseña'] == 'Nueva Reseña'
    assert profesional_actualizado['DatosApartado']['reseñas'][0]['calificacion'] == 4
    assert len(profesional_actualizado['DatosApartado']['publicaciones']) == 1
    assert profesional_actualizado['DatosApartado']['publicaciones'][0]['contenido'] == 'Nueva Publicación'
    assert profesional_actualizado['DatosApartado']['publicaciones'][0]['imagenURL'] == '/nueva/ruta/publicacion.png'

    
    profesionales.delete_one({'usuario': 'test_profesional_actualizar'})

