from conexion import *
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import googlemaps

load_dotenv()

# Configura la conexión a MongoDB Atlas
mongo_key = os.getenv('MONGO')
client = MongoClient(mongo_key)
db = client.pruebas  # Reemplaza 'test_database' con el nombre de tu base de datos
# Definir una colección en la base de datos
profesionales = db.Profesional
clientes = db.Cliente


google_maps_api_key = os.getenv('GOOGLE_MAPS_API_KEY')
if not google_maps_api_key:
    raise ValueError("No se ha proporcionado la clave de API de Google Maps. Asigne su clave a la variable de entorno 'GOOGLE_MAPS_API_KEY'.")

# Configurar la instancia de cliente de Google Maps
gmaps = googlemaps.Client(key=google_maps_api_key)

@app.route('/')
def index():
    # Obtener todos los elementos de la colección
    perfiles_get = list(profesionales.find()) + list(clientes.find())
    return render_template('index.html', perfiles=perfiles_get)

@app.route('/inicio.html')
def inicio():
    return render_template('inicio.html')

@app.route('/registro.html')
def registro():
    return render_template('registro.html')

@app.route('/login', methods=['POST'])
def login():
    # Obtener los datos del formulario
    email = request.form['email']
    password = request.form['password']

    # Verificar si el correo está en la colección de profesionales
    profesional = profesionales.find_one({'correo': email})
    if profesional:
        if profesional['contraseña'] == password:
            # Inicio de sesión exitoso para profesional
            return redirect(url_for('mapa'))
        else:
            # Contraseña incorrecta para profesional
            return 'Contraseña incorrecta. Inténtalo de nuevo.'

    # Verificar si el correo está en la colección de clientes
    cliente = clientes.find_one({'correo': email})
    if cliente:
        if cliente['contraseña'] == password:
            # Inicio de sesión exitoso para cliente
            return redirect(url_for('mapa'))
        else:
            # Contraseña incorrecta para cliente
            return 'Contraseña incorrecta. Inténtalo de nuevo.'

    # El correo no está en ninguna colección
    return 'Correo no registrado. Regístrate primero.'

@app.route('/mapa.html')
def mapa():
    # Definir la ubicación
    place = 'Universidad del Valle sede Buga, Guadalajara de Buga, Valle del Cauca, Colombia'
    
    # Obtener las coordenadas de la ubicación
    geocode_result = gmaps.geocode(place)

    # Procesar la respuesta de la API de Google Maps
    if geocode_result:
        location = geocode_result[0]['geometry']['location']
        lat = location.get('lat')
        lng = location.get('lng')
    else:
        # Manejar el caso en el que no se encuentren resultados para la ubicación
        lat = 0
        lng = 0
        
    # Pasar la clave de API y las coordenadas como variables de contexto
    return render_template('mapa.html', google_maps_api_key=google_maps_api_key, lat=lat, lng=lng)

if __name__ == '__main__':
    app.run(debug=True)

