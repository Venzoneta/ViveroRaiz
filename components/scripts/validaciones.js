function mostrarMensaje(formulario, texto, tipo) {
    const mensaje = formulario.querySelector(".mensaje-formulario");
    if (!mensaje) return;
    mensaje.textContent = texto;
    mensaje.className = `mensaje-formulario ${tipo}`;
    mensaje.hidden = false;
}

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const formularioContacto = document.getElementById("form-contacto");
if (formularioContacto) {
    formularioContacto.addEventListener("submit", evento => {
        evento.preventDefault();
        const nombre = formularioContacto.nombre.value.trim();
        const email = formularioContacto.email.value.trim();
        const motivo = formularioContacto.motivo.value;
        const mensaje = formularioContacto.mensaje.value.trim();
        if (!nombre || !email || !motivo || !mensaje) {
            mostrarMensaje(formularioContacto, "Completá todos los campos obligatorios.", "error");
            return;
        }
        if (!emailValido(email)) {
            mostrarMensaje(formularioContacto, "Ingresá un correo electrónico válido.", "error");
            return;
        }
        mostrarMensaje(formularioContacto, "La consulta está lista para ser enviada.", "exito");
    });
}

const formularioRegistro = document.getElementById("form-registro");
if (formularioRegistro) {
    formularioRegistro.addEventListener("submit", evento => {
        evento.preventDefault();
        if (!formularioRegistro.checkValidity()) {
            mostrarMensaje(formularioRegistro, "Completá todos los campos obligatorios correctamente.", "error");
            formularioRegistro.reportValidity();
            return;
        }
        const password = formularioRegistro.password.value;
        const confirmacion = formularioRegistro.confirmarPassword.value;
        if (password !== confirmacion) {
            mostrarMensaje(formularioRegistro, "Las contraseñas no coinciden.", "error");
            return;
        }
        if (!formularioRegistro.terminos.checked) {
            mostrarMensaje(formularioRegistro, "Tenés que aceptar los términos y condiciones.", "error");
            return;
        }
        mostrarMensaje(formularioRegistro, "Los datos del registro están completos.", "exito");
    });
}

document.querySelectorAll(".boton-menu").forEach(boton => {
    boton.addEventListener("click", () => {
        const menu = document.getElementById(boton.getAttribute("aria-controls"));
        const abierto = menu.classList.toggle("abierto");
        boton.setAttribute("aria-expanded", abierto);
    });
});
