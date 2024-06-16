import pytest
from flask import session
from flask import url_for, redirect, render_template
from app import app  # Importa tu aplicación Flask

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_redirigir_por_tipo_profesional(client):
    with client.session_transaction() as sess:
        sess['tipo'] = 'profesional'
    response = client.get('/pantalla_inicio')  # Ruta ficticia para activar la función de redireccionamiento
    assert response.status_code == 302  # Debe redirigir (código 302)
    assert response.location == url_for('pantalla_inicio_pro')

def test_redirigir_por_tipo_cliente(client):
    with client.session_transaction() as sess:
        sess['tipo'] = 'cliente'
    response = client.get('/pantalla_inicio')  # Ruta ficticia para activar la función de redireccionamiento
    assert response.status_code == 302  # Debe redirigir (código 302)
    assert response.location == url_for('pantalla_inicio_cli')

def test_redirigir_por_tipo_administrador(client):
    with client.session_transaction() as sess:
        sess['tipo'] = 'administrador'
    response = client.get('/pantalla_inicio')  # Ruta ficticia para activar la función de redireccionamiento
    assert response.status_code == 302  # Debe redirigir (código 302)
    assert response.location == url_for('pantalla_inicio_admin')

def test_redirigir_por_tipo_desconectado(client):
    with client.session_transaction() as sess:
        if 'tipo' in sess:
            del sess['tipo']  # Simula un usuario desconectado
    response = client.get('/pantalla_inicio')  # Ruta ficticia para activar la función de redireccionamiento
    assert response.status_code == 200  # Debe renderizar la plantilla pantalla_inicio.html

