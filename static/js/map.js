var map;
var marker = null; // Variable para almacenar el marcador actual
var geolocationMarker = null; // Variable para almacenar el marcador de geolocalización

function initMap() {
    var data = document.getElementById('data');
    var lat = parseFloat(data.getAttribute('data-lat'));
    var lng = parseFloat(data.getAttribute('data-lng'));
    // Obtener el valor de data-lugares
    var puntos = JSON.parse(data.getAttribute('data-lugares').replace(/'/g, '"'));

    // Crear una nueva lista de puntos con los atributos deseados
    var puntosFormateados = puntos.map(punto => {
        return {
            nombreLocal: punto['nombreLocal'],
            lat: punto['ubicacion']['lat'],
            lng: punto['ubicacion']['lng']
        };
    });

    var myLatLng = { lat: lat, lng: lng };

    // Estilo personalizado del mapa que no incluye los marcadores
    var customMapStyle = [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }] // Ocultar etiquetas de puntos de interés
        }
    ];

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: myLatLng,
        styles: customMapStyle // Aplicar estilo personalizado al mapa
    });

    // Agregar marcadores para cada punto
    puntosFormateados.forEach(function(punto) {
        var marker = new google.maps.Marker({
            position: { lat: punto.lat, lng: punto.lng },
            map: map,
            title: punto.nombreLocal, // Utilizar el nombre del local como título
            icon: {
                url: 'https://maps.gstatic.com/mapfiles/ms2/micons/pink-dot.png'
            }
        });
    });
    /*
    map.addListener('click', function(event) {
        agregarMarcador(event.latLng);
    });

    map.addListener('zoom_changed', function() {
        var currentZoom = map.getZoom();
        if (currentZoom < map.minZoom) {
            map.setZoom(map.minZoom);
        } else if (currentZoom > map.maxZoom) {
            map.setZoom(map.maxZoom);
        }
    });
    */
}


function geolocalizar() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log(pos)
            map.setCenter(pos);
            if (geolocationMarker) {
                // Si ya existe un marcador de geolocalización, actualizar su posición
                geolocationMarker.setPosition(pos);
            } else {
                // Si no existe, crear uno nuevo
                geolocationMarker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: 'Ubicación actual',
                    icon: {
                        url: 'https://maps.gstatic.com/mapfiles/ms2/micons/man.png'
                    }
                });
            }
        }, function () {
            alert('No se pudo obtener la ubicación');
        });
    } else {
        alert('Tu navegador no soporta geolocalización');
    }
}

/*
function agregarMarcador(location) {
    // Verificar si hay un marcador existente
    if (marker) {
        // Preguntar al usuario si desea desplazar la ubicación del marcador existente
        var desplazar = confirm('¿Desplazar la ubicación de su local aquí?');
        if (!desplazar) {
            // Si el usuario no desea desplazar la ubicación, salir de la función
            return;
        }
        // Eliminar el marcador existente
        marker.setMap(null);
    }

    // Preguntar al usuario si desea ubicar su local en esta posición
    var ubicarLocal = confirm('¿Quiere ubicar su local aquí?');
    if (!ubicarLocal) {
        // Si el usuario no desea ubicar su local aquí, salir de la función
        return;
    }

    // Crear el marcador en la ubicación especificada
    var nuevoMarcador = new google.maps.Marker({
        position: location,
        map: map,
        draggable: true, // Permitir arrastrar el marcador
        icon: {
            url: 'https://maps.gstatic.com/mapfiles/ms2/micons/pink-dot.png'
        }
    });

    // Abrir ventana de información al hacer clic en el marcador
    nuevoMarcador.addListener('click', function() {
        var infoWindow = new google.maps.InfoWindow({
            content: '<strong>Titulo:</strong> ' + nuevoMarcador.getTitle() + '<br>' + '<strong>Información:</strong> ' + nuevoMarcador.get('info')
        });
        infoWindow.open(map, nuevoMarcador);
    });

    // Permitir al usuario definir el título del marcador
    var titulo = prompt('Ingrese el título del marcador:');
    if (titulo !== null) {
        nuevoMarcador.setTitle(titulo);
        marker = nuevoMarcador;

        // Permitir al usuario definir la información de la ventana de información del marcador
        var informacion = prompt('Ingrese la información del marcador:');
        if (informacion !== null) {
            marker.set('info', informacion);
        }
    } else {
        // Si se cancela la creación del marcador, no se agrega ninguno nuevo
        nuevoMarcador.setMap(null);
    }
}
*/

