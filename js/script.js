// =========================
// NOVA-INDUMENTARIA
// SCRIPT PRINCIPAL
// =========================

// =========================
// CONFIGURACIÓN
// =========================

const numeroWhatsApp = "5493511234567";

// =========================
// WHATSAPP - PRODUCTOS
// =========================

const botonesProducto = document.querySelectorAll(".boton-producto");

botonesProducto.forEach(function (boton) {
  boton.addEventListener("click", function () {
    const producto = boton.dataset.producto;

    const mensaje = `Hola, quisiera consultar por el producto: ${producto}`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
  });
});

// =========================
// WHATSAPP - CONTACTO
// =========================

const botonWhatsApp = document.getElementById("boton-whatsapp");

if (botonWhatsApp) {
  botonWhatsApp.addEventListener("click", function (evento) {
    evento.preventDefault();

    const mensaje =
      "Hola, quisiera consultar por la ropa de Nova-Indumentaria.";

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
  });
}

// =========================
// FILTROS Y BUSCADOR
// =========================

const botonesFiltro = document.querySelectorAll(".filtro");

const productos = document.querySelectorAll(".producto");

const buscador = document.getElementById("buscador-productos");

let filtroActual = "todos";

function actualizarProductos() {
  const texto = buscador ? buscador.value.toLowerCase().trim() : "";

  productos.forEach(function (producto) {
    const categoria = producto.dataset.categoria.toLowerCase();

    const nombre = producto.querySelector("h3").textContent.toLowerCase();

    const coincideCategoria =
      filtroActual === "todos" || categoria === filtroActual;

    const coincideBusqueda =
      nombre.includes(texto) || categoria.includes(texto);

    if (coincideCategoria && coincideBusqueda) {
      producto.style.display = "block";
    } else {
      producto.style.display = "none";
    }
  });
}

botonesFiltro.forEach(function (boton) {
  boton.addEventListener("click", function () {
    filtroActual = boton.dataset.filtro;

    botonesFiltro.forEach(function (boton) {
      boton.classList.remove("activo");
    });

    boton.classList.add("activo");

    actualizarProductos();
  });
});

if (buscador) {
  buscador.addEventListener("input", function () {
    actualizarProductos();
  });
}

// =========================
// CATEGORÍAS
// =========================

const categorias = document.querySelectorAll(".categoria");

categorias.forEach(function (categoria) {
  categoria.addEventListener("click", function () {
    const categoriaSeleccionada = categoria.dataset.categoria;

    botonesFiltro.forEach(function (boton) {
      if (boton.dataset.filtro === categoriaSeleccionada) {
        boton.click();
      }
    });
  });
});

// =========================
// CARRITO
// =========================

let carrito = [];

const botonesCarrito = document.querySelectorAll(".boton-carrito");

const botonCarrito = document.getElementById("boton-carrito");

const carritoPanel = document.getElementById("carrito-panel");

const cerrarCarrito = document.getElementById("cerrar-carrito");

const carritoProductos = document.getElementById("carrito-productos");

const contadorCarrito = document.getElementById("contador-carrito");

const carritoTotal = document.getElementById("carrito-total");

// =========================
// ABRIR CARRITO
// =========================

if (botonCarrito) {
  botonCarrito.addEventListener("click", function () {
    carritoPanel.classList.add("abierto");
  });
}

// =========================
// CERRAR CARRITO
// =========================

if (cerrarCarrito) {
  cerrarCarrito.addEventListener("click", function () {
    carritoPanel.classList.remove("abierto");
  });
}

// =========================
// AGREGAR PRODUCTOS
// =========================

botonesCarrito.forEach(function (boton) {
  boton.addEventListener("click", function () {
    const producto = boton.dataset.producto;

    const precio = Number(boton.dataset.precio);

    const tarjeta = boton.closest(".producto");

    const selects = tarjeta.querySelectorAll(".select-producto");

    const talle = selects[0].value;

    const color = selects[1].value;

    const productoExistente = carrito.find(function (item) {
      return (
        item.nombre === producto && item.talle === talle && item.color === color
      );
    });

    if (productoExistente) {
      productoExistente.cantidad++;
    } else {
      carrito.push({
        nombre: producto,

        precio: precio,

        cantidad: 1,

        talle: talle,

        color: color,
      });
    }

    actualizarCarrito();
  });
});

// =========================
// ACTUALIZAR CARRITO
// =========================

function actualizarCarrito() {
  carritoProductos.innerHTML = "";

  let total = 0;

  if (carrito.length === 0) {
    carritoProductos.innerHTML = `
            <p class="carrito-vacio">
                Tu carrito está vacío.
            </p>
        `;
  }

  carrito.forEach(function (producto, indice) {
    const subtotal = producto.precio * producto.cantidad;

    total += subtotal;

    const productoCarrito = document.createElement("div");

    productoCarrito.classList.add("producto-carrito");

    productoCarrito.innerHTML = `

            <div class="producto-carrito-info">

                <h3>
                    ${producto.nombre}
                </h3>

                <p class="producto-carrito-detalle">
                    Talle: ${producto.talle}
                </p>

                <p class="producto-carrito-detalle">
                    Color: ${producto.color}
                </p>

                <p class="producto-carrito-precio">
                    $${producto.precio.toLocaleString("es-AR")}
                </p>


                <div class="cantidad-control">

                    <button
                        class="cantidad-btn"
                        data-accion="restar"
                        data-indice="${indice}"
                    >
                        −
                    </button>


                    <span>
                        ${producto.cantidad}
                    </span>


                    <button
                        class="cantidad-btn"
                        data-accion="sumar"
                        data-indice="${indice}"
                    >
                        +
                    </button>

                </div>

            </div>


            <div class="producto-carrito-derecha">

                <strong>
                    $${subtotal.toLocaleString("es-AR")}
                </strong>


                <button
                    class="eliminar-producto"
                    data-indice="${indice}"
                    aria-label="Eliminar producto"
                >
                    ×
                </button>

            </div>

        `;

    carritoProductos.appendChild(productoCarrito);
  });

  // Contador del carrito

  contadorCarrito.textContent = carrito.reduce(function (total, producto) {
    return total + producto.cantidad;
  }, 0);

  // Total

  carritoTotal.textContent = "$" + total.toLocaleString("es-AR");

  // =========================
  // ELIMINAR
  // =========================

  const botonesEliminar = document.querySelectorAll(".eliminar-producto");

  botonesEliminar.forEach(function (boton) {
    boton.addEventListener("click", function () {
      const indice = Number(boton.dataset.indice);

      carrito.splice(indice, 1);

      actualizarCarrito();
    });
  });

  // =========================
  // CAMBIAR CANTIDAD
  // =========================

  const botonesCantidad = document.querySelectorAll(".cantidad-btn");

  botonesCantidad.forEach(function (boton) {
    boton.addEventListener("click", function () {
      const indice = Number(boton.dataset.indice);

      const accion = boton.dataset.accion;

      if (accion === "sumar") {
        carrito[indice].cantidad++;
      }

      if (accion === "restar") {
        carrito[indice].cantidad--;

        if (carrito[indice].cantidad <= 0) {
          carrito.splice(indice, 1);
        }
      }

      actualizarCarrito();
    });
  });
}

// =========================
// FINALIZAR COMPRA
// =========================

const botonFinalizar = document.getElementById("boton-finalizar");

if (botonFinalizar) {
  botonFinalizar.addEventListener("click", function () {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");

      return;
    }

    let mensaje = "Hola, quiero realizar el siguiente pedido:\n\n";

    let total = 0;

    carrito.forEach(function (producto) {
      const subtotal = producto.precio * producto.cantidad;

      total += subtotal;

      mensaje +=
        `• ${producto.nombre}\n` +
        `  Talle: ${producto.talle}\n` +
        `  Color: ${producto.color}\n` +
        `  Cantidad: ${producto.cantidad}\n` +
        `  Subtotal: $${subtotal.toLocaleString("es-AR")}\n\n`;
    });

    mensaje += `Total del pedido: $${total.toLocaleString("es-AR")}`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
  });
}

// =========================
// INICIO
// =========================

actualizarProductos();

actualizarCarrito();
