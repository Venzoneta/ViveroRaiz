let temporizadorAviso;

function crearTarjeta(planta) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML = `
        <img src="${planta.foto}" alt="${planta.nombre}">
        <div class="informacion">
            <span class="categoria-planta">${planta.categoria}</span>
            <h3>${planta.nombre}</h3>
            <p class="nombre-cientifico">${planta.nombreCientifico || "Nombre científico no informado"}</p>
            <span class="precio">$ ${Number(planta.precio).toLocaleString("es-AR")}</span>
            <div class="acciones-tarjeta">
                <a href="./planta.html?id=${planta.id}" class="boton-secundario">Ver ficha</a>
                <button type="button" data-agregar="${planta.id}" ${Number(planta.stock) === 0 ? "disabled" : ""}>Agregar</button>
            </div>
        </div>`;
    return tarjeta;
}

function renderizarCatalogo(plantas, contenedor) {
    contenedor.innerHTML = "";
    plantas.forEach(planta => contenedor.appendChild(crearTarjeta(planta)));
}

function filtrarPlantas(plantas, texto, categoria) {
    const busqueda = texto.trim().toLowerCase();
    return plantas.filter(planta => {
        const coincideTexto = planta.nombre.toLowerCase().includes(busqueda)
            || planta.nombreCientifico.toLowerCase().includes(busqueda);
        const coincideCategoria = categoria === "todas" || planta.categoria === categoria;
        return coincideTexto && coincideCategoria;
    });
}

function ordenarPlantas(plantas, criterio) {
    const resultado = plantas.slice();
    if (criterio === "nombre") resultado.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    if (criterio === "precio-asc") resultado.sort((a, b) => a.precio - b.precio);
    if (criterio === "precio-desc") resultado.sort((a, b) => b.precio - a.precio);
    return resultado;
}

function avisar(mensaje) {
    const aviso = document.getElementById("aviso-catalogo");
    aviso.textContent = mensaje;
    aviso.hidden = false;
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => {
        aviso.hidden = true;
    }, 2000);
}

async function iniciar() {
    const contenedor = document.getElementById("productos");
    const buscador = document.getElementById("buscar-planta");
    const categoria = document.getElementById("categoria-planta");
    const orden = document.getElementById("orden-plantas");
    const limpiar = document.getElementById("limpiar-filtros");
    const contador = document.getElementById("contador-resultados");
    const sinResultados = document.getElementById("sin-resultados");
    let plantas = [];

    function actualizar() {
        const filtradas = filtrarPlantas(plantas, buscador.value, categoria.value);
        const ordenadas = ordenarPlantas(filtradas, orden.value);
        renderizarCatalogo(ordenadas, contenedor);
        contador.textContent = `${ordenadas.length} ${ordenadas.length === 1 ? "planta encontrada" : "plantas encontradas"}`;
        sinResultados.hidden = ordenadas.length !== 0;
    }

    buscador.addEventListener("input", actualizar);
    categoria.addEventListener("change", actualizar);
    orden.addEventListener("change", actualizar);
    limpiar.addEventListener("click", () => {
        buscador.value = "";
        categoria.value = "todas";
        orden.value = "nombre";
        actualizar();
    });

    contenedor.addEventListener("click", evento => {
        const boton = evento.target.closest("[data-agregar]");
        if (!boton) return;
        const planta = plantas.find(item => String(item.id) === boton.dataset.agregar);
        if (!planta) return;
        const agregada = agregarAlCarrito(planta);
        avisar(agregada
            ? `${planta.nombre} fue agregada al carrito.`
            : `No hay más stock de ${planta.nombre}.`);
    });

    try {
        contador.textContent = "Cargando plantas...";
        plantas = await obtenerPlantas();
        actualizar();
    } catch (error) {
        contador.textContent = "No se pudo cargar el catálogo.";
        contenedor.innerHTML = `<p class="estado-vacio">${error.message}</p>`;
    }
}

iniciar();
