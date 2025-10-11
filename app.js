document.addEventListener('DOMContentLoaded', () => {
    // Отримуємо посилання на всі навігаційні елементи
    const navLinks = [
        { id: 'nav-wishlist', url: 'wishlist.html' },
        { id: 'nav-catalog', url: 'catalog.html' },
        { id: 'nav-cart', url: 'cart.html' },
        { id: 'nav-login', url: 'login.html' }
    ];

    navLinks.forEach(linkInfo => {
        const element = document.getElementById(linkInfo.id);
        
        if (element) {
            // Додаємо обробник подій для перенаправлення
            element.addEventListener('click', (event) => {
                // Запобігаємо стандартній дії посилання
                event.preventDefault(); 
                
                // Здійснюємо програмний перехід
                window.location.href = linkInfo.url;
            });
            
            // Додатково: підсвічуємо активну сторінку 
            // Це робиться шляхом порівняння URL посилання з поточним URL
            const currentPath = window.location.pathname.split('/').pop();

            if (currentPath === linkInfo.url) {
                // Додаємо клас, який стилізує активний елемент (ви маєте додати цей клас у CSS)
                element.classList.add('active-nav-link');
            }
        }
    });
});

/* Не забудьте додати стиль для активного посилання у styles.css, наприклад:
   .active-nav-link {
       color: var(--accent-color) !important;
       border-bottom: 2px solid var(--accent-color);
   }
*/
