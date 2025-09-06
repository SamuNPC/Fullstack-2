/**
 * ============================================
 * PRODUCTOS.JS - GESTIÓN DE PRODUCTOS
 * ============================================
 * Funcionalidades para cargar y mostrar productos
 * utilizando el sistema de administración existente
 * ============================================
 */

/**
 * Obtiene el ID del producto desde la URL
 */
function obtenerIdProducto() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 1;
}

/**
 * Busca un producto por ID en el sistema de administración
 */
function buscarProductoPorId(id) {
    // Intentar cargar desde el sistema de administración
    if (typeof cargarProductosAdmin === 'function') {
        const productos = cargarProductosAdmin();
        return productos.find(producto => producto.id === id);
    }
    
    // Si no hay productos en el sistema, usar datos de fallback hardcodeados
    const productosFallback = {
        1: {
            id: 1,
            name: 'Procesador Intel i7 9700K',
            price: 189990,
            image: 'img/product-6.jpg',
            category: 'Procesadores',
            description: 'Procesador Intel Core i7-9700K de 8va generación con 8 núcleos y 8 hilos. Frecuencia base de 3.6 GHz y turbo hasta 4.9 GHz. Socket LGA1151, ideal para gaming y aplicaciones profesionales.'
        },
        2: {
            id: 2,
            name: 'Placa Madre Gigabyte Z590 AORUS PRO AX',
            price: 149000,
            image: 'img/placamadre.jpg',
            category: 'Placas Madre',
            description: 'Placa madre ATX con chipset Z590, compatible con procesadores Intel de 10ma y 11va generación. Incluye WiFi 6E, Bluetooth 5.2, y múltiples puertos de alta velocidad.'
        },
        3: {
            id: 3,
            name: 'Kit Memoria RAM DDR4 16GB (2x8GB) 3200MHz RGB',
            price: 34990,
            image: 'img/product-5.jpg',
            category: 'Memorias RAM',
            description: 'Kit de memoria RAM DDR4 de alto rendimiento con iluminación RGB. 16GB en configuración dual channel para máximo rendimiento en gaming y aplicaciones.'
        },
        4: {
            id: 4,
            name: 'Tarjeta Gráfica RTX 2080 Super 8GB',
            price: 298990,
            image: 'img/tarjeta-grafica.jpg',
            category: 'Tarjetas Gráficas',
            description: 'Tarjeta gráfica NVIDIA GeForce RTX 2080 Super con 8GB de memoria GDDR6. Perfecta para gaming en 1440p y ray tracing en tiempo real.'
        }
    };
    
    return productosFallback[id];
}

/**
 * Carga y muestra los datos del producto en la página
 */
function cargarProducto() {
    const productId = obtenerIdProducto();
    const producto = buscarProductoPorId(productId);
    
    if (!producto) {
        console.warn('Producto no encontrado, cargando producto por defecto');
        const productoDefault = buscarProductoPorId(1);
        if (productoDefault) {
            mostrarDatosProducto(productoDefault);
        }
        return;
    }
    
    mostrarDatosProducto(producto);
}

/**
 * Muestra los datos del producto en la página
 */
function mostrarDatosProducto(producto) {
    // Actualizar imagen
    const productImage = document.getElementById('product-image');
    if (productImage) {
        productImage.src = producto.image;
        productImage.alt = producto.name;
    }
    
    // Actualizar nombre
    const productName = document.getElementById('product-name');
    if (productName) {
        productName.textContent = producto.name;
    }
    
    // Actualizar precio
    const productPrice = document.getElementById('product-price');
    if (productPrice) {
        productPrice.innerHTML = `<h3 class="font-weight-semi-bold mb-4">CLP $${producto.price.toLocaleString()}</h3>`;
    }
    
    // Actualizar descripción
    const productDescription = document.getElementById('product-description');
    if (productDescription) {
        productDescription.textContent = producto.description;
    }
    
    // Configurar botón de agregar al carrito
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.onclick = function() {
            if (typeof agregarAlCarrito === 'function') {
                agregarAlCarrito({
                    id: producto.id,
                    name: producto.name,
                    price: producto.price,
                    image: producto.image
                });
            } else {
                alert('Función de carrito no disponible');
            }
        };
    }
}

/**
 * Inicialización cuando se carga el DOM
 */
document.addEventListener('DOMContentLoaded', function() {
    cargarProducto();
});