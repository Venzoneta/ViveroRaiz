const USUARIO = {
    nombre: "Admin",
    email: "admin@viveroraiz.com",
    password: "123456"
};

function obtenerSesion() {
    return JSON.parse(localStorage.getItem("sesionViveroRaiz"));
}

function iniciarSesion() {
    const datosUsuario = {
        nombre: USUARIO.nombre,
        email: USUARIO.email
    };

    localStorage.setItem("sesionViveroRaiz", JSON.stringify(datosUsuario));
}

function cerrarSesion() {
    localStorage.removeItem("sesionViveroRaiz");
    window.location.href = "login.html";
}

function protegerPagina() {
    const paginaProtegida = document.body.dataset.protegida === "true";

    if (paginaProtegida && !obtenerSesion()) {
        window.location.href = "login.html";
    }
}

function mostrarUsuario() {
    const sesion = obtenerSesion();
    const botones = document.querySelector(".botones-usuario");

    if (!sesion || !botones) return;

    botones.querySelectorAll(".boton-login, .boton-registro").forEach(elemento => elemento.remove());
    botones.insertAdjacentHTML("beforeend", `
        <span class="usuario-sesion">Hola, ${sesion.nombre}</span>
        <button type="button" class="boton-cerrar-sesion">Cerrar sesión</button>
    `);

    document.querySelector(".boton-cerrar-sesion").addEventListener("click", cerrarSesion);

    const menu = document.getElementById("menu-principal");
    if (menu) {
        menu.insertAdjacentHTML("beforeend", '<button type="button" class="boton-salir-menu">Cerrar sesión</button>');
        menu.querySelector(".boton-salir-menu").addEventListener("click", cerrarSesion);
    }
}

const formularioLogin = document.getElementById("form-login");

if (formularioLogin) {
    formularioLogin.addEventListener("submit", evento => {
        evento.preventDefault();

        const email = formularioLogin.email.value.trim().toLowerCase();
        const password = formularioLogin.password.value;
        const mensaje = formularioLogin.querySelector(".mensaje-formulario");

        if (!email || !password) {
            mensaje.textContent = "Completá el correo y la contraseña.";
            mensaje.className = "mensaje-formulario error";
            mensaje.hidden = false;
            return;
        }

        if (email !== USUARIO.email || password !== USUARIO.password) {
            mensaje.textContent = "El correo o la contraseña son incorrectos.";
            mensaje.className = "mensaje-formulario error";
            mensaje.hidden = false;
            return;
        }

        iniciarSesion();
        window.location.href = "listado.html";
    });
}

protegerPagina();
mostrarUsuario();
