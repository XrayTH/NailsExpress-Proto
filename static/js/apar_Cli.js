var apartado = {
    titulo: "EJEMPLO",
    descripcion: "asdfghjklñasljcnancklasncml,sanclksanlkcmsalcsaklcmaklscklasncklsa",
    servicios: ["manicura", "pedicura"],
    direccion: "calle queteimporta",
    ubicacionLocal: { lat: "latitud", lng: "longitud" },
    calificaciones: [], // Array para almacenar todas las calificaciones
    reseñas: [
        {
            nombre: "pepe",
            contenidoReseña: "Me dejo las uñas del culo",
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
        },
        {
            nombre: "yePersa",
            contenidoReseña: "meh",
            calificacion: 5
        }
        
    ],
    otroAtributo: "reemplaza aqui si ves necesario añadir otro atributo que no incluí",
    publicaciones: []

};


/*
document.getElementById('input-foto-perfil').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    document.getElementById('foto-perfil').src = url;
});

document.getElementById('input-foto-portada').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    document.getElementById('foto-portada').src = url;
}); */
document.addEventListener("DOMContentLoaded", function() {
    const stars = document.querySelectorAll('.rating .star');
    stars.forEach(star => {
        star.addEventListener('click', handleRating);
    });

    // Cargar la calificación inicial
    updateStarsVisual(apartado.calificacion);
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






// Función para agregar una publicación
/*function agregarPublicacion(contenido, imagenURL) {
    if (!contenido.trim()) {
        alert('La publicación no puede estar en blanco');
        return; // Salir de la función si el contenido está en blanco
    }

    const nuevaPublicacion = {
        autor: 'Usuario Random', // Obtener el nombre de usuario de la sesión
        contenido: contenido,
        imagenURL: imagenURL ? imagenURL : null // Usar null si no hay imagen
    };

    if (!imagenURL) {
        mostrarPublicacion({ autor: nuevaPublicacion.autor, contenido: nuevaPublicacion.contenido });
    } else {
        apartado.publicaciones.push(nuevaPublicacion);
        mostrarPublicacion(nuevaPublicacion);
    }
}

// Función para mostrar una publicación
function mostrarPublicacion(publicacion) {
    const publicacionDiv = document.createElement('div');
    publicacionDiv.classList.add('post');
    publicacionDiv.innerHTML = `
        <div class="author">${publicacion.autor}</div>
        <div class="content">${publicacion.contenido}</div>
    `; 
    
    // Si hay una URL de imagen, agregarla al elemento publicacionDiv después de cargarla
if (publicacion.imagenURL) {
    const imagen = document.createElement('img');
    imagen.alt = 'Publicación';
    imagen.onload = function() {
        publicacionDiv.appendChild(imagen);
    };
    imagen.onerror = function() {
        console.error('Error al cargar la imagen:', publicacion.imagenURL);
    };
    imagen.src = publicacion.imagenURL;
}

    document.querySelector('.post-list').appendChild(publicacionDiv);
}


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
}); */

function agregarReseña(contenido) {
    if (!contenido.trim()) {
        alert('La reseña no puede estar en blanco');
        return; // Salir de la función si el contenido está en blanco
    }

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

function mostrarReseña(reseña) {
    const reseñaDiv = document.createElement('div');
    reseñaDiv.classList.add('review');
    reseñaDiv.innerHTML = `
        <div class="author">${reseña.nombre}</div>
        <div class="content">${reseña.contenidoReseña}</div>
    `;
    document.querySelector('.review-list').appendChild(reseñaDiv);
}

document.addEventListener('DOMContentLoaded', function() {
    apartado.reseñas.forEach(mostrarReseña);

    const reviewForm = document.querySelector('.review-form');
    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente

        // Obtener el contenido de la reseña
        const reviewContent = document.querySelector('.review-content').value;

        // Agregar la reseña al objeto 'apartado'
        agregarReseña(reviewContent);

        // Limpiar el contenido del campo de reseña
        document.querySelector('.review-content').value = '';
    });
});


// Función para agregar una reseña
/*
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
}*/

