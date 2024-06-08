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
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Añadir un marcador en la ubicación
    const marker = new google.maps.Marker({
        position: apartado.ubicacionLocal,
        map: map,
        title: apartado.titulo,
        icon: {
            url: 'https://maps.gstatic.com/mapfiles/ms2/micons/pink-dot.png'
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // Actualizar nombre del profesional
    document.querySelector('.profile-info h2').innerText = apartado.titulo;

    // Actualizar descripción del profesional
    document.querySelector('.profile-info p').innerText = apartado.descripcion;

    // Actualizar imagen de perfil
    document.querySelector('#foto-perfil').src = apartado.perfil;

    // Actualizar imagen de portada
    document.querySelector('#foto-portada').src = apartado.portada;

    document.getElementById('direccion-placeholder').innerText = apartado.direccion;

    document.querySelector('.review-list').innerHTML = ''; // Limpiar el contenido previo
    document.querySelector('.post-list').innerHTML = ''; // Limpiar el contenido previo

    apartado.publicaciones.slice().reverse().forEach(mostrarPublicacion);
    apartado.reseñas.slice().reverse().forEach(mostrarReseña);
});

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

    document.querySelector('.post-list').appendChild(publicacionDiv); // Agregar al final de la lista
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

// Event listener para enviar una reseña
document.querySelector('.review-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe normalmente

    // Obtener el contenido de la reseña
    const reviewContent = document.querySelector('.review-content').value;

    // Agregar la reseña al objeto 'apartado'
    agregarReseña(reviewContent);

    // Limpiar el contenido del campo de reseña
    document.querySelector('.review-content').value = '';
});


function handleRating(event) {
    const clickedStar = event.target;
    if (!clickedStar.classList.contains('star')) return;

    const stars = document.querySelectorAll('.rating .star');
    const ratingValue = parseInt(clickedStar.getAttribute('data-value'));

    stars.forEach(star => {
        const value = parseInt(star.getAttribute('data-value'));
        if (value <= ratingValue) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });

    // Actualizar la calificación en el objeto `apartado`
    updateRating(ratingValue);
}

function updateRating(rating) {
    apartado.calificaciones.push(rating);
    const promedio = calcularPromedioCalificaciones();
    apartado.calificacion = promedio;
    updateStarsVisual(promedio);

    // Verificar las calificaciones en la consola
    console.log('Calificaciones en el objeto apartado:', apartado.calificaciones);
}

function calcularPromedioCalificaciones() {
    const sum = apartado.calificaciones.reduce((a, b) => a + b, 0);
    return (sum / apartado.calificaciones.length).toFixed(1); // Redondear a un decimal
}

function updateStarsVisual(ratingValue) {
    const stars = document.querySelectorAll('.rating .star');
    stars.forEach(star => {
        const value = parseInt(star.getAttribute('data-value'));
        if (value <= ratingValue) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

function agregarReseña(contenido) {

    if(contenido.trim() != ""){
        console.log(contenido.trim() != "");
    const nuevaReseña = {
        nombre: 'Usuario Random', // Puedes cambiar esto para obtener el nombre de usuario real
        contenidoReseña: contenido,
        calificacion: 0 // Puedes agregar lógica para manejar calificaciones de reseñas si es necesario
    };

    // Añadir la nueva reseña al objeto 'apartado'
    apartado.reseñas.push(nuevaReseña);
    
    // Mostrar la nueva reseña en el DOM
    mostrarReseña(nuevaReseña);

    // Mostrar el array de reseñas en la consola
    console.log('Reseñas en el objeto apartado:', apartado.reseñas);
}

}

