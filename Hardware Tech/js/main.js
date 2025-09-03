(function ($) {
    "use strict";
    
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
        $('#mobile-ropa-submenu').on('show.bs.collapse', function () {
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


    // Carrusel de vendedores
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:5
            },
            1200:{
                items:6
            }
        }
    });


    // Carrusel relacionado
    $('.related-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Cantidad de producto
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });
    
})(jQuery);

