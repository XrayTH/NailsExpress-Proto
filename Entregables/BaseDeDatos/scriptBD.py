#pip install pymongo
from pymongo import MongoClient

def create_database_and_collections(uri, db_name, collections_data):
    # Conectar a MongoDB
    client = MongoClient(uri)
    
    # Crear o seleccionar la base de datos
    db = client[db_name]
    
    for collection_name, data in collections_data.items():
        # Crear o seleccionar la colección
        collection = db[collection_name]
        
        # Insertar los datos en la colección
        if data:
            collection.insert_many(data)
    
    print(f"Base de datos '{db_name}' y colecciones creadas correctamente.")

# Clave de MongoDB
uri = ""

# Nombre de la base de datos
db_name = "NailsExpress"

# Datos de las colecciones (nombre de la colección y datos a insertar)
collections_data = {
    "Profesional": [
        {
        "usuario":"Profesional1",
         "correo":"profesional1@gmail.com",
         "contraseña":"6d421d2182b7b3f341c3da0d7c3ed95ba189c6e1efc33d83beecc2f3542aa9216bb57b349cbd542f630075d0cd92499cd73b01e8620833599955957a25211883",
         "nombre":"Pro",
         "nombreLocal":"Valeria: Manicura & Pedicura",
         "DatosApartado":
             {
             "titulo":"Valeria: Manicura & Pedicura",
             "descripcion":"Hago tanto Manicura ($ 12000) como Pedicura ($ 13000). Ademas, de otros servicios: Cejas y Maquillaje.",
             "direccion":"Calle 12 #4-47",
             "portada":"/static/Imagenes/Nail Salon.png",
             "publicaciones":
                 [
                     {
                         "contenido":"Tus publicaciones se veran aqui.",
                         "imagenURL":""
                        }
                     ],
            "reseñas":
                [
                    {
                        "nombre":"NailsExpress",
                        "contenidoReseña":"Las reseñas apareceran aqui.",
                        "calificacion":{"$numberInt":"5"}
                        }
                    ],
            "servicios":[],
            "ubicacionLocal":{
                "lat": 3.9010542684149674,
                "lng":-76.29182929215054
                },
            "perfil": "/static/Imagenes/imagenesporDefecto/fotoPerfilporDefecto.png"
             },
            "telefonoLocal":"555",
            "ubicacion":{
                "lat": 3.9010542684149674,
                "lng":-76.29182929215054
                }
            },
            {
        "usuario":"Profesional2",
         "correo":"profesional2@gmail.com",
         "contraseña":"ddce47e32c4c1dc7d34ff4cb018353761c5eef2e6ad841535789687f4d7bcfa5cfb593ea028833fa3d108b5af9a938a97d09b068c0e2a6ac0bce6d3f301fba4b",
         "nombre":"Profesional2",
         "nombreLocal":"Uñas LA QUINTA",
         "DatosApartado":
             {
             "titulo":"Uñas LA QUINTA",
             "descripcion":"Todo tipo de pedicura a $ 14000. Ademas de otros servicios como peinados y tintes.",
             "direccion":"Calle 5 #3-30",
             "portada":"/static/Imagenes/Nail Salon.png",
             "publicaciones":
                 [
                     {
                         "contenido":"Tus publicaciones se veran aqui.",
                         "imagenURL":""
                        }
                     ],
            "reseñas":
                [
                    {
                        "nombre":"NailsExpress",
                        "contenidoReseña":"Las reseñas apareceran aqui.",
                        "calificacion":{"$numberInt":"5"}
                        }
                    ],
            "servicios":[],
            "ubicacionLocal":{
                "lat":3.895259190657771,
                "lng":-76.29341185186767
                },
            "perfil": "/static/Imagenes/imagenesporDefecto/fotoPerfilporDefecto.png"
             },
            "telefonoLocal":"333",
            "ubicacion":{
                "lat":3.895259190657771,
                "lng":-76.29341185186767
                }
            },
            {
        "usuario":"Profesional3",
         "correo":"profesional3@gmail.com",
         "contraseña":"5e56fbc9155dcdf1c13187fd80775f6c47c8e1b6d5e8208158c112fe92df87f572da002676193a95981c94de94f43e5e337d7206d79adbc5ee720669f69fd1ef",
         "nombre":"Pro3",
         "nombreLocal":"CaliUñas",
         "DatosApartado":
             {
             "titulo":"CaliUñas",
             "descripcion":"Manicura profesional, desde $ 15000. ",
             "direccion":"Cra. 43 #26c-33",
             "portada":"/static/Imagenes/Nail Salon.png",
             "publicaciones":
                 [
                     {
                         "contenido":"Tus publicaciones se veran aqui.",
                         "imagenURL":""
                        }
                     ],
            "reseñas":
                [
                    {
                        "nombre":"NailsExpress",
                        "contenidoReseña":"Las reseñas apareceran aqui.",
                        "calificacion":{"$numberInt":"5"}
                        }
                    ],
            "servicios":[],
            "ubicacionLocal":{
                "lat": 3.4127215,
                "lng": -76.51926279999999
                },
            "perfil": "/static/Imagenes/imagenesporDefecto/fotoPerfilporDefecto.png"
             },
            "telefonoLocal":"777",
            "ubicacion":{
                "lat": 3.4127215,
                "lng": -76.51926279999999
                }
            }   
    ],
    "Cliente": [
        {
            "usuario":"Cliente1",
            "correo":"cliente1@gmail.com",
            "contraseña":"1e0fe6e208b6be55e3abcbeb137bb4024ff0f0409beaaeda926aeed7340a7fb997ed506114ee8529e1215b7be621368f10720fbe5ac4f1b8822a9b2edb3c4e80",
            "datosPersonales":
                {
                    "telefono":"555"
                }
        }
    ],
    "Admin": [
        {
            "usuario":"Admin1",
            "correo":"admin1@gmail.com",
            "contraseña":"43192475f95e3820fe441daaff7c84d9b73ca3a5afc7309ae03f783151b6b0976e4d68cd990f97ad0d65ca640d35a407199d6d7510f1dff5477b8cfce1531475"
        }
    ],
    "Domicilios": [
        {
            "estado":"terminado",
            "cliente":"Cliente1",
            "profesional":"Profesional1",
            "direccion":"Carrera 13 #5_21, Centro, Guadalajara de Buga, Valle del Cauca, Colombia",
            "telefono":"555",
            "ubicacionCliente":{
                "latitud": 3.8984426,
                "longitud": -76.3014084
                },
            "ubicacionProfesional":
                {"latitud": 3.8984412,
                 "longitud": -76.3013947 
                 },
            "inicio":"2024-06-18T11:53:39.221360",
            "fin":"2024-06-18T12:01:24.631350"
        }
    ]
}

create_database_and_collections(uri, db_name, collections_data)
