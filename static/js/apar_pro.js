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
    otroAtributo: "reemplaza aqui si ves necesario añadir otro atributo que no inclui"
}

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
