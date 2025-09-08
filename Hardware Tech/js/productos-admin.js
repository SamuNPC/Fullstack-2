// ========================================
// SISTEMA DE ADMINISTRACIÓN DE PRODUCTOS
// Hardware Tech E-commerce - CRUD Completo
// ========================================

// Verificar permisos de administrador
function verificarAdministrador() {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
        alert('❌ Acceso denegado. Solo administradores pueden gestionar productos.');
        return false;
    }
    return true;
}

// ========================================
// GESTIÓN DE DATOS DE PRODUCTOS
// ========================================

/**
 * Cargar productos desde localStorage o usar datos por defecto
 */
function cargarProductosAdmin() {
    const productosGuardados = localStorage.getItem('PRODUCTOS_HT_DATA');
    if (productosGuardados) {
        return JSON.parse(productosGuardados);
    }
    
    // Si no hay productos guardados, usar los del sistema
    if (typeof PRODUCTOS_HT !== 'undefined') {
        guardarProductosAdmin(PRODUCTOS_HT);
        return PRODUCTOS_HT;
    }
    
    return [];
}

/**
 * Guardar productos en localStorage
 */
function guardarProductosAdmin(productos) {
    localStorage.setItem('PRODUCTOS_HT_DATA', JSON.stringify(productos));
    
    // También actualizar la variable global si existe
    if (typeof PRODUCTOS_HT !== 'undefined') {
        window.PRODUCTOS_HT = productos;
    }
}

/**
 * Obtener el siguiente ID disponible
 */
function obtenerSiguienteId() {
    const productos = cargarProductosAdmin();
    if (productos.length === 0) return 1;
    return Math.max(...productos.map(p => p.id)) + 1;
}

// ========================================
// OPERACIONES CRUD
// ========================================

/**
 * CREAR - Agregar nuevo producto
 */
function crearProducto(datosProducto) {
    if (!verificarAdministrador()) return null;
    
    try {
        const productos = cargarProductosAdmin();
        const nuevoProducto = {
            id: obtenerSiguienteId(),
            name: datosProducto.name || '',
            shortName: datosProducto.shortName || datosProducto.name || '',
            category: datosProducto.category || '',
            price: parseFloat(datosProducto.price) || 0,
            image: datosProducto.image || 'img/product-default.jpg',
            stock: parseInt(datosProducto.stock) || 0,
            rating: parseFloat(datosProducto.rating) || 0,
            shortDescription: datosProducto.shortDescription || '',
            createdAt: new Date().toISOString(),
            createdBy: getCurrentUser().email
        };
        
        productos.push(nuevoProducto);
        guardarProductosAdmin(productos);
        
        console.log('✅ Producto creado:', nuevoProducto);
        return nuevoProducto;
        
    } catch (error) {
        console.error('❌ Error al crear producto:', error);
        alert('Error al crear el producto: ' + error.message);
        return null;
    }
}

/**
 * LEER - Obtener todos los productos
 */
function obtenerTodosLosProductos() {
    if (!verificarAdministrador()) return [];
    return cargarProductosAdmin();
}

/**
 * LEER - Obtener producto por ID
 */
function obtenerProductoPorId(id) {
    if (!verificarAdministrador()) return null;
    
    const productos = cargarProductosAdmin();
    return productos.find(p => p.id === parseInt(id)) || null;
}

/**
 * ACTUALIZAR - Editar producto existente
 */
function actualizarProducto(id, datosActualizados) {
    if (!verificarAdministrador()) return null;
    
    try {
        const productos = cargarProductosAdmin();
        const indice = productos.findIndex(p => p.id === parseInt(id));
        
        if (indice === -1) {
            throw new Error('Producto no encontrado');
        }
        
        // Actualizar solo los campos proporcionados
        const productoActualizado = {
            ...productos[indice],
            ...datosActualizados,
            id: parseInt(id), // Mantener ID original
            updatedAt: new Date().toISOString(),
            updatedBy: getCurrentUser().email
        };
        
        // Validar tipos de datos
        if (datosActualizados.price !== undefined) {
            productoActualizado.price = parseFloat(datosActualizados.price);
        }
        if (datosActualizados.stock !== undefined) {
            productoActualizado.stock = parseInt(datosActualizados.stock);
        }
        if (datosActualizados.rating !== undefined) {
            productoActualizado.rating = parseFloat(datosActualizados.rating);
        }
        
        productos[indice] = productoActualizado;
        guardarProductosAdmin(productos);
        
        console.log('✅ Producto actualizado:', productoActualizado);
        return productoActualizado;
        
    } catch (error) {
        console.error('❌ Error al actualizar producto:', error);
        alert('Error al actualizar el producto: ' + error.message);
        return null;
    }
}

/**
 * ELIMINAR - Borrar producto
 */
function eliminarProducto(id) {
    if (!verificarAdministrador()) return false;
    
    try {
        const productos = cargarProductosAdmin();
        const indice = productos.findIndex(p => p.id === parseInt(id));
        
        if (indice === -1) {
            throw new Error('Producto no encontrado');
        }
        
        const productoEliminado = productos[indice];
        productos.splice(indice, 1);
        guardarProductosAdmin(productos);
        
        console.log('✅ Producto eliminado:', productoEliminado);
        return true;
        
    } catch (error) {
        console.error('❌ Error al eliminar producto:', error);
        alert('Error al eliminar el producto: ' + error.message);
        return false;
    }
}

// ========================================
// INTERFAZ DE ADMINISTRACIÓN
// ========================================

/**
 * Mostrar panel principal de administración de productos
 */
function mostrarPanelProductos() {
    if (!verificarAdministrador()) return;
    
    const productos = cargarProductosAdmin();
    
    const modalHTML = `
        <div class="modal fade" id="productAdminModal" tabindex="-1" role="dialog" aria-labelledby="productAdminModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="productAdminModalLabel">
                            <i class="fas fa-boxes mr-2"></i>Administración de Productos
                        </h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <!-- Botones de acción -->
                        <div class="row mb-4">
                            <div class="col-md-3">
                                <button class="btn btn-success btn-block" onclick="mostrarFormularioCrear()">
                                    <i class="fas fa-plus"></i> Crear Producto
                                </button>
                            </div>
                            <div class="col-md-3">
                                <button class="btn btn-info btn-block" onclick="actualizarTablaProductos()">
                                    <i class="fas fa-sync"></i> Actualizar Lista
                                </button>
                            </div>
                            <div class="col-md-3">
                                <button class="btn btn-warning btn-block" onclick="exportarProductos()">
                                    <i class="fas fa-download"></i> Exportar
                                </button>
                            </div>
                            <div class="col-md-3">
                                <button class="btn btn-secondary btn-block" onclick="importarProductos()">
                                    <i class="fas fa-upload"></i> Importar
                                </button>
                            </div>
                        </div>
                        
                        <!-- Estadísticas -->
                        <div class="row mb-4">
                            <div class="col-md-4">
                                <div class="card bg-primary text-white">
                                    <div class="card-body text-center">
                                        <h5>${productos.length}</h5>
                                        <small>Total Productos</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card bg-success text-white">
                                    <div class="card-body text-center">
                                        <h5>${productos.filter(p => p.stock > 0).length}</h5>
                                        <small>En Stock</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card bg-warning text-white">
                                    <div class="card-body text-center">
                                        <h5>${productos.filter(p => p.stock === 0).length}</h5>
                                        <small>Sin Stock</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tabla de productos -->
                        <div class="table-responsive" id="productTableContainer">
                            ${generarTablaProductos(productos)}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente y agregar nuevo
    const modalExistente = document.getElementById('productAdminModal');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    $('#productAdminModal').modal('show');
}

/**
 * Generar tabla HTML de productos
 */
function generarTablaProductos(productos) {
    if (productos.length === 0) {
        return '<div class="alert alert-info text-center">No hay productos registrados</div>';
    }
    
    let tabla = `
        <table class="table table-striped table-hover">
            <thead class="thead-dark">
                <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    productos.forEach(producto => {
        tabla += `
            <tr>
                <td><span class="badge badge-primary">${producto.id}</span></td>
                <td><img src="${producto.image}" alt="${producto.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
                <td>
                    <strong>${producto.name}</strong><br>
                    <small class="text-muted">${producto.shortName}</small>
                </td>
                <td><span class="badge badge-info">${producto.category}</span></td>
                <td><strong>CLP $${producto.price.toLocaleString()}</strong></td>
                <td>
                    <span class="badge ${producto.stock > 0 ? 'badge-success' : 'badge-danger'}">
                        ${producto.stock}
                    </span>
                </td>
                <td>
                    <div class="text-warning">
                        ${'★'.repeat(Math.floor(producto.rating))}${'☆'.repeat(5 - Math.floor(producto.rating))}
                        <small>(${producto.rating})</small>
                    </div>
                </td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-outline-warning" onclick="mostrarFormularioEditar(${producto.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="confirmarEliminar(${producto.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tabla += '</tbody></table>';
    return tabla;
}

/**
 * Actualizar tabla de productos
 */
function actualizarTablaProductos() {
    const productos = cargarProductosAdmin();
    const container = document.getElementById('productTableContainer');
    if (container) {
        container.innerHTML = generarTablaProductos(productos);
    }
}

/**
 * Confirmar eliminación de producto
 */
function confirmarEliminar(id) {
    const producto = obtenerProductoPorId(id);
    if (!producto) return;
    
    if (confirm(`¿Estás seguro de que quieres eliminar el producto "${producto.name}"?`)) {
        if (eliminarProducto(id)) {
            alert('✅ Producto eliminado exitosamente');
            actualizarTablaProductos();
        }
    }
}

// ========================================
// EXPORTACIÓN/IMPORTACIÓN
// ========================================

/**
 * Exportar productos a JSON
 */
function exportarProductos() {
    if (!verificarAdministrador()) return;
    
    const productos = cargarProductosAdmin();
    const dataStr = JSON.stringify(productos, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = URL.createObjectURL(dataBlob);
    enlaceDescarga.download = `productos_hardware_tech_${new Date().toISOString().split('T')[0]}.json`;
    enlaceDescarga.click();
    
    alert('✅ Productos exportados exitosamente');
}

/**
 * Importar productos desde JSON
 */
function importarProductos() {
    if (!verificarAdministrador()) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const productos = JSON.parse(e.target.result);
                if (Array.isArray(productos)) {
                    guardarProductosAdmin(productos);
                    alert('✅ Productos importados exitosamente');
                    actualizarTablaProductos();
                } else {
                    alert('❌ Formato de archivo inválido');
                }
            } catch (error) {
                alert('❌ Error al leer el archivo: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// ========================================
// FORMULARIOS DE EDICIÓN
// ========================================

/**
 * Mostrar formulario para crear producto
 */
function mostrarFormularioCrear() {
    mostrarFormularioProducto(null);
}

/**
 * Mostrar formulario para editar producto
 */
function mostrarFormularioEditar(id) {
    const producto = obtenerProductoPorId(id);
    mostrarFormularioProducto(producto);
}

/**
 * Mostrar formulario de producto (crear/editar)
 */
function mostrarFormularioProducto(producto = null) {
    const esEdicion = producto !== null;
    const titulo = esEdicion ? 'Editar Producto' : 'Crear Nuevo Producto';
    
    const formHTML = `
        <div class="modal fade" id="productFormModal" tabindex="-1" role="dialog" aria-labelledby="productFormModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-${esEdicion ? 'warning' : 'success'} text-white">
                        <h5 class="modal-title" id="productFormModalLabel">
                            <i class="fas fa-${esEdicion ? 'edit' : 'plus'}"></i> ${titulo}
                        </h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="productForm">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="productName">Nombre del Producto *</label>
                                        <input type="text" class="form-control" id="productName" value="${producto?.name || ''}" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="productShortName">Nombre Corto</label>
                                        <input type="text" class="form-control" id="productShortName" value="${producto?.shortName || ''}">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="productCategory">Categoría *</label>
                                        <select class="form-control" id="productCategory" required>
                                            <option value="">Seleccionar categoría</option>
                                            <option value="Procesadores" ${producto?.category === 'Procesadores' ? 'selected' : ''}>Procesadores</option>
                                            <option value="Placas Madre" ${producto?.category === 'Placas Madre' ? 'selected' : ''}>Placas Madre</option>
                                            <option value="Memorias RAM" ${producto?.category === 'Memorias RAM' ? 'selected' : ''}>Memorias RAM</option>
                                            <option value="Tarjetas Gráficas" ${producto?.category === 'Tarjetas Gráficas' ? 'selected' : ''}>Tarjetas Gráficas</option>
                                            <option value="Almacenamiento" ${producto?.category === 'Almacenamiento' ? 'selected' : ''}>Almacenamiento</option>
                                            <option value="Gabinetes" ${producto?.category === 'Gabinetes' ? 'selected' : ''}>Gabinetes</option>
                                            <option value="Ventiladores" ${producto?.category === 'Ventiladores' ? 'selected' : ''}>Ventiladores</option>
                                            <option value="Fuentes de Poder" ${producto?.category === 'Fuentes de Poder' ? 'selected' : ''}>Fuentes de Poder</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="productPrice">Precio (CLP) *</label>
                                        <input type="number" class="form-control" id="productPrice" value="${producto?.price || ''}" min="0" step="1" required>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="productStock">Stock</label>
                                        <input type="number" class="form-control" id="productStock" value="${producto?.stock || 0}" min="0">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="productRating">Rating (0-5)</label>
                                        <input type="number" class="form-control" id="productRating" value="${producto?.rating || 0}" min="0" max="5" step="0.1">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="productImage">URL de Imagen</label>
                                <input type="text" class="form-control" id="productImage" value="${producto?.image || ''}" placeholder="img/producto.jpg">
                                <small class="form-text text-muted">Ruta relativa a la imagen del producto</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="productDescription">Descripción</label>
                                <textarea class="form-control" id="productDescription" rows="3">${producto?.shortDescription || ''}</textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-${esEdicion ? 'warning' : 'success'}" onclick="guardarProducto(${esEdicion ? producto.id : 'null'})">
                            <i class="fas fa-save"></i> ${esEdicion ? 'Actualizar' : 'Crear'} Producto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente y agregar nuevo
    const modalExistente = document.getElementById('productFormModal');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', formHTML);
    $('#productFormModal').modal('show');
}

/**
 * Guardar producto (crear o actualizar)
 */
function guardarProducto(id = null) {
    const esEdicion = id !== null;
    
    // Obtener datos del formulario
    const datos = {
        name: document.getElementById('productName').value.trim(),
        shortName: document.getElementById('productShortName').value.trim(),
        category: document.getElementById('productCategory').value,
        price: document.getElementById('productPrice').value,
        stock: document.getElementById('productStock').value,
        rating: document.getElementById('productRating').value,
        image: document.getElementById('productImage').value.trim(),
        shortDescription: document.getElementById('productDescription').value.trim()
    };
    
    // Validaciones
    if (!datos.name) {
        alert('❌ El nombre del producto es obligatorio');
        return;
    }
    
    if (!datos.category) {
        alert('❌ La categoría es obligatoria');
        return;
    }
    
    if (!datos.price || datos.price <= 0) {
        alert('❌ El precio debe ser mayor a 0');
        return;
    }
    
    // Valores por defecto
    if (!datos.shortName) datos.shortName = datos.name;
    if (!datos.image) datos.image = 'img/product-default.jpg';
    
    // Guardar producto
    let resultado;
    if (esEdicion) {
        resultado = actualizarProducto(id, datos);
    } else {
        resultado = crearProducto(datos);
    }
    
    if (resultado) {
        alert(`✅ Producto ${esEdicion ? 'actualizado' : 'creado'} exitosamente`);
        $('#productFormModal').modal('hide');
        actualizarTablaProductos();
    }
}

// ========================================
// INICIALIZACIÓN Y EXPORTS
// ========================================

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos desde localStorage si existen
    const productosGuardados = cargarProductosAdmin();
    if (productosGuardados.length > 0 && typeof PRODUCTOS_HT !== 'undefined') {
        window.PRODUCTOS_HT = productosGuardados;
    }
});

// Exportar funciones globalmente
window.mostrarPanelProductos = mostrarPanelProductos;
window.crearProducto = crearProducto;
window.obtenerTodosLosProductos = obtenerTodosLosProductos;
window.obtenerProductoPorId = obtenerProductoPorId;
window.actualizarProducto = actualizarProducto;
window.eliminarProducto = eliminarProducto;
window.exportarProductos = exportarProductos;
window.importarProductos = importarProductos;
