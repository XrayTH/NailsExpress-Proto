function validarFormulario() {
    var email = document.getElementById("inputEmail4").value;
    var password = document.getElementById("inputPassword4").value;

    // Verificar si los campos están vacíos
    if (email.trim() === '' || password.trim() === '') {
        alert("Por favor, complete todos los campos.");
        return false; // Evitar el envío del formulario
    }
    return true; // Permitir el envío del formulario
}