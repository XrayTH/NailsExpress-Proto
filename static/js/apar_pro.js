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

    // Evento para enviar una nueva publicación
    document.querySelector('#publicar-btn').addEventListener('click', function (event) {
        event.preventDefault();
        const autor = 'Usuario Random'; // O puedes obtener el autor de algún campo de entrada
        const contenido = document.querySelector('#publicacion-input').value;
        agregarPublicacion(autor, contenido);
    });

    // Evento para enviar un nuevo comentario
    document.querySelector('#comentar-btn').addEventListener('click', function (event) {
        event.preventDefault();
        const autor = 'Usuario Random'; // O puedes obtener el autor de algún campo de entrada
        const contenido = document.querySelector('#comentario-input').value;
        agregarComentario(autor, contenido);
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

function agregarPublicacion(autor, contenido) {
    const nuevaPublicacion = {
        autor: autor,
        contenido: contenido
    };
    apartado.publicaciones.push(nuevaPublicacion);
    mostrarPublicacion(nuevaPublicacion);
}

function agregarComentario(autor, contenido) {
    const nuevoComentario = {
        autor: autor,
        contenido: contenido
    };
    apartado.comentarios.push(nuevoComentario);
    mostrarComentario(nuevoComentario);
}

function mostrarPublicacion(publicacion) {
    const publicacionDiv = document.createElement('div');
    publicacionDiv.classList.add('post');
    publicacionDiv.innerHTML = `
        <div class="author">${publicacion.autor}</div>
        <div class="content">${publicacion.contenido}</div>
        <div class="actions">
            <!-- Botones de acciones como Me gusta, Comentar, Compartir -->
        </div>
    `;
    document.querySelector('.publications').appendChild(publicacionDiv);
}

function mostrarComentario(comentario) {
    const comentarioDiv = document.createElement('div');
    comentarioDiv.classList.add('comment');
    comentarioDiv.innerHTML = `
        <div class="author">${comentario.autor}</div>
        <div class="content">${comentario.contenido}</div>
    `;
    document.querySelector('.comments').appendChild(comentarioDiv);
}
