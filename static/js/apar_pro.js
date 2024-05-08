var apartado = {
    titulo: "EJEMPLO",
    descripcion: "asdfghjklñasljcnancklasncml,sanclksanlkcmsalcsaklcmaklscklasncklsa",
    servicios: ["manicura", "pedicura"],
    direccion: "calle queteimporta",
    ubicacionLocal: { lat: "latitud", lng: "longitud" },
    calificacion: 0, // Inicialmente la calificación es 0
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
        }
    ],
    otroAtributo: "reemplaza aqui si ves necesario añadir otro atributo que no inclui",
    publicaciones: [],
    comentarios: []
};

document.addEventListener("DOMContentLoaded", function() {
    // Bloquear las funciones de subir foto de perfil y portada al cargar la página
    document.getElementById("input-foto-portada").disabled = true;
    document.getElementById("input-foto-perfil").disabled = true;
    document.getElementById("text-box").disabled = true;
    document.getElementById("text-box1").disabled = true;
    
});

// Función para manejar el clic en el botón de editar en el encabezado
function handleEditProfile() {
    // Desbloquear las funciones de subir foto de perfil y portada cuando se hace clic en editar
    document.getElementById("input-foto-portada").disabled = false;
    document.getElementById("input-foto-perfil").disabled = false;
    document.getElementById("text-box").disabled = false;

    // También hacer visible el botón de guardar
    document.getElementById("saveProfileBtn").style.display = "inline-block";

    
}



// Función para manejar el clic en el botón de guardar en el encabezado
function handleSaveProfile() {
    // Aquí puedes agregar el código para guardar los cambios del perfil
    console.log('Guardar cambios');
    console.log('Texto guardado:', document.getElementById("text-box").value);

    // Además, puedes volver a bloquear las funciones de subir foto de perfil y portada si es necesario
    document.getElementById("input-foto-portada").disabled = true;
    document.getElementById("input-foto-perfil").disabled = true;
    document.getElementById("text-box").disabled = true;

    // Y ocultar nuevamente el botón de guardar
    document.getElementById("saveProfileBtn").style.display = "none";
}



document.getElementById('input-foto-perfil').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    document.getElementById('foto-perfil').src = url;
});

document.getElementById('input-foto-portada').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    document.getElementById('foto-portada').src = url;
});


document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('.rating .star');
    stars.forEach(star => {
        star.addEventListener('click', handleRating);
    });
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

    // Actualizar la calificación
    updateRating(ratingValue);
}

function updateRating(rating) {
    apartado.calificacion = rating;
    console.log('Calificación actualizada:', rating);
    // Aquí puedes agregar código para guardar la calificación en tu base de datos o realizar otras acciones necesarias
}

// Función para agregar una publicación
function agregarPublicacion(contenido, imagenURL) {
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
});

// Función para agregar una reseña
function agregarReseña(contenido) {
    if (!contenido.trim()) {
        alert('La reseña no puede estar en blanco');
        return; // Salir de la función si el contenido está en blanco
    }

    const nuevaReseña = {
        autor: obtenerNombreUsuario(), // Obtener el nombre de usuario de la sesión
        contenido: contenido,
        comentarios: [] // Arreglo para almacenar los comentarios de la reseña
    };
    apartado.reseñas.push(nuevaReseña);
    mostrarReseña(nuevaReseña);
}

// Función para mostrar una reseña
function mostrarReseña(reseña) {
    const reseñaDiv = document.createElement('div');
    reseñaDiv.classList.add('review');
    reseñaDiv.innerHTML = `
        <div class="author">${reseña.autor}</div>
        <div class="content">${reseña.contenido}</div>
        <div class="comments-section">
            <h3>Comentarios</h3>
            <div class="comments"></div>
            <form class="comment-form">
                <input type="text" class="comment-content" placeholder="Escribe un comentario">
                <button type="submit">Comentar</button>
            </form>
        </div>
    `;
    document.querySelector('.reviews-list').appendChild(reseñaDiv);

    // Agregar evento para el formulario de comentarios en la reseña
    const commentForm = reseñaDiv.querySelector('.comment-form');
    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const contentInput = commentForm.querySelector('.comment-content');
        const contenido = contentInput.value;
        if (contenido.trim()) {
            agregarComentario(reseña, contenido);
            contentInput.value = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
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
