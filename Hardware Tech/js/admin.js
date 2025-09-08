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
                                        <i class="fas fa-boxes fa-3x text-primary mb-3"></i>
                                        <h6>Gestión de Productos</h6>
                                        <p class="small text-muted">Crear, editar y eliminar productos</p>
                                        <button class="btn btn-primary btn-sm" onclick="mostrarPanelProductos()">
                                            Administrar Productos
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <div class="card h-100">
                                    <div class="card-body text-center">
                                        <i class="fas fa-users fa-3x text-info mb-3"></i>
                                        <h6>Gestionar Usuarios</h6>
                                        <p class="small text-muted">Ver y administrar usuarios</p>
                                        <button class="btn btn-info btn-sm" onclick="showUserList()">
                                            Ver Usuarios
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <div class="card h-100">
                                    <div class="card-body text-center">
                                        <i class="fas fa-chart-bar fa-3x text-success mb-3"></i>
                                        <h6>Estadísticas</h6>
                                        <p class="small text-muted">Ver métricas del sistema</p>
                                        <button class="btn btn-success btn-sm" onclick="mostrarEstadisticas()">
                                            Ver Estadísticas
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3">
                            <h6>Resumen del Sistema:</h6>
                            <div class="row">
                                <div class="col-md-4">
                                    <small class="text-muted">Productos totales: <strong>${typeof obtenerTodosLosProductos === 'function' ? obtenerTodosLosProductos().length : 'N/A'}</strong></small>
                                </div>
                                <div class="col-md-4">
                                    <small class="text-muted">Usuarios registrados: <strong>${JSON.parse(localStorage.getItem('hardwareTechUsers') || '[]').length}</strong></small>
                                </div>
                                <div class="col-md-4">
                                    <small class="text-muted">Admin actual: <strong>${currentUser.firstName} ${currentUser.lastName}</strong></small>
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

// Función para mostrar estadísticas del sistema
function mostrarEstadisticas() {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
        alert('Acceso denegado. Solo administradores pueden ver estadísticas.');
        return;
    }
    
    const productos = typeof obtenerTodosLosProductos === 'function' ? obtenerTodosLosProductos() : [];
    const usuarios = JSON.parse(localStorage.getItem('hardwareTechUsers') || '[]');
    
    // Calcular estadísticas
    const totalProductos = productos.length;
    const productosEnStock = productos.filter(p => p.stock > 0).length;
    const productosSinStock = productos.filter(p => p.stock === 0).length;
    const valorTotalInventario = productos.reduce((total, p) => total + (p.price * p.stock), 0);
    
    const totalUsuarios = usuarios.length;
    const usuariosAdmin = usuarios.filter(u => u.isAdmin).length;
    const usuariosRegulares = usuarios.filter(u => !u.isAdmin).length;
    
    // Estadísticas por categoría
    const categorias = {};
    productos.forEach(p => {
        if (!categorias[p.category]) {
            categorias[p.category] = { cantidad: 0, valor: 0 };
        }
        categorias[p.category].cantidad++;
        categorias[p.category].valor += p.price * p.stock;
    });
    
    let categoriasHTML = '';
    for (const [categoria, datos] of Object.entries(categorias)) {
        categoriasHTML += `
            <tr>
                <td>${categoria}</td>
                <td>${datos.cantidad}</td>
                <td>CLP $${datos.valor.toLocaleString()}</td>
            </tr>
        `;
    }
    
    const statsHTML = `
        <div class="modal fade" id="statsModal" tabindex="-1" role="dialog" aria-labelledby="statsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title" id="statsModalLabel">
                            <i class="fas fa-chart-bar mr-2"></i>Estadísticas del Sistema
                        </h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <!-- Resumen General -->
                        <div class="row mb-4">
                            <div class="col-md-3">
                                <div class="card bg-primary text-white">
                                    <div class="card-body text-center">
                                        <h3>${totalProductos}</h3>
                                        <p class="mb-0">Total Productos</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-success text-white">
                                    <div class="card-body text-center">
                                        <h3>${productosEnStock}</h3>
                                        <p class="mb-0">En Stock</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-warning text-white">
                                    <div class="card-body text-center">
                                        <h3>${productosSinStock}</h3>
                                        <p class="mb-0">Sin Stock</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-info text-white">
                                    <div class="card-body text-center">
                                        <h6>CLP $${valorTotalInventario.toLocaleString()}</h6>
                                        <p class="mb-0">Valor Inventario</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <!-- Estadísticas de Productos -->
                            <div class="col-md-8">
                                <div class="card">
                                    <div class="card-header">
                                        <h6><i class="fas fa-boxes mr-2"></i>Productos por Categoría</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table class="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Categoría</th>
                                                        <th>Cantidad</th>
                                                        <th>Valor Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${categoriasHTML || '<tr><td colspan="3" class="text-center">No hay datos</td></tr>'}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Estadísticas de Usuarios -->
                            <div class="col-md-4">
                                <div class="card">
                                    <div class="card-header">
                                        <h6><i class="fas fa-users mr-2"></i>Usuarios del Sistema</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row mb-3">
                                            <div class="col-6">
                                                <div class="text-center">
                                                    <h4 class="text-primary">${totalUsuarios}</h4>
                                                    <small>Total</small>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="text-center">
                                                    <h4 class="text-danger">${usuariosAdmin}</h4>
                                                    <small>Admins</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="text-center">
                                            <h4 class="text-success">${usuariosRegulares}</h4>
                                            <small>Usuarios Regulares</small>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="card mt-3">
                                    <div class="card-header">
                                        <h6><i class="fas fa-info-circle mr-2"></i>Sistema</h6>
                                    </div>
                                    <div class="card-body">
                                        <small class="text-muted">
                                            <strong>Fecha:</strong> ${new Date().toLocaleDateString()}<br>
                                            <strong>Admin:</strong> ${currentUser.firstName} ${currentUser.lastName}<br>
                                            <strong>Email:</strong> ${currentUser.email}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-success" onclick="exportarEstadisticas()">
                            <i class="fas fa-download mr-1"></i>Exportar Estadísticas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente y agregar nuevo
    const modalExistente = document.getElementById('statsModal');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', statsHTML);
    $('#statsModal').modal('show');
}

// Función para exportar estadísticas
function exportarEstadisticas() {
    const productos = typeof obtenerTodosLosProductos === 'function' ? obtenerTodosLosProductos() : [];
    const usuarios = JSON.parse(localStorage.getItem('hardwareTechUsers') || '[]');
    
    const estadisticas = {
        fecha: new Date().toISOString(),
        productos: {
            total: productos.length,
            enStock: productos.filter(p => p.stock > 0).length,
            sinStock: productos.filter(p => p.stock === 0).length,
            valorTotal: productos.reduce((total, p) => total + (p.price * p.stock), 0)
        },
        usuarios: {
            total: usuarios.length,
            administradores: usuarios.filter(u => u.isAdmin).length,
            regulares: usuarios.filter(u => !u.isAdmin).length
        }
    };
    
    const dataStr = JSON.stringify(estadisticas, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = URL.createObjectURL(dataBlob);
    enlaceDescarga.download = `estadisticas_hardware_tech_${new Date().toISOString().split('T')[0]}.json`;
    enlaceDescarga.click();
    
    alert('✅ Estadísticas exportadas exitosamente');
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
window.showProductList = showProductList;
window.showUserList = showUserList;
window.mostrarEstadisticas = mostrarEstadisticas;
window.exportarEstadisticas = exportarEstadisticas;
