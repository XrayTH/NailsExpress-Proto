from conexion import *
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import googlemaps
import hashlib

load_dotenv()

secret_key = os.getenv('SECRET_KEY')

# Configura la conexión a MongoDB Atlas
mongo_key = os.getenv('MONGO')
client = MongoClient(mongo_key)
db = client.pruebas  
profesionales = db.Profesional
clientes = db.Cliente
administradores = db.Admin


google_maps_api_key = os.getenv('GOOGLE_MAPS_API_KEY')
if not google_maps_api_key:
    raise ValueError("No se ha proporcionado la clave de API de Google Maps. Asigne su clave a la variable de entorno 'GOOGLE_MAPS_API_KEY'.")

gmaps = googlemaps.Client(key=google_maps_api_key)

def sha512_generator(str):
    m = hashlib.sha512()
    m.update(str.encode())
    return m.hexdigest()

def extraerDatosSesion(email):
    if not email:
        return None
    
    # Buscar el usuario en la colección de profesionales
    profesional = profesionales.find_one({'correo': email})
    if profesional:
        session['tipo'] = "profesional"
        return profesional
    
    # Buscar el usuario en la colección de clientes
    cliente = clientes.find_one({'correo': email})
    if cliente:
        session['tipo'] = "cliente"
        return cliente
    
    # Buscar el usuario en la colección de administradores
    administrador = administradores.find_one({'correo': email})
    if administrador:
        session['tipo'] = "administrador"
        return administrador
    
    session['tipo'] = "Desconectado"
    return None

def redirigir_por_tipo():
    if 'tipo' not in session:
        return render_template('pantalla_inicio.html')
    
    tipo = session['tipo']
    if tipo == "profesional":
        return redirect(url_for('pantalla_inicio_pro'))
    elif tipo == "cliente":
        return redirect(url_for('pantalla_inicio_cli'))
    elif tipo == "administrador":
        return redirect(url_for('pantalla_inicio_admin'))
    else:
        return render_template('pantalla_inicio.html')

@app.route('/')
def index():
    return redirect(url_for('pantalla_inicio'))

@app.route('/inicio')
def inicio():
    return render_template('inicio.html')

@app.route('/registro')
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
            return redirect(url_for('pantalla_inicio_pro'))
        else:
            # Contraseña incorrecta para profesional
            return render_template('alerta.html', alerta="Contraseña incorrecta. Inténtalo de nuevo.")

    # Verificar si el correo está en la colección de clientes
    cliente = clientes.find_one({'correo': email})
    if cliente:
        if cliente['contraseña'] == hashed_password:
            # Inicio de sesión exitoso para cliente
            session['email'] = email  # Almacenar el correo en la sesión
            return redirect(url_for('pantalla_inicio_cli'))
        else:
            # Contraseña incorrecta para cliente
            return render_template('alerta.html', alerta="Contraseña incorrecta. Inténtalo de nuevo.")

    # El correo no está en ninguna colección
    return render_template('alerta.html', alerta="Correo no registrado. Regístrate primero.")

@app.route('/register', methods=['POST'])
def register():
    tipo_usuario = request.form.get('tipo_usuario')
    usuario = request.form.get('usuario')
    email = request.form.get('email')
    password = request.form.get('password')
    
    # Verificar si el correo ya está registrado
    if profesionales.find_one({'email': email}) or clientes.find_one({'email': email}):
        return render_template('alerta.html', alerta='El correo electrónico ya está registrado. Utiliza otro correo electrónico.')

    # Verificar si el usuario ya está registrado
    if profesionales.find_one({'usuario': usuario}) or clientes.find_one({'usuario': usuario}):
        return render_template('alerta.html', alerta='El usuario ya está registrado. Por favor, elige otro nombre de usuario.')

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
            return render_template('alerta.html', alerta='No se pudo encontrar la ubicación especificada.')
        
        # Insertar datos del profesional en la base de datos
        profesionales.insert_one({
            'usuario': usuario,
            'correo': email,
            'contraseña': hashed_password,
            'nombre': nombre,
            'nombreLocal': nombre_local,
            'telefonoLocal': telefono_local,
            'DatosApartado': {
                            'titulo': nombre_local,
                            'descripcion': "Descripcion aqui.",
                            'perfil': "/static/Imagenes/imagenesporDefecto/fotoPerfilporDefecto.png",
                            'portada': "/static/Imagenes/Nail Salon.png",
                            'servicios': [],
                            'direccion': direccion,
                            'ubicacionLocal': {'lat': lat, 'lng': lng},
                            'reseñas': [
                                {
                                    'nombre': "NailsExpress",
                                    'contenidoReseña': "Las reseñas apareceran aqui.",
                                    'calificacion': 5
                                }
                                ],
                            'publicaciones': [
                                {
                                    'contenido': 'Tus publicaciones se veran aqui.',
                                    'imagenURL': ''
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

    return render_template('alerta.html', alerta='Registro exitoso. Inicie Sesión.')

@app.route('/logout', methods=['POST'])
def logout():
    # Eliminar la información de la sesión
    session.pop('email', None)
    session.pop('tipo', None)
    # Redirigir al usuario a la página de inicio
    return redirect(url_for('index'))

@app.route('/mapa')
def mapa():
    try:
        datos_usuario = extraerDatosSesion(session['email'])
    except KeyError:
        session['tipo'] = ""
    
    if session.get('tipo') != "cliente":
        return redirigir_por_tipo()
    
    # Definir la ubicación
    place = 'Universidad del Valle sede Buga, Guadalajara de Buga, Valle del Cauca, Colombia'
    lugares_get = list(profesionales.find({}, {'_id': 0}))
    print(lugares_get)
    
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
    return render_template('mapa.html', google_maps_api_key=google_maps_api_key, lat=lat, lng=lng, lugares=lugares_get, usu=datos_usuario)

@app.route('/apar_pro')
def apar_pro():
    
    try:
        datos_usuario = extraerDatosSesion(session['email'])
    except KeyError:
        session['tipo'] = ""
    
    if session.get('tipo') != "profesional":
        return redirigir_por_tipo()
    
    profesional_get = profesionales.find_one(
    { 'usuario': datos_usuario['usuario'] },
    { '_id': 0, 'contraseña': 0, 'correo': 0 }
    )
    return render_template('apar_pro.html', google_maps_api_key=google_maps_api_key, profesional=profesional_get)

@app.route('/apar_Cli')
def apar_cli():
    
    try:
        datos_usuario = extraerDatosSesion(session['email'])
    except KeyError:
        session['tipo'] = ""
    
    if session.get('tipo') != "cliente":
        return redirigir_por_tipo()
    
    profesional_get = profesionales.find_one(
    { 'usuario': "Profesional1" },
    { '_id': 0, 'contraseña': 0, 'correo': 0 }
    )
    return render_template('apar_Cli.html', google_maps_api_key=google_maps_api_key, profesional=profesional_get)

@app.route('/pantalla_inicio')
def pantalla_inicio():
    return redirigir_por_tipo()

@app.route('/pantalla_inicio_cli')
def pantalla_inicio_cli():
    try:
        datos_usuario = extraerDatosSesion(session['email'])
    except KeyError:
        session['tipo'] = ""
    
    if session.get('tipo') != "cliente":
        return redirigir_por_tipo()
    
    return render_template('pantalla_inicio_cli.html', usu=datos_usuario)

@app.route('/pantalla_inicio_pro')
def pantalla_inicio_pro():
    try:
        datos_usuario = extraerDatosSesion(session['email'])
    except KeyError:
        session['tipo'] = ""
    
    if session.get('tipo') != "profesional":
        return redirigir_por_tipo()
    
    return render_template('pantalla_inicio_pro.html', usu=datos_usuario)

@app.route('/pantalla_inicio_admin')
def pantalla_inicio_admin():
    if session.get('tipo') != "administrador":
        return redirigir_por_tipo()
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

@app.route('/agregarResena', methods=['POST'])
def agregar_resena():
    nueva_reseña = request.json
    profesional_usuario = nueva_reseña.get('usuario')
    
    if not profesional_usuario:
        return jsonify({'success': False, 'message': 'Usuario no especificado.'})

    # Buscar el profesional en la base de datos
    profesional = profesionales.find_one({'usuario': profesional_usuario})

    if profesional:
        # Añadir la nueva reseña al arreglo de reseñas
        profesionales.update_one(
            {'usuario': profesional_usuario},
            {'$push': {'DatosApartado.reseñas': {
                'nombre': nueva_reseña['nombre'],
                'contenidoReseña': nueva_reseña['contenidoReseña'],
                'calificacion': nueva_reseña['calificacion']
            }}}
        )
        return jsonify({'success': True, 'message': 'Reseña añadida con éxito.'})
    else:
        return jsonify({'success': False, 'message': 'Profesional no encontrado.'})
    
@app.route('/guardar-publicacion', methods=['POST'])
def guardar_publicacion():
    # Obtener los datos de la publicación enviados desde el cliente
    nueva_publicacion = request.json
    profesional_usuario = nueva_publicacion.get('usuario')
    
    if not profesional_usuario:
        return jsonify({'success': False, 'message': 'Usuario no especificado.'})
    
    profesional = profesionales.find_one({'usuario': profesional_usuario})

    if profesional:
        # Añadir la nueva reseña al arreglo de reseñas
        profesionales.update_one(
            {'usuario': profesional_usuario},
            {'$push': {'DatosApartado.publicaciones': {
                'contenido': nueva_publicacion['contenido'],
                'imagenURL': nueva_publicacion['imagenURL']
            }}}
        )
        return jsonify({'success': True, 'message': 'Reseña añadida con éxito.'})
    else:
        return jsonify({'success': False, 'message': 'Profesional no encontrado.'})

@app.route('/actualizarDatos', methods=['POST'])
def guardar_datos():
    # Obtener los datos de la publicación enviados desde el cliente
    datos = request.json.get('apartado')
    profesional_usuario = request.json.get('usuario')
           
    if not profesional_usuario:
        return jsonify({'success': False, 'message': 'Usuario no especificado.'})

    profesional = profesionales.find_one({'usuario': profesional_usuario})

    if profesional:
        # Añadir la nueva reseña al arreglo de reseñas
        profesionales.update_one(
            {'usuario': profesional_usuario},
            {'$set': 
                {
                'nombreLocal': datos['titulo'],
                'DatosApartado': datos,
                'ubicacion': datos['ubicacionLocal']
                }
            }
        )
        return jsonify({'success': True, 'message': 'Reseña añadida con éxito.'})
    else:
        return jsonify({'success': False, 'message': 'Profesional no encontrado.'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
