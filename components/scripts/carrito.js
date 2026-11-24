const CLAVE_CARRITO = "vivero-raiz-carrito";

function leerCarrito() {
    try {
        const carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
        return Array.isArray(carrito) ? carrito : [];
    } catch {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    renderizarCarrito();
}

function agregarAlCarrito(planta) {
    const carrito = leerCarrito();
    const item = carrito.find(item => String(item.id) === String(planta.id));

    if (item) {
        if (item.cantidad >= planta.stock) return false;
        item.cantidad++;
    } else {
        if (planta.stock < 1) return false;
        carrito.push({
            id: planta.id,
            nombre: planta.nombre,
            precio: Number(planta.precio),
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    return true;
}

function quitarDelCarrito(id) {
    guardarCarrito(leerCarrito().filter(item => String(item.id) !== String(id)));
}

function vaciarCarrito() {
    localStorage.removeItem(CLAVE_CARRITO);
    renderizarCarrito();
}

function renderizarCarrito() {
    const carrito = leerCarrito();
    const unidades = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

    document.querySelectorAll("[data-contador-carrito]").forEach(contador => {
        contador.textContent = unidades;
    });

    const lista = document.getElementById("items-carrito");
    const elementoTotal = document.getElementById("total-carrito");
    if (!lista || !elementoTotal) return;

    elementoTotal.textContent = "$ " + total.toLocaleString("es-AR");
    lista.innerHTML = carrito.length === 0
        ? '<li class="carrito-vacio">Tu carrito está vacío.</li>'
        : carrito.map(item => `
            <li class="item-carrito">
                <span>${item.nombre} x${item.cantidad}</span>
                <button type="button" data-quitar="${item.id}">Quitar</button>
            </li>`).join("");
}

const listaCarrito = document.getElementById("items-carrito");
if (listaCarrito) {
    listaCarrito.addEventListener("click", evento => {
        const id = evento.target.dataset.quitar;
        if (id) quitarDelCarrito(id);
    });
}

const botonVaciar = document.getElementById("vaciar-carrito");
if (botonVaciar) botonVaciar.addEventListener("click", vaciarCarrito);

renderizarCarrito();
