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

async function solicitarDomicilio() {
    // Verificar si ya hay un formulario activo
    const formularioExistente = document.getElementById('formularioSolicitud');
    if (formularioExistente) {
        alert('Ya hay un formulario abierto.');
        return;
    }

    // Crear un formulario simple en JavaScript
    const formulario = document.createElement('div');
    formulario.style.textAlign = 'center';
    formulario.id = 'formularioSolicitud'; // Asignar un ID al formulario para evitar duplicados

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

    try {
        const datos = await obtenerDireccionYCiudad();
        formulario.innerHTML = `
            <p>¿Esta es su direccion? ${datos.direccion}</p>
            <p>Escriba su dirección:</p><br>
            <input id="direccionInput" type="text" value="${datos.direccion}"><br><br>
            <button onclick="enviarSolicitud()">Enviar</button>
        `;
    } catch (error) {
        console.error(error);
        formulario.innerHTML = `
            <p>Error obteniendo dirección: ${error}</p>
            <p>Escriba su dirección:</p><br>
            <input id="direccionInput" type="text" placeholder="Ingrese su dirección"><br><br>
            <button onclick="enviarSolicitud()">Enviar</button>
        `;
    }

    // Obtener el elemento <div id="info"> y reemplazar su contenido con el formulario
    const infoDiv = document.getElementById('info');
    if (infoDiv) {
        // Limpiar contenido existente en el div 'info'
        infoDiv.innerHTML = '';
        // Agregar el formulario al div 'info'
        infoDiv.appendChild(formulario);
        document.getElementById("domBTN").style.display = "none";
    } else {
        alert('No se encontró el div con id "info" en el documento.');
    }
}

function enviarSolicitud() {
    const direccion = document.getElementById('direccionInput').value;
    var usu = JSON.parse(document.getElementById('data').getAttribute('data-usu').replace(/'/g, '"'));

    // Obtener la ubicación geográfica actual del usuario
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const ubicacion = {
                latitud: position.coords.latitude,
                longitud: position.coords.longitude
            };

            // Datos a enviar al servidor
            const datosSolicitud = {
                cliente: usu.usuario, // Puedes obtener el nombre del cliente si lo deseas
                direccion: direccion,
                telefono: usu.datosPersonales.telefono, // Puedes obtener el teléfono del cliente si lo deseas
                ubicacion: ubicacion // Aquí asignamos la ubicación geográfica obtenida
            };

            enviarDatosAlServidor(datosSolicitud); // Llamar a la función para enviar los datos al servidor

        }, function () {
            alert('No se pudo obtener la ubicación');
            // Enviar solicitud sin ubicación si falla la geolocalización
            const datosSolicitud = {
                cliente: usu.usuario, // Puedes obtener el nombre del cliente si lo deseas
                direccion: direccion,
                telefono: usu.datosPersonales.telefono, // Puedes obtener el teléfono del cliente si lo deseas
                ubicacion: 'Ubicación no disponible' // O un valor por defecto si la ubicación no está disponible
            };

            enviarDatosAlServidor(datosSolicitud); // Llamar a la función para enviar los datos al servidor

        });
    } else {
        alert('Tu navegador no soporta geolocalización');
        // Enviar solicitud sin ubicación si el navegador no soporta geolocalización
        const datosSolicitud = {
            cliente: usu.usuario, // Puedes obtener el nombre del cliente si lo deseas
            direccion: direccion,
            telefono: usu.datosPersonales.telefono, // Puedes obtener el teléfono del cliente si lo deseas
            ubicacion: 'Ubicación no disponible' // O un valor por defecto si la ubicación no está disponible
        };

        enviarDatosAlServidor(datosSolicitud); // Llamar a la función para enviar los datos al servidor
    }
}

function enviarDatosAlServidor(datos) {
    // URL de tu servidor Express donde está definida la ruta /solicitarServicio
    const url = '/solicitarServicio';

    // Opciones para la solicitud POST
    const opciones = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos) // Convertir datos a formato JSON
    };

    // Realizar la solicitud usando fetch
    fetch(url, opciones)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al realizar la solicitud.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            // Aquí puedes manejar la respuesta del servidor si es necesario
            alert('Solicitud enviada exitosamente');
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            // Manejar errores de la solicitud
            alert('Ocurrió un error al enviar la solicitud');
        });
}

function actualizarEstadoSolicitud(estado) {
    var infoDiv = document.getElementById('info');

    switch (estado) {
        case 'enviado':
            infoDiv.innerHTML = '<p>Buscando profesional...</p>' +
                                '<button onclick="cancelarSolicitud()">Cancelar</button>';
            break;
        case 'aceptado':
            infoDiv.innerHTML = '<p>Han aceptado tu solicitud. Por favor, espera...</p>' +
                                '<div id="map" style="height: 300px; width: 100%;"></div>' +
                                '<button onclick="cancelarSolicitud()">Cancelar</button>';
            break;
        case 'cancelado':
            infoDiv.innerHTML = '<p>Han cancelado tu solicitud. Por favor, pide otra.</p>';
            break;
        case 'terminado':
            infoDiv.innerHTML = '<p>El profesional ha llegado.</p>' +
                                '<button onclick="confirmarLlegada()">OK</button>';
            break;
        default:
            break;
    }
}

// Función para cancelar la solicitud
function cancelarSolicitud() {
    // Aquí deberías enviar la solicitud de cancelación al backend
    // y actualizar el estado a 'cancelado'
    // Ejemplo:
    // enviarCancelacionAlBackend();
    // actualizarEstadoSolicitud('cancelado');
}

// Función para confirmar que el profesional ha llegado
function confirmarLlegada() {
    // Aquí deberías enviar la confirmación al backend
    // y actualizar el estado a 'terminado'
    // Ejemplo:
    // enviarConfirmacionLlegadaAlBackend();
    // actualizarEstadoSolicitud('terminado');
}
