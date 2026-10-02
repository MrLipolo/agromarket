let cartCount = 0;

async function loadProducts() {
  const catalog = document.querySelector('.catalog');

  try {
    const response = await fetch('http://localhost:3001/products');

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    catalog.innerHTML = `
      <h2>Каталог</h2>
      <p style="color: red; font-weight: bold;">
        ⚠️ Ошибка загрузки товаров. Проверьте, запущен ли json-server на порту 3001.
      </p>
    `;
    console.error('Ошибка при запросе данных:', error);
  }
}

function renderProducts(products) {
  const catalog = document.querySelector('.catalog');

  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.price} тг</p>
      <button class="add-btn">В корзину</button>
    `;

    // Обработчик добавления в корзину для конкретной кнопки
    const button = card.querySelector('.add-btn');
    button.addEventListener('click', () => {
      cartCount++;
      const cartCountElement = document.getElementById('cart-count');
      if (cartCountElement) {
        cartCountElement.textContent = cartCount;
      }
    });

    catalog.appendChild(card);
  });
}

loadProducts();