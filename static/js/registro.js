function validarFormularioCliente() {
    var usuario = document.getElementById("inputUsuarioCliente").value;
    var email = document.getElementById("inputEmailCliente").value;
    var password = document.getElementById("inputPasswordCliente").value;
    var telefono = document.getElementById("inputTelefonoCliente").value;

    // Verificar si los campos están vacíos
    if (usuario.trim() === '' || email.trim() === '' || password.trim() === '' || telefono.trim() === '') {
        alert("Por favor, complete todos los campos.");
        return false; // Evitar el envío del formulario
    }

    // Validar el formato del correo electrónico
    var formatoCorreo = /\S+@\S+\.\S+/;
    if (!formatoCorreo.test(email)) {
        alert("Por favor, ingrese un correo electrónico válido.");
        return false; // Evitar el envío del formulario
    }

    // Validar las extensiones de correo electrónico permitidas
    var extensionesPermitidas = ["gmail.com", "hotmail.com", "yahoo.com"]; // Puedes agregar más extensiones aquí
    var esExtensionPermitida = false;
    for (var i = 0; i < extensionesPermitidas.length; i++) {
        if (email.endsWith(extensionesPermitidas[i])) {
            esExtensionPermitida = true;
            break;
        }
    }
    if (!esExtensionPermitida) {
        alert("Por favor, utilice una dirección de correo electrónico con una extensión válida.");
        return false; // Evitar el envío del formulario
    }

    return true; // Permitir el envío del formulario
}

function validarFormularioProfesional() {
    var usuario = document.getElementById("inputUsuarioProfesional").value;
    var email = document.getElementById("inputEmailProfesional").value;
    var password = document.getElementById("inputPasswordProfesional").value;
    var nombre = document.getElementById("inputNombreProfesional").value;
    var nombreLocal = document.getElementById("inputNombreLocalProfesional").value;
    var direccion = document.getElementById("inputAddress").value;
    var telefono = document.getElementById("inputTelefonoProfesional").value;
    var pais = document.getElementById("inputPais").value;
    var departamento = document.getElementById("inputState").value;
    var ciudad = document.getElementById("inputCity").value;
    var codPostal = document.getElementById("inputZip").value;

    // Verificar si los campos están vacíos
    if (usuario.trim() === '' || email.trim() === '' || password.trim() === '' || nombre.trim() === '' || nombreLocal.trim() === '' || direccion.trim() === '' || telefono.trim() === '' || pais.trim() === '' || departamento.trim() === '' || ciudad.trim() === '' || codPostal.trim() === '') {
        alert("Por favor, complete todos los campos.");
        return false; // Evitar el envío del formulario
    }

    // Validar el formato del correo electrónico
    var formatoCorreo = /\S+@\S+\.\S+/;
    if (!formatoCorreo.test(email)) {
        alert("Por favor, ingrese un correo electrónico válido.");
        return false; // Evitar el envío del formulario
    }

    // Validar las extensiones de correo electrónico permitidas
    var extensionesPermitidas = ["gmail.com", "hotmail.com", "yahoo.com"]; // Puedes agregar más extensiones aquí
    var esExtensionPermitida = false;
    for (var i = 0; i < extensionesPermitidas.length; i++) {
        if (email.endsWith(extensionesPermitidas[i])) {
            esExtensionPermitida = true;
            break;
        }
    }
    if (!esExtensionPermitida) {
        alert("Por favor, utilice una dirección de correo electrónico con una extensión válida.");
        return false; // Evitar el envío del formulario
    }

    return true; // Permitir el envío del formulario
}

function mostrarFormulario(tipo) {
    if (tipo === 'cliente') {
        document.getElementById('formCliente').style.display = 'block';
        document.getElementById('formProfesional').style.display = 'none';
    } else if (tipo === 'profesional') {
        document.getElementById('formCliente').style.display = 'none';
        document.getElementById('formProfesional').style.display = 'block';
    }
    document.getElementById('botonesSeleccion').style.display = 'none';
}