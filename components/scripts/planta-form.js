const idPlanta = new URLSearchParams(window.location.search).get("id");
const formularioPlanta = document.getElementById("form-planta");

function mostrarMensajeFormulario(texto, tipo) {
    const mensaje = document.getElementById("mensaje-planta-form");
    mensaje.textContent = texto;
    mensaje.className = `mensaje-formulario ${tipo}`;
}

function leerFormulario() {
    const etiquetas = [];

    document.querySelectorAll('[name="etiquetas"]:checked').forEach(campo => {
        etiquetas.push(campo.value);
    });

    return {
        nombre: document.getElementById("nombre").value.trim(),
        nombreCientifico: document.getElementById("nombreCientifico").value.trim(),
        categoria: document.getElementById("categoria").value,
        luz: document.querySelector('[name="luz"]:checked').value,
        riego: document.getElementById("riego").value,
        precio: Number(document.getElementById("precio").value),
        stock: Number(document.getElementById("stock").value),
        fechaIngreso: document.getElementById("fechaIngreso").value,
        aptaMascotas: document.getElementById("aptaMascotas").checked,
        etiquetas: etiquetas,
        foto: document.getElementById("foto").value.trim(),
        notas: document.getElementById("notas").value.trim()
    };
}

async function cargarFormulario() {
    if (!idPlanta) return;

    try {
        const planta = await obtenerPlantaPorId(idPlanta);

        if (!planta) {
            mostrarMensajeFormulario("La planta no existe.", "error");
            return;
        }

        document.getElementById("titulo-form-planta").textContent = "Editar planta";
        document.getElementById("nombre").value = planta.nombre;
        document.getElementById("nombreCientifico").value = planta.nombreCientifico;
        document.getElementById("categoria").value = planta.categoria;
        document.getElementById("riego").value = planta.riego;
        document.getElementById("precio").value = planta.precio;
        document.getElementById("stock").value = planta.stock;
        document.getElementById("fechaIngreso").value = planta.fechaIngreso;
        document.getElementById("aptaMascotas").checked = planta.aptaMascotas;
        document.getElementById("foto").value = planta.foto;
        document.getElementById("notas").value = planta.notas;

        const campoLuz = document.querySelector(`[name="luz"][value="${planta.luz}"]`);
        if (campoLuz) campoLuz.checked = true;

        planta.etiquetas.forEach(etiqueta => {
            const campo = document.querySelector(`[name="etiquetas"][value="${etiqueta}"]`);
            if (campo) campo.checked = true;
        });
    } catch (error) {
        mostrarMensajeFormulario(error.message, "error");
    }
}

formularioPlanta.addEventListener("submit", async evento => {
    evento.preventDefault();

    if (!formularioPlanta.checkValidity()) {
        formularioPlanta.reportValidity();
        return;
    }

    const boton = formularioPlanta.querySelector('[type="submit"]');
    boton.disabled = true;
    mostrarMensajeFormulario("Guardando planta...", "");

    try {
        const datos = leerFormulario();
        let plantaGuardada;

        if (idPlanta) {
            plantaGuardada = await actualizarPlanta(idPlanta, datos);
        } else {
            plantaGuardada = await crearPlanta(datos);
        }

        mostrarMensajeFormulario("La planta fue guardada correctamente.", "exito");

        setTimeout(() => {
            window.location.href = `listado.html?guardada=${plantaGuardada.id}`;
        }, 800);
    } catch (error) {
        boton.disabled = false;
        mostrarMensajeFormulario(error.message, "error");
    }
});

cargarFormulario();
