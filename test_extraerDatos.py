import pytest
from app import app, profesionales, clientes, administradores, extraerDatosSesion
from bson.objectid import ObjectId

@pytest.fixture(scope='function')
def setup_database():

    profesional_id = profesionales.insert_one({
        'nombre': 'Juan',
        'correo': 'juan@example.com',
        'contraseña': 'password123'
    }).inserted_id

    # Insertar datos de prueba en la colección de clientes
    cliente_id = clientes.insert_one({
        'nombre': 'María',
        'correo': 'maria@example.com',
        'contraseña': 'password456'
    }).inserted_id

    # Insertar datos de prueba en la colección de administradores
    administrador_id = administradores.insert_one({
        'nombre': 'Admin',
        'correo': 'admin@example.com',
        'contraseña': 'adminpass'
    }).inserted_id

    # Llamar a la función de prueba
    yield

    # Después de cada prueba, limpiar la base de datos
    profesionales.delete_one({'_id': ObjectId(profesional_id)})
    clientes.delete_one({'_id': ObjectId(cliente_id)})
    administradores.delete_one({'_id': ObjectId(administrador_id)})

def test_extraerDatosSesion_profesional(setup_database):
    email = 'juan@example.com'
    with app.test_request_context('/'):
        resultado = extraerDatosSesion(email)
        assert resultado['nombre'] == 'Juan'

def test_extraerDatosSesion_cliente(setup_database):
    email = 'maria@example.com'
    with app.test_request_context('/'):
        resultado = extraerDatosSesion(email)
        assert resultado['nombre'] == 'María'

def test_extraerDatosSesion_administrador(setup_database):
    email = 'admin@example.com'
    with app.test_request_context('/'):
        resultado = extraerDatosSesion(email)
        assert resultado['nombre'] == 'Admin'

def test_extraerDatosSesion_desconectado(setup_database):
    email = 'usuario_desconocido@example.com'
    with app.test_request_context('/'):
        resultado = extraerDatosSesion(email)
        assert resultado is None

