    // Declaración de variables clave
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // VARIABLES GLOBALES PARA EL CARRITO
    let cart = [];
    const cartCounter = document.getElementById('cart-counter');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalDisplay = document.getElementById('cartTotal');
    const emptyMessage = document.getElementById('emptyMessage');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // NUEVAS VARIABLES PARA EL LOGIN Y CAMBIO DE CONTRASEÑA
    const userIcon = document.getElementById('userIcon');
    const loginModal = document.getElementById('loginModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');

    // Usuario simulado para la prueba:
    const VALID_EMAIL = "test@galiz.ba";
    const VALID_PASSWORD = "password123";

    // ----------------------------------------------------
    // 1. Funcionalidad del Loader (simulación)
    // ----------------------------------------------------
    window.addEventListener('load', function () {
        const loader = document.querySelector('.loader');
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500);
    });

    // ----------------------------------------------------
    // 2. Funcionalidad de Toggle General (Menú, Carrito y Modal)
    // ----------------------------------------------------

    // Función para cerrar cualquier sidebar abierta y el modal de login
    function closeAllSidebars() {
        sideMenu.classList.remove('active');
        cartSidebar.classList.remove('active');
        menuOverlay.classList.remove('active');

        if (loginModal.style.display === 'flex') {
            loginModal.style.display = 'none';
        }

        document.body.style.overflow = 'auto';
    }

    // Manejador para el overlay (cierra al tocar afuera)
    menuOverlay.addEventListener('click', closeAllSidebars);

    // ----------------------------------------------------
    // 3. Funcionalidad del Menú Lateral
    // ----------------------------------------------------
    menuToggle.addEventListener('click', function () {
        closeAllSidebars();
        sideMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeMenuBtn.addEventListener('click', closeAllSidebars);

    // ----------------------------------------------------
    // 4. Funcionalidad del Carrito Lateral (Despliegue)
    // ----------------------------------------------------
    cartIcon.addEventListener('click', function () {
        closeAllSidebars();
        cartSidebar.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeCartBtn.addEventListener('click', closeAllSidebars);

    // ----------------------------------------------------
    // 5. Funcionalidad del Modal de Login
    // ----------------------------------------------------
    userIcon.addEventListener('click', function () {
        closeAllSidebars();
        loginModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Asegura que el formulario esté visible y limpio al abrir
        loginMessage.textContent = '';
        loginForm.style.display = 'block';
        loginEmail.value = '';
        loginPassword.value = '';
    });

    function closeLoginModal() {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeModalBtn.addEventListener('click', closeLoginModal);

    window.addEventListener('click', function (event) {
        if (event.target === loginModal) {
            closeLoginModal();
        }
    });

    // ----------------------------------------------------
    // 6. Lógica de Simulación de Inicio de Sesión
    // ----------------------------------------------------
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = loginEmail.value;
        const password = loginPassword.value;

        loginMessage.classList.remove('success', 'error');

        if (email === VALID_EMAIL && password === VALID_PASSWORD) {
            loginMessage.textContent = "✅ ¡Inicio de sesión exitoso!";
            loginMessage.classList.add('success');

            setTimeout(() => {
                closeLoginModal();
                alert(`Bienvenido/a, ${email}!`);
            }, 1500);

        } else {
            loginMessage.textContent = "❌ Email o contraseña incorrectos. Intenta con test@galiz.ba y password123.";
            loginMessage.classList.add('error');
        }
    });

    // ----------------------------------------------------
    // 7. Lógica de Simulación de CAMBIO DE CONTRASEÑA
    // ----------------------------------------------------
    forgotPasswordLink.addEventListener('click', function (event) {
        event.preventDefault();

        // 1. Ocultar el formulario de Login y mostrar un mensaje
        loginForm.style.display = 'none';

        loginMessage.classList.remove('success', 'error');
        loginMessage.textContent = '';

        // 2. Simular el envío del email de restablecimiento
        alert(
            "En un sitio terminado, ahora te pediríamos tu email para mandarte link de restablecimiento. Esto es una demostracion y una prueba xd"
        );

        const resetMessage =
            "Se ha enviado un enlace de restablecimiento a tu correo electrónico. Por favor, revisa tu bandeja de entrada.";
        loginMessage.textContent = resetMessage;
        loginMessage.classList.add('success');

        // 3. Volver a mostrar el formulario de login después de 3 segundos
        setTimeout(() => {
            loginMessage.textContent = '';
            loginMessage.classList.remove('success');
            loginForm.style.display = 'block';
        }, 3000);
    });


    // ----------------------------------------------------
    // FUNCIONES DE MANEJO DEL CARRITO (Lógica)
    // ----------------------------------------------------

    // Función auxiliar para parsear el precio (Ej. "$10.000,00" a 10000)
    function parsePrice(priceText) {
        if (!priceText) return 0;
        return parseFloat(priceText.replace('$', '').replace(/\./g, '').replace(',', '.'));
    }

    // Función para formatear el precio a la vista (X.XXX,XX)
    function formatPrice(price) {
        return price.toFixed(2).replace('.', 'TEMP').replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace('TEMP', ',');
    }


    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const itemHTML = `
							<div class="cart-item" data-index="${index}">
								<div class="cart-item-img">
									<img src="${item.imageSrc}" alt="${item.name}">
								</div>
								<div class="cart-item-info">
									<p>${item.name}</p>
									<span>$${formatPrice(item.price)} x ${item.quantity}</span>
								</div>
								<button class="remove-item-btn" data-index="${index}" aria-label="Eliminar producto">
									<i class="fas fa-trash-alt"></i>
								</button>
							</div>
						`;
                cartItemsContainer.innerHTML += itemHTML;
            });

            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', removeItem);
            });
        }

        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = itemCount;
        cartTotalDisplay.textContent = formatPrice(total);
    }

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        renderCart();
    }

    function removeItem(event) {
        const index = event.currentTarget.getAttribute('data-index');
        cart.splice(index, 1);
        renderCart();
    }


    // ----------------------------------------------------
    // 8. Funcionalidad Agregar al Carrito (Evento de Botones)
    // ----------------------------------------------------
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            const itemElement = this.closest('.producto-item');
            const name = this.getAttribute('data-product-name');
            const newPriceText = itemElement.querySelector('.price-new').textContent;
            const imageSrc = itemElement.querySelector('.producto-img .front').getAttribute('src');
            const price = parsePrice(newPriceText);

            const id = name.toLowerCase().replace(/[^a-z0-9]/g, '');

            const newProduct = {
                id: id,
                name: name,
                price: price,
                imageSrc: imageSrc
            };

            addToCart(newProduct);
            cartIcon.classList.add('animate');

            if (!cartSidebar.classList.contains('active')) {
                closeAllSidebars();
                cartSidebar.classList.add('active');
                menuOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            setTimeout(() => {
                cartIcon.classList.remove('animate');
            }, 500);
        });
    });

    // ----------------------------------------------------
    // 9. Funcionalidad del Botón Finalizar Compra
    // ----------------------------------------------------
    checkoutBtn.addEventListener('click', function (event) {
        event.preventDefault();

        if (cart.length === 0) {
            alert("¡Tu carrito está vacío! Agrega productos antes de finalizar la compra.");
        } else {
            const total = cartTotalDisplay.textContent;
            alert(
                `¡Gracias por tu compra!\n\nSe ha procesado un total de $${total}.\n\n(En un sitio real, esto te llevaría a una página de pago/checkout.)`
            );

            cart = [];
            closeAllSidebars();
            renderCart();
        }
    });

    // Inicializar el carrito al cargar la página (para mostrar el contador en 0)
    renderCart();