var map;
var marker = null; // Variable para almacenar el marcador actual
var geolocationMarker = null; // Variable para almacenar el marcador de geolocalización

function initMap() {
    var data = document.getElementById('data');
    var lat = parseFloat(data.getAttribute('data-lat'));
    var lng = parseFloat(data.getAttribute('data-lng'));
    var puntos = JSON.parse(data.getAttribute('data-lugares').replace(/'/g, '"'));

    var puntosFormateados = puntos.map(punto => {
        return {
            nombreLocal: punto['nombreLocal'],
            lat: punto['ubicacion']['lat'],
            lng: punto['ubicacion']['lng'],
            DatosApartado: punto['DatosApartado'],
            usuario: punto['usuario']
        };
    });

    var myLatLng = { lat: lat, lng: lng };

    var customMapStyle = [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        }
    ];

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: myLatLng,
        styles: customMapStyle
    });

    puntosFormateados.forEach(function(punto) {
        var marker = new google.maps.Marker({
            position: { lat: punto.lat, lng: punto.lng },
            map: map,
            title: punto.nombreLocal,
            icon: {
                url: 'https://maps.gstatic.com/mapfiles/ms2/micons/pink-dot.png'
            }
        });

        // Crear el contenido del InfoWindow con la imagen incluida
        var contenido = '<div style="text-align: center;">' +
                            '<h3>' + punto.nombreLocal + '</h3>' +
                            '<img src="' + punto.DatosApartado.portada + '" alt="Imagen de ' + punto.nombreLocal + '" style="width:100%;max-width:200px;margin-bottom:10px;" />' +
                            '<p>' + punto.DatosApartado.descripcion + '</p>' +
                            '<p><a href="/apar_cli/' + punto.usuario + '">Ir a la ruta</a></p>' +
                        '</div>';

        var infoWindow = new google.maps.InfoWindow({
            content: contenido
        });

        // Agregar evento de clic al marcador para abrir el InfoWindow
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
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

