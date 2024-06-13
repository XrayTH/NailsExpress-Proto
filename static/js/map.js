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

