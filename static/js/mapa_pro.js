var map;
var marker = null; // Variable para almacenar el marcador actual
var geolocationMarker = null; // Variable para almacenar el marcador de geolocalización
let intervalId = null;
var puntos;
var customMarker = null; // Variable para almacenar el marcador personalizado
var directionsService = null; // Servicio de direcciones de Google Maps
var directionsRenderer = null; // Renderizador de direcciones de Google Maps
var ruta = false;
var fijar = false;

function startInterval() {
  if (intervalId === null) {
    intervalId = setInterval(() => {
      console.log('Interval running');
      verificarEstado(document.getElementById('data').getAttribute('data-id'))
    }, 10000);
  } else {
    console.log('Interval already running');
  }
}

function stopInterval() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('Interval stopped');
  }
}

function initMap() {
    verificarEstado(document.getElementById('data').getAttribute('data-id'));
    var data = document.getElementById('data');
    var lat = parseFloat(data.getAttribute('data-lat'));
    var lng = parseFloat(data.getAttribute('data-lng'));
    puntos = JSON.parse(data.getAttribute('data-lugares').replace(/'/g, '"'));

    var puntosFormateados = puntos.map(punto => {
        if(punto.estado == "enviado"){
            return {
                nombre: punto['cliente'],
                lat: punto['ubicacionCliente']['latitud'],
                lng: punto['ubicacionCliente']['longitud'],
                direccion: punto['direccion'] // Asegúrate de que esta propiedad exista en tus datos
            };
        } else {
            return null; // O puedes retornar un objeto vacío {}, dependiendo de lo que necesites.
        }
    }).filter(punto => punto !== null);

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

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    puntosFormateados.forEach(function(punto) {
        var marker = new google.maps.Marker({
            position: { lat: punto.lat, lng: punto.lng },
            map: map,
            title: punto.nombre,
            icon: {
                url: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png'
            }
        });

        // Crear el contenido del InfoWindow con la imagen incluida
        var contenido = '<div style="text-align: center;">' +
                            '<h3>' + punto.nombre + '</h3>' +
                            '<p>' + punto.direccion + '</p>' + // Verificar que `punto.direccion` exista
                        '</div>';

        var infoWindow = new google.maps.InfoWindow({
            content: contenido
        });

        // Agregar evento de clic al marcador para abrir el InfoWindow
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });

        // Guardar el marcador en el objeto punto
        punto.marker = marker;

    });
}

function geolocalizar() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            if (geolocationMarker) {
                // Si ya existe un marcador de geolocalización, actualizar su posición
                geolocationMarker.setPosition(pos);
                if(!ruta){
                map.setCenter(pos);
                }
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

function addOrUpdateCustomMarker(lat, lng, title, iconUrl) {
    // Validar si se ha recibido una ubicación válida
    if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
        console.log('Ubicación inválida, no se puede añadir o actualizar el marcador.');
        return;
    }

    // Si ya existe el marcador, actualizar su ubicación y título
    if (customMarker) {
        customMarker.setPosition({ lat: lat, lng: lng });
        customMarker.setTitle(title);
    } else {
        // Crear un nuevo marcador si no existe
        customMarker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map,
            title: title,
            icon: {
                url: iconUrl
            }
        });

        // Crear el contenido del InfoWindow con el título
        var infoWindow = new google.maps.InfoWindow({
            content: '<div style="text-align: center;"><h3>' + title + '</h3></div>'
        });

        // Agregar evento de clic al marcador para abrir el InfoWindow
        customMarker.addListener('click', function() {
            infoWindow.open(map, customMarker);
        });
    }

    // Trazar la ruta entre la ubicación actual y la nueva ubicación del marcador
    traceRouteToMarker(lat, lng);
}

function traceRouteToMarker(latitud, longitud) {
    if(!fijar){
    ruta = true;
    navigator.geolocation.getCurrentPosition(function (position) {
        var start = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        var end = { lat: latitud, lng: longitud };

        var request = {
            origin: start,
            destination: end,
            travelMode: 'WALKING'
        };

        directionsService.route(request, function(result, status) {
            if (status == 'OK') {
                directionsRenderer.setDirections(result);

                // Personalizar estilo de los marcadores de inicio y fin de ruta
                directionsRenderer.setOptions({
                    markerOptions: {
                        visible: false // Oculta los marcadores A y B
                    },
                    polylineOptions: {
                        strokeColor: '#4285F4', // Color de la línea de ruta
                        strokeOpacity: 0.8,
                        strokeWeight: 5
                    }
                });

            } else {
                console.error('Error al trazar la ruta: ' + status);
            }
        });
    }, function(error) {
        console.log('Error al obtener la ubicación actual: ', error);
    });
    }
}



function aceptarSolicitud(id) {
    geolocalizar();
    let ubicacion = {};  // Cambiado a let para permitir reasignación

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            ubicacion = {
                latitud: position.coords.latitude,
                longitud: position.coords.longitude
            };

            // Aquí debes llamar a la función que envía la solicitud fetch,
            // para asegurar que la ubicación se incluya en los datos correctamente.
            enviarSolicitud(id, ubicacion);
        });
    } else {
        console.error('Geolocalización no está disponible.');
        // Aquí puedes manejar el caso donde la geolocalización no está disponible
        // o mostrar un mensaje al usuario.
    }
}

function enviarUbicacion(){
    geolocalizar();
    let id = document.getElementById('data').getAttribute('data-id');
    let ubicacion = {};  // Cambiado a let para permitir reasignación

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            ubicacion = {
                latitud: position.coords.latitude,
                longitud: position.coords.longitude
            };

            const datos = {
                id: id,
                ubicacion: ubicacion  // Ahora se pasa la ubicación obtenida
            };
        
            // Configura la solicitud
            fetch('/enviarUbicacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta del servidor:', data);
            })
            .catch(error => {
                console.log('Error al enviar la solicitud:', error);
            });

        });
    } else {
        console.log('Geolocalización no está disponible.');
    }
}

function enviarSolicitud(id, ubicacion) {
    const datos = {
        id: id,
        ubicacion: ubicacion  // Ahora se pasa la ubicación obtenida
    };

    // Configura la solicitud
    fetch('/aceptarSolicitud', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        document.getElementById('data').setAttribute('data-id', data.id);
        actualizarEstadoSolicitud("aceptado");
    })
    .catch(error => {
        console.error('Error al enviar la solicitud:', error);
        // Aquí maneja el error si la solicitud falla
    });
}

// Función para verificar el estado del archivo en el servidor y retornar el objeto
function verificarEstado(id) {
    return fetch('/verificar-estado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ objectId: id })
    })
    .then(response => {
        if (!response.ok) {
            console.log("No hay domicilio activo.");
            stopInterval();
        }
        return response.json();
    })
    .then(data => {
        console.log('Objeto recibido:', data);
        actualizarEstadoSolicitud(data.estado);
        addOrUpdateCustomMarker(data.ubicacionCliente.latitud, data.ubicacionCliente.longitud, "Destino", "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png");
        return data; // Retorna el objeto recibido del servidor
    })
    .catch(error => {
        console.log("No hay domicilio activo.");
        stopInterval();
    });
}

// Función para obtener la dirección y ciudad mediante geolocalización
function obtenerDireccionYCiudad() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitud = position.coords.latitude;
                const longitud = position.coords.longitude;

                const geocoder = new google.maps.Geocoder();
                const latlng = new google.maps.LatLng(latitud, longitud);

                geocoder.geocode({ 'location': latlng }, function (results, status) {
                    if (status === 'OK') {
                        if (results[0]) {
                            const direccion = results[0].formatted_address;
                            let ciudad = null;

                            for (let i = 0; i < results[0].address_components.length; i++) {
                                const component = results[0].address_components[i];
                                if (component.types.includes("locality")) {
                                    ciudad = component.long_name;
                                    break;
                                }
                            }

                            resolve({
                                direccion: direccion,
                                ciudad: ciudad
                            });
                        } else {
                            reject('No se encontraron resultados.');
                        }
                    } else {
                        reject('Error en la geocodificación: ' + status);
                    }
                });
            }, function (error) {
                reject('Error en la geolocalización: ' + error.message);
            });
        } else {
            reject('La geolocalización no es soportada por este navegador.');
        }
    });
}

function buscarID(jsonData, id) {
    let resultado = null;

    // Verificar que jsonData es un array
    if (Array.isArray(jsonData)) {
        for (let data of jsonData) {
            if (data._id === id) {
                resultado = data;
                break;
            }
        }
    } else {
        console.error('jsonData no es un array');
    }

    return resultado;
}

function actualizarEstadoSolicitud(estado) {
    stopInterval();
    var infoDiv = document.getElementById('info');
    var data = document.getElementById('data').getAttribute('data-id');
    var infoSolicitud = buscarID(puntos, data);

    if(fijar){
        var boton = "No fijar"
    }else{
        var boton = "Fijar mapa"
    }

    switch (estado) {
        
        case 'aceptado':
            startInterval();
            enviarUbicacion();
            infoDiv.innerHTML = '<p><strong>Usuario: </strong>'+infoSolicitud.cliente+'</p>' +
                                '<p><strong>Direccion: </strong>'+infoSolicitud.direccion+'</p>' +
                                '<p><strong>Telefono: </strong>'+infoSolicitud.telefono+'</p>' +
                                '<p>Si no se ha trazado la ruta, espere un poco.</p>' +
                                '<p>"Fijar mapa" hara que el zoom no se recalibre al trazar la ruta. ' +
                                'Pero la ruta no se redimensionara con su nueva ubicacion si se sale de la misma mientras el mapa este fijado. </p>' +
                                '<button onclick="confirmarLlegada()">He llegado</button>'+
                                '<button id="fijar" onclick="fijarMap()">'+boton+'</button>'+
                                '<button onclick="cancelarSolicitud()">Cancelar</button>';
            break;
        case 'cancelado':
            infoDiv.innerHTML = '<p>El cliente cancelo el pedido.</p>'+
                                '<button onclick="cancelarSolicitud()">OK</button>';
            break;
        case 'terminado':
            infoDiv.innerHTML = '<p>Se le ha notificado al cliente que has llegado a su ubicacion.</p>'+
                                '<p>Gracias por usar nuestro software.</p>'+
                                '<p>ID domicilio: '+data+'.</p>'+
                                '<button onclick="borrarIdDomicilio()">OK</button>';
            break;
        default:
            break;
    }
}

function fijarMap(){
    if(!fijar){
        fijar = true;
        document.getElementById('fijar').textContent = 'No fijar';
    }else{
        fijar = false;
        document.getElementById('fijar').textContent = 'Fijar mapa';
    }
}

// Función para cancelar la solicitud
function cancelarSolicitud() {
    fetch('/cancelarDomicilioCliente', {
        method: 'POST', // Especificar que es una solicitud POST
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Manejar la respuesta del servidor
        console.log(data.message); // Mostrar el mensaje de respuesta en la consola
        borrarIdDomicilio();
    })
    .catch(error => {
        console.error('Error al cancelar domicilio:', error);
        // Manejar errores si ocurrieron durante la solicitud
    });
}

function llegado() {
    fetch('/llegarDomicilio', {
        method: 'POST', // Especificar que es una solicitud POST
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Manejar la respuesta del servidor
        console.log(data.message);
    })
    .catch(error => {
        console.error('Error al cancelar domicilio:', error);
    });
}

function borrarIdDomicilio(){
    stopInterval(); 

    fetch('/logoutDomicilio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        }
    })
    .catch(error => console.error('Error:', error));
}

// Función para confirmar que el profesional ha llegado
function confirmarLlegada() {
    llegado();
    var data = document.getElementById('data').getAttribute('data-id');
    var infoDiv = document.getElementById('info');
    infoDiv.innerHTML = '<p>Se le ha notificado al cliente que has llegado a su ubicacion.</p>'+
                        '<p>Gracias por usar nuestro software.</p>'+
                        '<p>ID domicilio: '+data+'.</p>'+
                        '<button onclick="borrarIdDomicilio()">OK</button>'
    ;
}