from conexion import *
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import googlemaps
import hashlib

load_dotenv()

def sha512_generator(str):
    m = hashlib.sha512()
    m.update(str.encode())
    return m.hexdigest()

secret_key = os.getenv('SECRET_KEY')

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
    nombre_usuario = "Desconectado"
    perfiles_get = list(profesionales.find()) + list(clientes.find())
    
    if 'Alerta_Index_Count' in session:
        if session.get('Alerta_Index') != "":
            session['Alerta_Index_Count'] = session['Alerta_Index_Count'] + 1   
            if session['Alerta_Index_Count'] > 1:
                session['Alerta_Index'] = ""
    
    
    alerta = session.get('Alerta_Index')
    
    if 'email' in session:
        email = session['email']
        # Verificar si el correo está en la colección de profesionales
        profesional = profesionales.find_one({'correo': email})
        if profesional:
            nombre_usuario = profesional['usuario']
        else:
            # Verificar si el correo está en la colección de clientes
            cliente = clientes.find_one({'correo': email})
            if cliente:
                nombre_usuario = cliente['usuario']

    return render_template('index.html', perfiles=perfiles_get, nombre_usuario=nombre_usuario, alerta=alerta)

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

    # Generar el hash SHA-512 de la contraseña proporcionada
    hashed_password = sha512_generator(password)

    # Verificar si el correo está en la colección de profesionales
    profesional = profesionales.find_one({'correo': email})
    if profesional:
        if profesional['contraseña'] == hashed_password:
            # Inicio de sesión exitoso para profesional
            session['email'] = email  # Almacenar el correo en la sesión

            session['Tipo_Usuario'] = "profesional"
  
            return redirect(url_for('mapa'))
        else:
            # Contraseña incorrecta para profesional
            return 'Contrasena incorrecta. Intentalo de nuevo.'

    # Verificar si el correo está en la colección de clientes
    cliente = clientes.find_one({'correo': email})
    if cliente:
        if cliente['contraseña'] == hashed_password:
            # Inicio de sesión exitoso para cliente
            session['email'] = email  # Almacenar el correo en la sesión

            session['Tipo_Usuario'] = "cliente"

            return redirect(url_for('mapa'))
        else:
            # Contraseña incorrecta para cliente
            return 'Contrasena incorrecta. Intentalo de nuevo.'

    # El correo no está en ninguna colección
    return 'Correo no registrado. Registrate primero.'

@app.route('/register', methods=['POST'])
def register():
    tipo_usuario = request.form.get('tipo_usuario')
    usuario = request.form.get('usuario')
    email = request.form.get('email')
    password = request.form.get('password')
    
    # Verificar si el correo ya está registrado
    if profesionales.find_one({'correo': email}) or clientes.find_one({'correo': email}):
        return 'El correo electrónico ya está registrado. Utiliza otro correo electrónico.'

    # Verificar si el usuario ya está registrado
    if profesionales.find_one({'usuario': usuario}) or clientes.find_one({'usuario': usuario}):
        return 'El usuario ya está registrado. Por favor, elige otro nombre de usuario.'

    # Generar el hash SHA-512 de la contraseña proporcionada
    hashed_password = sha512_generator(password)

    if tipo_usuario == 'profesional':
        nombre = request.form.get('nombre')
        nombre_local = request.form.get('nombre_local')
        direccion = request.form.get('direccion')
        telefono_local = request.form.get('telefono_local')
        ciudad = request.form.get('ciudad')
        pais = request.form.get('pais')
        departamento = request.form.get('departamento')
        cod_postal = request.form.get('cod_postal')
        
        # Generar coordenada válida para el local
        location = gmaps.geocode(direccion + ', ' + ciudad + ', ' + departamento + ', ' + pais + ', ' + cod_postal)
        if location:
            lat = location[0]['geometry']['location']['lat']
            lng = location[0]['geometry']['location']['lng']
        else:
            return 'No se pudo encontrar la ubicación especificada.'
        
        # Insertar datos del profesional en la base de datos
        profesionales.insert_one({
            'usuario': usuario,
            'correo': email,
            'contraseña': hashed_password,
            'nombre': nombre,
            'nombreLocal': nombre_local,
            'telefonoLocal': telefono_local,
            'DatosApartado': {
                            titulo: nombre_local,
                            descripcion: "Descripcion aqui.",
                            perfil: "/static/Imagenes/imagenesporDefecto/fotoPerfilporDefecto.png",
                            portada: "/static/Imagenes/Nail Salon.png",
                            servicios: [],
                            direccion: direccion,
                            ubicacionLocal: {'lat': lat, 'lng': lng},
                            reseñas: [
                                {
                                    nombre: "NailsExpress",
                                    contenidoReseña: "Las reseñas apareceran aqui.",
                                    calificacion: 5
                                }
                                ],
                            publicaciones: [
                                {
                                    contenido: 'Tus publicaciones se veran aqui.',
                                    imagenURL: ''
                                }
                            ]
                        },
            'ubicacion': {'lat': lat, 'lng': lng}
        })

    elif tipo_usuario == 'cliente':
        telefono= request.form.get('telefono')
        # Insertar datos del cliente en la base de datos
        clientes.insert_one({
            'usuario': usuario,
            'correo': email,
            'contraseña': hashed_password,
            'datosPersonales': {'telefono' : telefono}
        })

    return 'Registro exitoso.'

@app.route('/logout', methods=['POST'])
def logout():
    # Eliminar la información de la sesión
    session.pop('email', None)
    # Redirigir al usuario a la página de inicio
    return redirect(url_for('index'))

@app.route('/mapa.html')
def mapa():
    # Verificar si hay un valor en la sesión para la clave 'email'
    if 'email' in session and session.get('Tipo_Usuario') == 'cliente':
        place = 'Universidad del Valle sede Buga, Guadalajara de Buga, Valle del Cauca, Colombia'
        lugares_get = list(profesionales.find({}, {'_id': 0}))
        usuario_get = clientes.find_one({'correo': session.get('email')})

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
        return render_template('mapa.html', google_maps_api_key=google_maps_api_key, lat=lat, lng=lng, lugares=lugares_get, usu=usuario_get)
    else:
        # Si no hay un valor en la sesión para la clave 'email', redirigir al usuario a index.html con mensaje de alerta
        session['Alerta_Index'] = "¡Inicia Sesion!"
        session['Alerta_Index_Count'] = 0
        return redirect(url_for('index'))

@app.route('/apar_pro')
def apar_pro():
    profesional_get = profesionales.find_one(
    { 'usuario': "Profesional1" },
    { '_id': 0, 'contraseña': 0, 'correo': 0 }
)
    return render_template('apar_pro.html', google_maps_api_key=google_maps_api_key, profesional=profesional_get)

@app.route('/apar_Cli')
def apar_cli():
    return render_template('apar_Cli.html', google_maps_api_key=google_maps_api_key)

@app.route('/pantalla_inicio')
def pantalla_inicio():
    return render_template('pantalla_inicio.html')

@app.route('/pantalla_inicio_cli')
def pantalla_inicio_Cli():
    return render_template('pantalla_inicio_cli.html')

@app.route('/pantalla_inicio_pro')
def pantalla_inicio_Pro():
    return render_template('pantalla_inicio_pro.html')

@app.route('/pantalla_inicio_admin')
def pantalla_inicio_Admin():
    return render_template('pantalla_inicio_admin.html')

@app.route('/admin')
def admin():
    perfiles_get = list(profesionales.find()) + list(clientes.find())
    return render_template('admin.html', perfiles=perfiles_get)

@app.route('/eliminar', methods=['POST'])
def eliminar_perfil():
    usuario = request.form.get('usuario')

    # Eliminar de la colección de profesionales
    resultado_profesional = profesionales.delete_one({'usuario': usuario})
    # Si no estaba en profesionales, intenta eliminar de la colección de clientes
    if resultado_profesional.deleted_count == 0:
        clientes.delete_one({'usuario': usuario})

    return redirect(url_for('admin'))

if __name__ == '__main__':
    app.run(debug=True)
    

def updateRating(apartado, rating):
    # Aquí iría la lógica para actualizar la calificación en la base de datos o realizar otras acciones necesarias
    apartado['calificacion'] = rating
    print('Calificación actualizada:', rating)

# Supongamos que tienes un objeto `apartado` y una nueva calificación
apartado = {}  # Tu objeto apartado
nueva_calificacion = 4  # Por ejemplo, una nueva calificación

# Llama a la función `updateRating` con el objeto `apartado` y la nueva calificación
updateRating(apartado, nueva_calificacion)
