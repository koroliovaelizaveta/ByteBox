document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------
    // I. ФУНКЦІЇ РОБОТИ З LOCALSTORAGE
    // --------------------------------------------------------

    const getSavedState = () => {
        const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
        const wish = JSON.parse(localStorage.getItem('wishItems')) || [];
        return { cart, wish };
    };

    const saveState = ({ cart, wish }) => {
        if (cart !== undefined) localStorage.setItem('cartItems', JSON.stringify(cart));
        if (wish !== undefined) localStorage.setItem('wishItems', JSON.stringify(wish));
    };

    // --------------------------------------------------------
    // II. НАВІГАЦІЯ ТА ЛОГОТИП
    // --------------------------------------------------------
    
    // (Логіка навігації та підсвічування тут пропущена для стислості, оскільки вона вже працює)

    document.querySelectorAll('.logo').forEach(logo => {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    });

    // --------------------------------------------------------
    // III. ЛОГІКА ТОВАРІВ ЗІ ЗБЕРІГАННЯМ СТАНУ
    // --------------------------------------------------------
    
    const removeCard = (productCard, message) => {
        productCard.style.opacity = '0';
        setTimeout(() => productCard.remove(), 300);
        if (message) alert(message);
    };

    // Функція, що повертає нормалізований ID товару (назва)
    const getProductID = (card) => {
        // Видаляємо пробіли та переводимо у нижній регістр для надійності
        return card.querySelector('.product-title').textContent.trim().toLowerCase();
    };
    
    // 1. Додавання/Видалення зі списку бажань (Лайки)
    document.querySelectorAll('.icon-heart').forEach(heartIcon => {
        heartIcon.addEventListener('click', (event) => {
            event.preventDefault();
            
            const productCard = heartIcon.closest('.product-card');
            const productID = getProductID(productCard);
            const productTitle = productCard.querySelector('.product-title').textContent.trim(); // Для повідомлення

            let { wish } = getSavedState();

            if (heartIcon.classList.contains('far')) {
                // ДОДАВАННЯ:
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                if (!wish.includes(productID)) wish.push(productID);
                alert(`"${productTitle}" додано до списку бажань! ❤️`);
            } else {
                // ВИДАЛЕННЯ:
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                wish = wish.filter(id => id !== productID); // Видаляємо зі сховища
                
                if (window.location.pathname.includes('wish.html')) {
                    removeCard(productCard, `"${productTitle}" видалено зі списку бажань. 💔`);
                } else {
                    alert(`"${productTitle}" видалено зі списку бажань. 💔`);
                }
            }
            saveState({ wish }); 
        });
    });

    // 2. Додавання товару до кошика (КНОПКА "до кошику")
    document.querySelectorAll('.btn-card:not(.btn-delete-cart)').forEach(cartButton => {
        cartButton.addEventListener('click', () => {
            const productCard = cartButton.closest('.product-card');
            const productID = getProductID(productCard);
            const productTitle = productCard.querySelector('.product-title').textContent.trim();
            
            let { cart } = getSavedState();
            if (!cart.includes(productID)) {
                cart.push(productID);
                saveState({ cart });
                alert(`"${productTitle}" додано до кошика! 🛒`);
            } else {
                alert(`"${productTitle}" ВЖЕ у кошику!`);
            }
        });
    });

    // 3. Видалення товару з кошика (КНОПКА "видалити" на card.html)
    document.querySelectorAll('.btn-delete-cart').forEach(deleteButton => {
        deleteButton.addEventListener('click', () => {
            const productCard = deleteButton.closest('.product-card');
            const productID = getProductID(productCard);
            const productTitle = productCard.querySelector('.product-title').textContent.trim();
            
            let { cart } = getSavedState();
            cart = cart.filter(id => id !== productID);
            saveState({ cart }); 

            if (confirm(`Ви впевнені, що хочете видалити "${productTitle}" з кошика?`)) {
                removeCard(productCard, `"${productTitle}" видалено з кошика. 🗑️`);
            }
        });
    });

    // 4. Оформлення замовлення (імітація)
    document.querySelectorAll('.btn-pay').forEach(payButton => {
        payButton.addEventListener('click', () => {
            alert('✅ Замовлення успішно оформлено! Кошик очищено.');
            saveState({ cart: [] }); 
            if (window.location.pathname.includes('card.html')) {
                document.querySelectorAll('.product-card').forEach(card => removeCard(card, null));
            }
        });
    });

    // --------------------------------------------------------
    // IV. ЗАВАНТАЖЕННЯ ТА ФІЛЬТРАЦІЯ СТАНУ ПРИ ЗАПУСКУ СТОРІНКИ
    // --------------------------------------------------------
    
    const loadState = () => {
        const { cart, wish } = getSavedState();
        const currentPage = window.location.pathname.split('/').pop();
        
        document.querySelectorAll('.product-card').forEach(card => {
            const productID = getProductID(card); // Нормалізований ID
            const heartIcon = card.querySelector('.icon-heart');
            
            // 1. Оновлення стану лайків на всіх сторінках
            if (wish.includes(productID)) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
            }

            // 2. ФІЛЬТРАЦІЯ: Видалення hardcoded карток, яких немає у LocalStorage
            if (currentPage.includes('card.html') && !cart.includes(productID)) {
                card.remove(); // ВИДАЛЯЄМО ЗІ СТОРІНКИ КОШИКА
            } else if (currentPage.includes('wish.html') && !wish.includes(productID)) {
                card.remove(); // ВИДАЛЯЄМО ЗІ СТОРІНКИ СПИСКУ БАЖАНЬ
            }
        });
    };

    loadState();
});
