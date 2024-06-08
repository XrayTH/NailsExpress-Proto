// Variable booleana para indicar si el modo de edición está activo
var modoEdicionActivo = false;
var map, marker;

var apartado = {
    titulo: "Nombre Local",
    descripcion: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eligendi officiis cumque architecto recusandae harum corporis quis dolore nemo praesentium adipisci autem iste beatae ipsum molestiae non perspiciatis, reprehenderit possimus.",
    perfil: "/static/Imagenes/imagenesporDefecto/fotoPerfilporDefecto.png",
    portada: "/static/Imagenes/Nail Salon.png",
    servicios: ["manicura", "pedicura"],
    direccion: "calle queteimporta",
    ubicacionLocal: { lat: 3.9010685, lng: -76.29175690000001 },
    reseñas: [
        {
            nombre: "pepe",
            contenidoReseña: "Me dejó las uñas del culo",
            calificacion: 1
        },
        {
            nombre: "ekisPersona",
            contenidoReseña: "shido",
            calificacion: 5
        },
        {
            nombre: "yePersona",
            contenidoReseña: "meh",
            calificacion: 3
        }
    ],
    publicaciones: [
        {
            contenido: 'Nuevos decorados',
            imagenURL: '/static/Imagenes/Logo_amplio.png'
        },
        {
            contenido: 'Nuevas cosas muy pronto...',
            imagenURL: ''
        }
    ]
};

// Función para inicializar el mapa
function initMap() {
    var customMapStyle = [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }] // Ocultar etiquetas de puntos de interés
        }
    ];

    // Configuración del mapa
    const mapOptions = {
        center: apartado.ubicacionLocal,
        zoom: 15,
        styles: customMapStyle
    };

    // Crear el mapa y añadirlo al div con id 'map'
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Añadir un marcador en la ubicación
    marker = new google.maps.Marker({
        position: apartado.ubicacionLocal,
        map: map,
        title: apartado.titulo,
        icon: {
            url: 'https://maps.gstatic.com/mapfiles/ms2/micons/pink-dot.png'
        }
    });

    map.addListener('click', function(event) {
        handleMapClick(event.latLng);
    });
}

// Función para activar el modo de edición
function modoEdicion(modo) {
    modoEdicionActivo = modo;
    console.log(modoEdicionActivo);
}

document.addEventListener("DOMContentLoaded", function() {
    console.log('Datos:', apartado);

    // Bloquear las funciones de subir foto de perfil y portada al cargar la página
    document.getElementById("input-foto-portada").disabled = true;
    document.getElementById("input-foto-perfil").disabled = true;
    document.getElementById("text-box").disabled = true;
    document.getElementById("nombre-profesional").disabled = true; // Bloquear la edición del nombre del profesional
    document.getElementById("descripcion-profesional").disabled = true; // Bloquear la edición de la descripción del profesional

    // Cargar nombre y descripción del profesional desde el objeto 'apartado'
    document.getElementById("nombre-profesional").value = apartado.titulo;
    document.getElementById("descripcion-profesional").value = apartado.descripcion;
    document.getElementById("text-box").value = apartado.direccion;
    document.getElementById("foto-perfil").src = apartado.perfil;
    document.getElementById("foto-portada").src = apartado.portada;

    cargarDatosIniciales();

    // Agregar evento al botón de publicar
    const publicarBtn = document.getElementById('publicar-btn');
    publicarBtn.addEventListener('click', function() {
        const publicacionInput = document.getElementById('publicacion-input');
        const imagenInput = document.getElementById('imagen-input');
        const imagenPreview = document.getElementById('imagen-preview');
        const contenido = publicacionInput.value;
        const imagenURL = imagenPreview.src;

        if (contenido.trim() || imagenURL) {
            agregarPublicacion(contenido, imagenURL);
            publicacionInput.value = ''; // Limpiar el campo de texto
            imagenInput.value = ''; // Limpiar el campo de carga de imágenes
            imagenPreview.src = '#'; // Limpiar la vista previa de la imagen
            imagenPreview.style.display = 'none'; // Ocultar la vista previa
        } else {
            alert('La publicación no puede estar en blanco');
        }
    });

    function cargarDatosIniciales() {
        // Mostrar las reseñas guardadas en el objeto 'apartado'
        document.querySelector('.review-list').innerHTML = ''; // Limpiar el contenido previo
        apartado.reseñas.slice().reverse().forEach(mostrarReseña);
    
        // Mostrar las publicaciones guardadas en el objeto 'apartado'
        document.querySelector('.post-list').innerHTML = ''; // Limpiar el contenido previo
        apartado.publicaciones.forEach(mostrarPublicacion);
    }

    // Mostrar vista previa de la imagen seleccionada
    const imagenInput = document.getElementById('imagen-input');
    const imagenPreview = document.getElementById('imagen-preview');

    imagenInput.addEventListener('change', function() {
        const file = imagenInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function() {
                imagenPreview.src = reader.result;
                imagenPreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            imagenPreview.src = '#';
            imagenPreview.style.display = 'none';
        }
    });

    const reviewForm = document.querySelector('.review-form');
    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente

        // Obtener el contenido de la reseña
        const reviewContent = document.querySelector('.review-content').value;

        // Agregar la reseña al DOM
        agregarReseña(reviewContent);

        // Limpiar el contenido del campo de reseña
        document.querySelector('.review-content').value = '';
    });
});

// Función para manejar el evento de clic izquierdo en el mapa
function handleMapClick(latLng) {
    // Verificar si el modo de edición está activo
    if (modoEdicionActivo) {
        // Obtener las coordenadas de la posición donde se hizo clic
        const nuevaUbicacion = {
            lat: latLng.lat(),
            lng: latLng.lng()
        };

        // Cambiar el cursor de lugar
        map.setOptions({ draggableCursor: 'crosshair' });

        // Actualizar la ubicación en el objeto apartado
        apartado.ubicacionLocal = nuevaUbicacion;

        // Actualizar el marcador en el mapa
        marker.setPosition(nuevaUbicacion);
    }
}

// Función para manejar el clic en el botón de editar en el encabezado
function handleEditProfile() {
    modoEdicion(true);

    // Desbloquear las funciones de subir foto de perfil y portada cuando se hace clic en editar
    document.getElementById("input-foto-portada").disabled = false;
    document.getElementById("input-foto-perfil").disabled = false;
    document.getElementById("text-box").disabled = false;
    document.getElementById("nombre-profesional").disabled = false; // Desbloquear la edición del nombre del profesional
    document.getElementById("descripcion-profesional").disabled = false; // Desbloquear la edición de la descripción del profesional

    // También hacer visible el botón de guardar
    document.getElementById("saveProfileBtn").style.display = "inline-block";
    document.getElementById("editProfileBtn").style.display = "none";
}

// Función para manejar el clic en el botón de guardar en el encabezado
function handleSaveProfile() {
    modoEdicion(false);

    // Obtener los valores editados
    const nuevoTitulo = document.getElementById("nombre-profesional").value;
    const nuevaDescripcion = document.getElementById("descripcion-profesional").value;
    const nuevaDireccion = document.getElementById("text-box").value;
    const nuevaFotoPerfil = obtenerURLImagen("input-foto-perfil");
    const nuevaFotoPortada = obtenerURLImagen("input-foto-portada");

    // Actualizar los valores en el objeto apartado
    if (nuevoTitulo.trim() !== '') {
        apartado.titulo = nuevoTitulo;
    }
    if (nuevaDescripcion.trim() !== '') {
        apartado.descripcion = nuevaDescripcion;
    }
    if (nuevaDireccion.trim() !== '') {
        apartado.direccion = nuevaDireccion;
    }
    if (nuevaFotoPerfil) {
        agregarImagen(nuevaFotoPerfil, 'fotoPerfil');
    }
    if (nuevaFotoPortada) {
        agregarImagen(nuevaFotoPortada, 'fotoPortada');
    }

    // Guardar los cambios en el objeto apartado
    console.log('Datos:', apartado); // Imprimir el objeto actualizado en la consola

    // Además, puedes volver a bloquear las funciones de subir foto de perfil y portada si es necesario
    document.getElementById("input-foto-portada").disabled = true;
    document.getElementById("input-foto-perfil").disabled = true;
    document.getElementById("text-box").disabled = true;
    document.getElementById("nombre-profesional").disabled = true; // Bloquear la edición del nombre del profesional
    document.getElementById("descripcion-profesional").disabled = true; // Bloquear la edición de la descripción del profesional

    // Y ocultar nuevamente el botón de guardar
    document.getElementById("saveProfileBtn").style.display = "none";
    document.getElementById("editProfileBtn").style.display = "inline-block";
}

// Función para obtener la URL de una imagen cargada por el usuario
function obtenerURLImagen(inputId) {
    const fileInput = document.getElementById(inputId);
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        return URL.createObjectURL(file);
    }
    return null;
}

// Función para agregar una imagen al objeto apartado
function agregarImagen(url, tipo) {
    if (!apartado.imagenes) {
        apartado.imagenes = {};
    }
    apartado.imagenes[tipo] = url;
}

// Función para agregar una reseña
function agregarReseña(contenido) {
    if (!contenido.trim()) {
        alert('La reseña no puede estar en blanco');
        return; // Salir de la función si el contenido está en blanco
    }

    const reviewList = document.querySelector('.review-list');
    const reviewDiv = document.createElement('div');
    reviewDiv.classList.add('review');
    reviewDiv.innerHTML = `
        <div class="author">${'Usuario Random'}</div>
        <div class="content">${contenido}</div>
    `;
    reviewList.appendChild(reviewDiv);
}

// Función para agregar una publicación al objeto apartado
function agregarPublicacion(contenido, imagenURL) {
    if(contenido.trim() != ""){

    const nuevaPublicacion = {
        contenido: contenido,
        imagenURL: imagenURL ? imagenURL : null // Usar null si no hay imagen
    };

    apartado.publicaciones.unshift(nuevaPublicacion); // Agregar la nueva publicación al principio del array
    mostrarPublicacion(nuevaPublicacion);
    console.log('Nueva publicación agregada:', nuevaPublicacion); // Agregar registro en la consola
}
}

// Función para mostrar una publicación
function mostrarPublicacion(publicacion) {
    const publicacionDiv = document.createElement('div');
    publicacionDiv.classList.add('post');
    publicacionDiv.innerHTML = `
        <div class="content">${publicacion.contenido}</div>
    `;

    // Si hay una URL de imagen, agregarla al elemento publicacionDiv después de cargarla
    if (publicacion.imagenURL) {
        const imagen = document.createElement('img');
        imagen.alt = 'Publicación';
        imagen.style.maxWidth = '500px'; // Establecer el ancho máximo de la imagen
        imagen.style.height = 'auto'; // Ajustar la altura automáticamente
        imagen.onload = function() {
            publicacionDiv.appendChild(imagen);
        };
        imagen.onerror = function() {
            console.error('Error al cargar la imagen:', publicacion.imagenURL);
        };
        imagen.src = publicacion.imagenURL;
    }

    document.querySelector('.post-list').prepend(publicacionDiv); // Añadir al inicio de la lista
}

function mostrarReseña(reseña) {
    const reseñaDiv = document.createElement('div');
    reseñaDiv.classList.add('review');
    reseñaDiv.innerHTML = `
        <div class="author"><strong>${reseña.nombre}:</strong></div>
        <div class="content">${reseña.contenidoReseña}</div>
    `;
    document.querySelector('.review-list').appendChild(reseñaDiv);
}
