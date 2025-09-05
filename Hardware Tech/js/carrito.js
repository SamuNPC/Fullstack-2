// Variables del carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para agregar producto al carrito
function agregarAlCarrito(producto) {
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Función para actualizar el número de productos en el carrito
function actualizarContadorCarrito() {
    const contador = document.querySelector('.fa-shopping-cart').nextElementSibling;
    if (contador) {
        contador.textContent = carrito.length;
    }
}

// Función para calcular el subtotal
function calcularSubtotal() {
    return carrito.reduce((total, item) => total + item.price, 0);
}

// Función para calcular el envío (10% del subtotal)
function calcularEnvio() {
    return calcularSubtotal() * 0.10;
}

// Función para calcular el total
function calcularTotal() {
    return calcularSubtotal() + calcularEnvio();
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(indice) {
    carrito.splice(indice, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    actualizarTablaCarrito();
}

// Función para actualizar la tabla del carrito
function actualizarTablaCarrito() {
    const tabla = document.querySelector('.table');
    if (!tabla) return;

    const tbody = tabla.querySelector('tbody');
    tbody.innerHTML = '';

    if (carrito.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No hay productos en el carrito</td>
            </tr>
        `;
        document.querySelector('.subtotal').textContent = '$0';
        document.querySelector('.shipping').textContent = '$0';
        document.querySelector('.total').textContent = '$0';
        return;
    }

    carrito.forEach((producto, indice) => {
        tbody.innerHTML += `
            <tr>
                <td class="align-middle">
                    <img src="${producto.image}" alt="${producto.name}" style="width: 50px">
                    ${producto.name}
                </td>
                <td class="align-middle">$${producto.price.toLocaleString('es-CL')}</td>
                <td class="align-middle">1</td>
                <td class="align-middle">$${producto.price.toLocaleString('es-CL')}</td>
                <td class="align-middle">
                    <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${indice})">
                        <i class="fa fa-times"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    // Actualizar totales
    document.querySelector('.subtotal').textContent = `$${calcularSubtotal().toLocaleString('es-CL')}`;
    document.querySelector('.shipping').textContent = `$${calcularEnvio().toLocaleString('es-CL')}`;
    document.querySelector('.total').textContent = `$${calcularTotal().toLocaleString('es-CL')}`;
}

// Inicializar el carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarContadorCarrito();
    actualizarTablaCarrito();
});
