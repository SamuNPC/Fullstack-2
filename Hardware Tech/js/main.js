(function ($) {
    "use strict";
    
    // Variables globales para el carrito
    let cart = [];
    let cartCount = 0;
    
    // Dropdown al pasar el ratón
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    // Funcionalidad del menú de categorías responsivo
    $(document).ready(function () {
        // Cerrar automáticamente otros submenús cuando se abre uno nuevo en móvil
        $('#mobile-cpu-submenu').on('show.bs.collapse', function () {
            // Aquí se pueden agregar más submenús si es necesario
        });
        
        // Mejorar la experiencia de navegación en móvil
        $('#mobile-categories').on('show.bs.collapse', function () {
            $(this).find('.card-body').addClass('show');
        });
        
        $('#mobile-categories').on('hide.bs.collapse', function () {
            // Cerrar todos los submenús cuando se cierra el menú principal
            $(this).find('.collapse').collapse('hide');
        });
        
        // Funcionalidad para el menú de categorías desktop
        if ($(window).width() > 992) {
            $('#navbar-vertical .nav-item.dropdown').hover(
                function() {
                    $(this).find('.dropdown-menu').stop(true, true).fadeIn(200);
                },
                function() {
                    $(this).find('.dropdown-menu').stop(true, true).fadeOut(200);
                }
            );
        }
        
        // Reajustar funcionalidad cuando cambia el tamaño de pantalla
        $(window).resize(function() {
            if ($(window).width() > 992) {
                // Cerrar menú móvil si está abierto
                $('#mobile-categories').collapse('hide');
                
                // Activar hover para desktop
                $('#navbar-vertical .nav-item.dropdown').hover(
                    function() {
                        $(this).find('.dropdown-menu').stop(true, true).fadeIn(200);
                    },
                    function() {
                        $(this).find('.dropdown-menu').stop(true, true).fadeOut(200);
                    }
                );
            } else {
                // Desactivar hover para móvil
                $('#navbar-vertical .nav-item.dropdown').off('mouseenter mouseleave');
            }
        });
    });
    
    // Funcionalidad del carrito de compras
    $(document).ready(function () {
        // Agregar productos al carrito
        $('.add-to-cart').on('click', function (e) {
            e.preventDefault();
            const productName = $(this).data('product');
            const productPrice = parseFloat($(this).data('price'));
            
            if (productName && productPrice) {
                addToCart(productName, productPrice);
                showCartMessage('Producto agregado al carrito', 'success');
            }
        });
        
        function addToCart(name, price) {
            const existingProduct = cart.find(item => item.name === name);
            
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }
            
            cartCount++;
            updateCartDisplay();
        }
        
        function updateCartDisplay() {
            $('#cart-count').text(cartCount);
        }
        
        function showCartMessage(message, type) {
            const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
            const messageHtml = `<div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            
            // Buscar un contenedor para mostrar el mensaje
            const container = $('.container-fluid').first();
            container.prepend(messageHtml);
            
            // Auto-ocultar después de 3 segundos
            setTimeout(function() {
                $('.alert').alert('close');
            }, 3000);
        }
    });
    
    // Validaciones de formularios con JavaScript personalizado
    $(document).ready(function () {
        
        // Validación del formulario de contacto
        $('#contactForm').on('submit', function (e) {
            e.preventDefault();
            
            let isValid = true;
            const form = this;
            
            // Limpiar errores previos
            clearFormErrors();
            
            // Validar nombre
            const name = $('#contactName').val().trim();
            if (!name) {
                showFieldError('nameError', 'El nombre es obligatorio');
                $('#contactName').addClass('is-invalid');
                isValid = false;
            } else if (name.length < 2) {
                showFieldError('nameError', 'El nombre debe tener al menos 2 caracteres');
                $('#contactName').addClass('is-invalid');
                isValid = false;
            } else {
                $('#contactName').addClass('is-valid');
            }
            
            // Validar email
            const email = $('#contactEmail').val().trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                showFieldError('emailError', 'El email es obligatorio');
                $('#contactEmail').addClass('is-invalid');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                showFieldError('emailError', 'Por favor ingresa un email válido');
                $('#contactEmail').addClass('is-invalid');
                isValid = false;
            } else {
                $('#contactEmail').addClass('is-valid');
            }
            
            // Validar teléfono (opcional pero si se ingresa debe ser válido)
            const phone = $('#contactPhone').val().trim();
            const phoneRegex = /^[0-9]{9,10}$/;
            if (phone && !phoneRegex.test(phone)) {
                showFieldError('phoneError', 'El teléfono debe tener 9-10 dígitos');
                $('#contactPhone').addClass('is-invalid');
                isValid = false;
            } else if (phone) {
                $('#contactPhone').addClass('is-valid');
            }
            
            // Validar asunto
            const subject = $('#contactSubject').val();
            if (!subject) {
                showFieldError('subjectError', 'Por favor selecciona un asunto');
                $('#contactSubject').addClass('is-invalid');
                isValid = false;
            } else {
                $('#contactSubject').addClass('is-valid');
            }
            
            // Validar mensaje
            const message = $('#contactMessage').val().trim();
            if (!message) {
                showFieldError('messageError', 'El mensaje es obligatorio');
                $('#contactMessage').addClass('is-invalid');
                isValid = false;
            } else if (message.length < 10) {
                showFieldError('messageError', 'El mensaje debe tener al menos 10 caracteres');
                $('#contactMessage').addClass('is-invalid');
                isValid = false;
            } else {
                $('#contactMessage').addClass('is-valid');
            }
            
            // Validar términos y condiciones
            if (!$('#acceptTerms').is(':checked')) {
                showFieldError('termsError', 'Debes aceptar los términos y condiciones');
                $('#acceptTerms').addClass('is-invalid');
                isValid = false;
            } else {
                $('#acceptTerms').addClass('is-valid');
            }
            
            if (isValid) {
                // Simular envío del formulario
                showFormMessage('formMessage', '¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
                form.reset();
                $('.form-control').removeClass('is-valid is-invalid');
            } else {
                showFormMessage('formMessage', 'Por favor corrige los errores en el formulario.', 'error');
            }
        });
        
        // Validación del formulario de newsletter
        $('#newsletterForm').on('submit', function (e) {
            e.preventDefault();
            
            const email = $('#newsletterEmail').val().trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // Limpiar errores previos
            $('#newsletterEmail').removeClass('is-invalid is-valid');
            $('#newsletterError').text('');
            
            if (!email) {
                $('#newsletterEmail').addClass('is-invalid');
                $('#newsletterError').text('El email es obligatorio').show();
            } else if (!emailRegex.test(email)) {
                $('#newsletterEmail').addClass('is-invalid');
                $('#newsletterError').text('Por favor ingresa un email válido').show();
            } else {
                $('#newsletterEmail').addClass('is-valid');
                showFormMessage('newsletterMessage', '¡Suscripción exitosa! Recibirás nuestras novedades.', 'success');
                this.reset();
                $('#newsletterEmail').removeClass('is-valid');
            }
        });
        
        // Validación en tiempo real del buscador
        $('#searchInput').on('input', function () {
            const query = $(this).val().trim();
            if (query.length > 0 && query.length < 3) {
                $(this).addClass('is-invalid');
                // Mostrar sugerencia de al menos 3 caracteres
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        
        // Funciones auxiliares para validación
        function clearFormErrors() {
            $('.form-control').removeClass('is-invalid is-valid');
            $('.invalid-feedback').text('');
        }
        
        function showFieldError(elementId, message) {
            $(`#${elementId}`).text(message).show();
        }
        
        function showFormMessage(elementId, message, type) {
            const className = type === 'success' ? 'alert-success' : 'alert-danger';
            const html = `<div class="alert ${className}" role="alert">${message}</div>`;
            $(`#${elementId}`).html(html);
        }
    });
    
    
    // Botón volver arriba
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Código de carruseles y control de cantidad eliminado por no utilizarse tras retirar detail.html y secciones relacionadas.
    
})(jQuery);

