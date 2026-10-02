import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/products');

        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить товары. Проверьте, запущен ли json-server.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const handleAddToCart = () => {
    setCartCount(cartCount + 1);
  };

  // Фильтрация товаров без учёта регистра
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="catalog" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🌾 АгроМаркет</h1>
        <div className="cart" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          🛒 Корзина: <span>{cartCount}</span>
        </div>
      </header>

      <h2>Каталог</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Поиск товара..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px 12px', width: '100%', maxWidth: '300px', fontSize: '1rem' }}
        />
      </div>

      {loading && <p>Загрузка товаров...</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {!loading && !error && (
        <div className="products-grid" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={handleAddToCart}
              />
            ))
          ) : (
            <p>Товары не найдены</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;