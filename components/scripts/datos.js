const URL_API = "https://6ae0a63fbe3bc8fead97a7c0.mockapi.io/api/plantas";
const URL_IMAGENES = "https://raw.githubusercontent.com/emigallo-edu/js/main/Ejercicio%20Catalogo%20API/img/";
const IMAGENES_API = ["monstera.jpg", "lavanda.jpg", "echeveria.png", "potus.jpg", "jazmin.jpg", "helecho.png"];

function obtenerFoto(foto) {
    if (!foto) return "./components/images/sansevieria.jpg";
    if (foto.startsWith("http") || foto.startsWith("./")) return foto;

    const archivo = foto.replace("img/", "");
    if (IMAGENES_API.includes(archivo)) return URL_IMAGENES + archivo;

    return "./components/images/sansevieria.jpg";
}

function validarPlanta(planta) {
    return planta.nombreCientifico;
}

async function obtenerPlantas() {
    const response = await fetch(URL_API);

    if (!response.ok) {
        throw new Error("No se pudieron cargar las plantas.");
    }

    const plantas = await response.json();
    const plantasValidas = plantas.filter(validarPlanta);

    plantasValidas.forEach(planta => {
        planta.foto = obtenerFoto(planta.foto);
    });

    return plantasValidas;
}

async function obtenerPlantaPorId(id) {
    const plantas = await obtenerPlantas();
    return plantas.find(planta => String(planta.id) === String(id)) || null;
}

async function crearPlanta(planta) {
    const response = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planta)
    });

    if (!response.ok) {
        throw new Error("No se pudo crear la planta.");
    }

    return response.json();
}

async function actualizarPlanta(id, planta) {
    const response = await fetch(`${URL_API}?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planta)
    });

    if (!response.ok) {
        throw new Error("No se pudo actualizar la planta.");
    }

    return response.json();
}

async function eliminarPlanta(id) {
    const response = await fetch(`${URL_API}?id=${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("No se pudo eliminar la planta.");
    }
}
