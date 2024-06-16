var map;
var marker = null; // Variable para almacenar el marcador actual
var geolocationMarker = null; // Variable para almacenar el marcador de geolocalización
let intervalId = null;
var puntosFormateados = []; // Variable global para almacenar los puntos formateados
var customMarker = null; // Variable para almacenar el marcador personalizado
var directionsService = null; // Servicio de direcciones de Google Maps
var directionsRenderer = null; // Renderizador de direcciones de Google Maps

function startInterval() {
  if (intervalId === null) {
    intervalId = setInterval(() => {
      console.log('Interval running');
      solicitarDomicilio()
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
    var data = document.getElementById('data');
    var lat = parseFloat(data.getAttribute('data-lat'));
    var lng = parseFloat(data.getAttribute('data-lng'));
    var puntos = JSON.parse(data.getAttribute('data-lugares').replace(/'/g, '"'));

    puntosFormateados = puntos.map(punto => {
        var tipoServicio = obtenerTipoServicio(punto['DatosApartado'].descripcion);
        return {
            nombreLocal: punto['nombreLocal'],
            lat: punto['ubicacion']['lat'],
            lng: punto['ubicacion']['lng'],
            DatosApartado: punto['DatosApartado'],
            usuario: punto['usuario'],
            tipoServicio: tipoServicio
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

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

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

        // Guardar el marcador en el objeto punto
        punto.marker = marker;
    });
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
    geolocalizar(); 

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

function filtrarDatos() {
    var tipoServicio = obtenerTipoServicioSeleccionado(); // Obtener el tipo de servicio seleccionado (manos, pies o ambos)
    
    puntosFormateados.forEach(function(punto) {
        var cumpleFiltroTipo = tipoServicio === 'ambos' || punto.tipoServicio === tipoServicio;
       
        if (cumpleFiltroTipo) {
            punto.marker.setVisible(true); // Mostrar el marcador si cumple con los filtros
        } else {
            punto.marker.setVisible(false); // Ocultar el marcador si no cumple con los filtros
        }
    });
}

function obtenerTipoServicioSeleccionado() {
    var radios = document.getElementsByName('filtroServicio');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    return 'ambos'; // Si no hay ninguno seleccionado, devuelve 'ambos'
}

function obtenerTipoServicio(descripcion) {
    if (descripcion.toLowerCase().includes('manicura')) {
        return 'manos';
    } else if (descripcion.toLowerCase().includes('pedicura')) {
        return 'pies';
    } else {
        return 'otros';
    }
}

function restablecerFiltros() {
    // Mostrar todos los marcadores
    puntosFormateados.forEach(function(punto) {
        punto.marker.setVisible(true);
    });

    

    // Restablecer selección de tipo de servicio (si aplica)
    restablecerTipoServicio();

    // Volver a filtrar para asegurar que todos los marcadores visibles
    filtrarDatos();
}

function buscarNegocio(event) {
    event.preventDefault(); // Evitar que se envíe el formulario
    
    var nombreBusqueda = document.getElementById('nombreNegocio').value.trim().toLowerCase(); // Obtener el valor del campo de búsqueda y limpiar espacios
    
    puntosFormateados.forEach(function(punto) {
        var nombreLocal = punto.nombreLocal.toLowerCase();
        
        // Mostrar o ocultar marcadores basados en la búsqueda por nombre del negocio
        if (nombreLocal.includes(nombreBusqueda)) {
            punto.marker.setVisible(true);
        } else {
            punto.marker.setVisible(false);
        }
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
            throw new Error('Error al obtener archivo');
        }
        return response.json();
    })
    .then(data => {
        console.log('Objeto recibido:', data);
        addOrUpdateCustomMarker(
            data.ubicacionProfesional.latitud, 
            data.ubicacionProfesional.longitud, 
            "Domicilio", 
            "https://maps.gstatic.com/mapfiles/ms2/micons/motorcycling.png"
        );
        return data; // Retorna el objeto recibido del servidor
    })
    .catch(error => {
        console.error('Error en verificarEstado:', error);
        throw error; // Propaga el error para manejarlo externamente si es necesario
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

// Función para crear y mostrar el formulario de solicitud
async function mostrarFormulario() {
    // Verificar si ya hay un formulario activo
    const formularioExistente = document.getElementById('formularioSolicitud');
    if (formularioExistente) {
        console.log('Ya hay un formulario abierto.');
        return;
    }

    const formulario = document.createElement('div');
    formulario.style.textAlign = 'center';
    formulario.id = 'formularioSolicitud'; 

    try {
        const datos = await obtenerDireccionYCiudad();
        formulario.innerHTML = `
            <p>¿Esta es su dirección? ${datos.direccion}</p>
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

    const infoDiv = document.getElementById('info');
    if (infoDiv) {
        infoDiv.innerHTML = '';
        infoDiv.appendChild(formulario);
        document.getElementById("domBTN").style.display = "none";
    } else {
        alert('No se encontró el div con id "info" en el documento.');
    }
}

// Función para solicitar el domicilio
function solicitarDomicilio() {
    startInterval();
    geolocalizar();
    var id = document.getElementById('data').getAttribute('data-id');

    verificarEstado(id)
    .then(objeto => {
        // Si el objeto existe (no hay error), actualizar estado o manejar según corresponda
        actualizarEstadoSolicitud(objeto.estado); // Por ejemplo, actualizar estado según objeto recibido
    })
    .catch(error => {
        console.log("No hay domicilio activo.");
        mostrarFormulario();
    });
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

    actualizarEstadoSolicitud("enviado");
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
            document.getElementById('data').setAttribute('data-id', data.id); 
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
            document.getElementById("domBTN").style.display = "none";
            infoDiv.innerHTML = '<p>Buscando profesional...</p>' +
                                '<button onclick="cancelarSolicitud()">Cancelar</button>';
            break;
        case 'aceptado':
            document.getElementById("domBTN").style.display = "none";
            infoDiv.innerHTML = '<p>Han aceptado tu solicitud. Por favor, espera...</p>' +
                                '<button onclick="cancelarSolicitud()">Cancelar</button>';
            break;
        case 'cancelado':
            document.getElementById("domBTN").style.display = "none";
            infoDiv.innerHTML = '<p>Han cancelado tu solicitud. Por favor, pide otra.</p>'+
                                '<button onclick="cancelarSolicitud()">OK</button>';
            break;
        case 'terminado':
            document.getElementById("domBTN").style.display = "none";
            infoDiv.innerHTML = '<p>El profesional ha llegado.</p>' +
                                '<button onclick="confirmarLlegada()">OK</button>';
            break;
        default:
            break;
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

function borrarIdDomicilio(){
    stopInterval(); // Corregido para usar clearInterval correctamente

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
    borrarIdDomicilio();
}