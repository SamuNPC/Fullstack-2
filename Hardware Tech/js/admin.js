// admin.js - Funcionalidades de administrador para Hardware Tech

// Función para verificar si el usuario actual es admin
function isCurrentUserAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.isAdmin;
}

// Función para obtener usuario actual (compatible con login.js)
function getCurrentUser() {
    const localUser = localStorage.getItem('currentUser');
    const sessionUser = sessionStorage.getItem('currentUser');
    
    if (localUser) {
        return JSON.parse(localUser);
    } else if (sessionUser) {
        return JSON.parse(sessionUser);
    }
    
    return null;
}

// Función para cerrar sesión
function logoutUser() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    alert('Has cerrado sesión exitosamente.');
    window.location.href = 'login.html';
}

// Inicializar productos si no existen
function initializeProducts() {
    if (!localStorage.getItem('hardwareTechProducts')) {
        const defaultProducts = [
            {
                id: 1,
                name: "RTX 2080 Super",
                price: 298990,
                originalPrice: 500000,
                category: "Tarjetas Gráficas",
                image: "img/product-1.jpg",
                description: "Tarjeta gráfica RTX 2080 Super reacondicionada",
                stock: 5,
                featured: true
            },
            {
                id: 2,
                name: "Gabinete Cooler Master ATX",
                price: 28990,
                originalPrice: 53990,
                category: "Gabinetes",
                image: "img/product-2.jpg",
                description: "Gabinete ATX con excelente ventilación",
                stock: 3,
                featured: true
            },
            {
                id: 3,
                name: "PACK X3 Ventiladores ID-Cooling AS-120",
                price: 25990,
                originalPrice: 44990,
                category: "Ventiladores",
                image: "img/product-3.jpg",
                description: "Pack de 3 ventiladores de alto rendimiento",
                stock: 8,
                featured: true
            },
            {
                id: 4,
                name: "Memorias DDR3 1666mhz - 2366 mhz",
                price: 14990,
                originalPrice: null,
                category: "Memorias RAM",
                image: "img/product-4.jpg",
                description: "Memorias DDR3 diferentes frecuencias",
                stock: 15,
                featured: true
            }
        ];
        
        localStorage.setItem('hardwareTechProducts', JSON.stringify(defaultProducts));
    }
}

// Función para obtener todos los productos
function getAllProducts() {
    return JSON.parse(localStorage.getItem('hardwareTechProducts') || '[]');
}

// Función para obtener producto por ID
function getProductById(id) {
    const products = getAllProducts();
    return products.find(product => product.id === parseInt(id));
}

// Función para agregar nuevo producto
function addProduct(productData) {
    const products = getAllProducts();
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    
    const newProduct = {
        id: newId,
        name: productData.name,
        price: parseFloat(productData.price),
        originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
        category: productData.category,
        image: productData.image || 'img/default-product.jpg',
        description: productData.description || '',
        stock: parseInt(productData.stock) || 0,
        featured: productData.featured || false,
        createdAt: new Date().toISOString(),
        createdBy: getCurrentUser().email
    };
    
    products.push(newProduct);
    localStorage.setItem('hardwareTechProducts', JSON.stringify(products));
    
    return newProduct;
}

// Función para actualizar producto
function updateProduct(id, updateData) {
    const products = getAllProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
        throw new Error('Producto no encontrado');
    }
    
    // Actualizar solo los campos proporcionados
    const updatedProduct = {
        ...products[productIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
        updatedBy: getCurrentUser().email
    };
    
    // Asegurar tipos correctos
    if (updateData.price) updatedProduct.price = parseFloat(updateData.price);
    if (updateData.originalPrice) updatedProduct.originalPrice = parseFloat(updateData.originalPrice);
    if (updateData.stock !== undefined) updatedProduct.stock = parseInt(updateData.stock);
    
    products[productIndex] = updatedProduct;
    localStorage.setItem('hardwareTechProducts', JSON.stringify(products));
    
    return updatedProduct;
}

// Función para eliminar producto
function deleteProduct(id) {
    const products = getAllProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
        throw new Error('Producto no encontrado');
    }
    
    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);
    localStorage.setItem('hardwareTechProducts', JSON.stringify(products));
    
    return deletedProduct;
}

// Función para mostrar modal de administración
function showAdminModal() {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
        alert('Acceso denegado. Solo administradores pueden acceder a esta función.');
        return;
    }
    
    // Crear modal de administración
    const modalHTML = `
        <div class="modal fade" id="adminModal" tabindex="-1" role="dialog" aria-labelledby="adminModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="adminModalLabel">
                            <i class="fas fa-user-shield mr-2"></i>Panel de Administración
                        </h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <div class="card h-100">
                                    <div class="card-body text-center">
                                        <i class="fas fa-plus-circle fa-3x text-success mb-3"></i>
                                        <h6>Agregar Producto</h6>
                                        <button class="btn btn-success btn-sm" onclick="showAddProductForm()">
                                            Nuevo Producto
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <div class="card h-100">
                                    <div class="card-body text-center">
                                        <i class="fas fa-edit fa-3x text-warning mb-3"></i>
                                        <h6>Editar Productos</h6>
                                        <button class="btn btn-warning btn-sm" onclick="showProductList()">
                                            Ver Productos
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <div class="card h-100">
                                    <div class="card-body text-center">
                                        <i class="fas fa-users fa-3x text-info mb-3"></i>
                                        <h6>Gestionar Usuarios</h6>
                                        <button class="btn btn-info btn-sm" onclick="showUserList()">
                                            Ver Usuarios
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3">
                            <h6>Estadísticas Rápidas:</h6>
                            <div class="row">
                                <div class="col-md-6">
                                    <small class="text-muted">Productos totales: <strong>${getAllProducts().length}</strong></small>
                                </div>
                                <div class="col-md-6">
                                    <small class="text-muted">Usuarios registrados: <strong>${JSON.parse(localStorage.getItem('hardwareTechUsers') || '[]').length}</strong></small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-danger" onclick="logoutUser()">
                            <i class="fas fa-sign-out-alt mr-1"></i>Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Agregar modal al DOM si no existe
    if (!document.getElementById('adminModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Mostrar modal
    $('#adminModal').modal('show');
}

// Función para mostrar formulario de agregar producto
function showAddProductForm() {
    alert('Funcionalidad de agregar producto en desarrollo. Por ahora puedes usar la consola del navegador para gestionar productos.');
    console.log('Para agregar un producto, usa:');
    console.log('addProduct({name: "Nombre", price: 100000, category: "Categoría", description: "Descripción", stock: 10})');
}

// Función para mostrar lista de productos
function showProductList() {
    const products = getAllProducts();
    console.log('Productos actuales:', products);
    alert(`Hay ${products.length} productos en el sistema. Revisa la consola para ver la lista completa.`);
}

// Función para mostrar lista de usuarios
function showUserList() {
    const users = JSON.parse(localStorage.getItem('hardwareTechUsers') || '[]');
    const userSummary = users.map(user => ({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        isAdmin: user.isAdmin,
        registeredAt: user.registeredAt
    }));
    console.log('Usuarios registrados:', userSummary);
    alert(`Hay ${users.length} usuarios registrados. Revisa la consola para ver la lista completa.`);
}

// Inicializar productos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
});

// Exportar funciones para uso global
window.isCurrentUserAdmin = isCurrentUserAdmin;
window.getCurrentUser = getCurrentUser;
window.logoutUser = logoutUser;
window.showAdminModal = showAdminModal;
window.addProduct = addProduct;
window.updateProduct = updateProduct;
window.deleteProduct = deleteProduct;
window.getAllProducts = getAllProducts;
window.getProductById = getProductById;
window.showAddProductForm = showAddProductForm;
window.showProductList = showProductList;
window.showUserList = showUserList;
