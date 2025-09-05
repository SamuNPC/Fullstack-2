// Función para manejar el carrito de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Función para agregar producto al carrito
function addToCart(product) {
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

// Función para actualizar el número de productos en el carrito
function updateCartBadge() {
    const badge = document.querySelector('.fa-shopping-cart').nextElementSibling;
    if (badge) {
        badge.textContent = cart.length;
    }
}

// Función para calcular el subtotal
function calculateSubtotal() {
    return cart.reduce((total, item) => total + item.price, 0);
}

// Función para calcular el envío (10% del subtotal)
function calculateShipping() {
    return calculateSubtotal() * 0.10;
}

// Función para calcular el total
function calculateTotal() {
    return calculateSubtotal() + calculateShipping();
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    updateCartTable();
}

// Función para actualizar la tabla del carrito
function updateCartTable() {
    const table = document.querySelector('.table');
    if (!table) return;

    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    if (cart.length === 0) {
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

    cart.forEach((product, index) => {
        tbody.innerHTML += `
            <tr>
                <td class="align-middle">
                    <img src="${product.image}" alt="${product.name}" style="width: 50px">
                    ${product.name}
                </td>
                <td class="align-middle">$${product.price.toLocaleString('es-CL')}</td>
                <td class="align-middle">1</td>
                <td class="align-middle">$${product.price.toLocaleString('es-CL')}</td>
                <td class="align-middle">
                    <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">
                        <i class="fa fa-times"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    // Actualizar totales
    document.querySelector('.subtotal').textContent = `$${calculateSubtotal().toLocaleString('es-CL')}`;
    document.querySelector('.shipping').textContent = `$${calculateShipping().toLocaleString('es-CL')}`;
    document.querySelector('.total').textContent = `$${calculateTotal().toLocaleString('es-CL')}`;
}

// Inicializar el carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
    updateCartTable();
});
