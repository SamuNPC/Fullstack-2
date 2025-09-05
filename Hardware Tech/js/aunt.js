// Función para obtener usuario actual
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

// Función para actualizar navegación según estado del usuario
function updateNavigation() {
    const currentUser = getCurrentUser();
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const userWelcome = document.getElementById('userWelcome');
    const adminPanel = document.getElementById('adminPanel');
    const logoutLink = document.getElementById('logoutLink');

    if (currentUser) {
        // Usuario logueado - ocultar login/register, mostrar opciones de usuario
        loginLink.classList.add('d-none');
        registerLink.classList.add('d-none');
        
        userWelcome.classList.remove('d-none');
        userWelcome.textContent = `Hola, ${currentUser.firstName}`;
        userWelcome.title = `${currentUser.firstName} ${currentUser.lastName} (${currentUser.email})`;
        
        logoutLink.classList.remove('d-none');

        // Mostrar panel de admin solo si es administrador
        if (currentUser.isAdmin) {
            adminPanel.classList.remove('d-none');
            userWelcome.innerHTML = `<i class="fas fa-crown mr-1 text-warning"></i>Hola, ${currentUser.firstName}`;
        } else {
            adminPanel.classList.add('d-none');
        }
    } else {
        // Usuario no logueado - mostrar login/register, ocultar opciones de usuario
        loginLink.classList.remove('d-none');
        registerLink.classList.remove('d-none');
        
        userWelcome.classList.add('d-none');
        adminPanel.classList.add('d-none');
        logoutLink.classList.add('d-none');
    }
}

// Función para cerrar sesión
function logoutUser() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        alert('Has cerrado sesión exitosamente.');
        updateNavigation();
    }
}

// Inicializar la navegación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    
    // Agregar clase de admin al body si es administrador
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.isAdmin) {
        document.body.classList.add('admin-user');
        console.log('Modo administrador activado para:', currentUser.email);
    }
});
