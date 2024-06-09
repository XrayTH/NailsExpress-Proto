from flask import Flask, session, render_template, request, redirect, url_for, jsonify
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Obtener la clave secreta del archivo .env
secret_key = os.getenv('SECRET_KEY')

# Crear la instancia de la aplicación Flask
app = Flask(__name__)
app.secret_key = secret_key
