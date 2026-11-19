import { useState, useEffect } from 'react';
import { apiFetch } from './api.js';
import LoginForm from './components/LoginForm.jsx';
import AddProductForm from './components/AddProductForm.jsx';
import ProductCard from './components/ProductCard.jsx';
import ContactForm from './components/ContactForm.jsx';

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  // Загрузка товаров и проверка токена при запуске приложения
  useEffect(() => {
    // 1. Загружаем каталог товаров из API
    apiFetch('/products')
      .then((data) => setProducts(data))
      .catch((err) => console.error('Ошибка загрузки товаров:', err));

    // 2. Проверяем валидность сохраненного токена
    if (localStorage.getItem('token')) {
      apiFetch('/auth/me')
        .then((userData) => setUser(userData))
        .catch(() => {
          // Если токен недействителен, apiFetch сам очистит localStorage
        });
    }
  }, []);

  function handleLogin(user, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  // Фильтрация товаров по поисковому запросу
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1>🌾 АгроМаркет</h1>
          <div className="auth-bar">
            {user ? (
              <div className="user-info">
                <span>Вы вошли как <b>{user.name}</b> ({user.role})</span>{' '}
                <button onClick={handleLogout} className="btn-logout">Выйти</button>
              </div>
            ) : (
              <LoginForm onLogin={handleLogin} />
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Поиск по каталогу */}
        <section className="search-section">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </section>

        {/* Форма добавления товара (только для Администратора) */}
        {user?.role === 'admin' && (
          <section className="admin-section">
            <AddProductForm onAdded={(newProduct) => setProducts([...products, newProduct])} />
          </section>
        )}

        {/* Каталог продукции */}
        <section className="catalog-section">
          <h2>Каталог продукции</h2>
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
          {filteredProducts.length === 0 && <p>Товары не найдены</p>}
        </section>

        {/* Форма заявки */}
        <section className="order-section">
          <h2>Оформить заявку</h2>
          <ContactForm selectedProduct={selectedProduct} />
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 АгроМаркет — Поставки сельхозпродукции</p>
      </footer>
    </div>
  );
}