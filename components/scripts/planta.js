async function iniciarFicha() {
    const parametros = new URLSearchParams(window.location.search);
    const contenido = document.getElementById("ficha-planta");

    try {
        const planta = await obtenerPlantaPorId(parametros.get("id") || 1);

        if (!planta) {
            contenido.innerHTML = '<div class="estado-vacio"><h1>Planta no encontrada</h1><a href="./catalogo.html" class="boton-principal">Volver al catálogo</a></div>';
            return;
        }

        document.title = `${planta.nombre} - Vivero Raíz`;
        document.getElementById("planta-imagen").src = planta.foto;
        document.getElementById("planta-imagen").alt = planta.nombre;
        document.getElementById("planta-nombre").textContent = planta.nombre;
        document.getElementById("planta-cientifico").textContent = planta.nombreCientifico || "Nombre científico no informado";
        document.getElementById("planta-precio").textContent = "$ " + Number(planta.precio).toLocaleString("es-AR");
        document.getElementById("planta-categoria").textContent = planta.categoria;
        document.getElementById("planta-luz").textContent = planta.luz;
        document.getElementById("planta-riego").textContent = planta.riego;
        document.getElementById("planta-stock").textContent = planta.stock;
        document.getElementById("planta-mascotas").textContent = planta.aptaMascotas ? "Sí" : "No";
        document.getElementById("planta-fecha").textContent = planta.fechaIngreso;
        document.getElementById("planta-etiquetas").textContent = planta.etiquetas.join(", ") || "Sin etiquetas";
        document.getElementById("planta-cuidados").textContent = planta.notas;

        const boton = document.getElementById("agregar-ficha");
        boton.disabled = Number(planta.stock) === 0;
        boton.addEventListener("click", () => {
            const mensaje = document.getElementById("mensaje-ficha");
            mensaje.textContent = agregarAlCarrito(planta)
                ? `${planta.nombre} fue agregada al carrito.`
                : `No hay más stock de ${planta.nombre}.`;
            mensaje.hidden = false;
        });
    } catch (error) {
        contenido.innerHTML = `<div class="estado-vacio"><h1>No se pudo cargar la planta</h1><p>${error.message}</p><a href="./catalogo.html" class="boton-principal">Volver al catálogo</a></div>`;
    }
}

iniciarFicha();
