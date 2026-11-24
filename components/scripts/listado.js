function renderizarListado(plantas) {
    const cuerpo = document.getElementById("cuerpo-listado");
    cuerpo.innerHTML = plantas.map(planta => `
        <tr>
            <td>${planta.id}</td>
            <td>${planta.nombre}</td>
            <td>${planta.categoria}</td>
            <td>$ ${Number(planta.precio).toLocaleString("es-AR")}</td>
            <td>${planta.stock}</td>
            <td class="acciones-tabla">
                <a href="./planta-form.html?id=${planta.id}">Editar</a>
                <button type="button" data-eliminar="${planta.id}">Eliminar</button>
            </td>
        </tr>`).join("");
}

function mostrarMensajeListado(texto, tipo) {
    const mensaje = document.getElementById("mensaje-listado");
    mensaje.textContent = texto;
    mensaje.className = `mensaje-formulario ${tipo}`;
}

let graficoStock;

function obtenerStockPorCategoria(plantas) {
    const categorias = {
        interior: 0,
        exterior: 0,
        suculenta: 0,
        aromática: 0
    };

    plantas.forEach(planta => {
        if (categorias[planta.categoria] !== undefined) {
            categorias[planta.categoria] += Number(planta.stock);
        }
    });

    return categorias;
}

function renderizarGrafico(plantas) {
    const canvas = document.getElementById("grafico-stock");
    const categorias = obtenerStockPorCategoria(plantas);

    if (typeof Chart === "undefined") {
        canvas.parentElement.innerHTML = '<p class="estado-vacio">No se pudo cargar el gráfico.</p>';
        return;
    }

    if (graficoStock) graficoStock.destroy();

    graficoStock = new Chart(canvas, {
        type: "bar",
        data: {
            labels: ["Interior", "Exterior", "Suculentas", "Aromáticas"],
            datasets: [{
                label: "Unidades disponibles",
                data: Object.values(categorias),
                backgroundColor: ["#5f7351", "#839b72", "#a8b99d", "#c4a96a"],
                borderColor: "#35452f",
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });
}

async function iniciarListado() {
    const cuerpo = document.getElementById("cuerpo-listado");
    let plantas = [];

    try {
        mostrarMensajeListado("Cargando plantas...", "");
        plantas = await obtenerPlantas();
        renderizarListado(plantas);
        renderizarGrafico(plantas);
        const guardada = new URLSearchParams(window.location.search).has("guardada");
        mostrarMensajeListado(guardada ? "La planta fue guardada correctamente." : "", guardada ? "exito" : "");
    } catch (error) {
        mostrarMensajeListado(error.message, "error");
    }

    cuerpo.addEventListener("click", async evento => {
        const boton = evento.target.closest("[data-eliminar]");
        if (!boton) return;

        const id = boton.dataset.eliminar;
        const planta = plantas.find(item => String(item.id) === id);
        if (!window.confirm(`¿Querés eliminar ${planta ? planta.nombre : "esta planta"}?`)) return;
        boton.disabled = true;

        try {
            await eliminarPlanta(id);
            plantas = plantas.filter(planta => String(planta.id) !== id);
            renderizarListado(plantas);
            renderizarGrafico(plantas);
            mostrarMensajeListado("La planta fue eliminada correctamente.", "exito");
        } catch (error) {
            boton.disabled = false;
            mostrarMensajeListado(error.message, "error");
        }
    });
}

iniciarListado();
