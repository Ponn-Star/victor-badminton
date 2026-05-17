import { useState, useEffect } from 'react';
import './SearchModal.css';
import { API_BASE } from '../utils/api';

function SearchModal({ isOpen, onClose, onViewDetail }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      try {
        const [racketsResponse, shuttlesResponse] = await Promise.all([
          fetch(`${API_BASE}/api/products/rackets`),
          fetch(`${API_BASE}/api/products/shuttles`)
        ]);

        const racketsData = (await racketsResponse.json()) || [];
        const shuttlesData = (await shuttlesResponse.json()) || [];

        const allProducts = [
          ...racketsData.map(p => ({ ...p, productType: 'rackets' })),
          ...shuttlesData.map(p => ({ ...p, productType: 'shuttles' }))
        ];

        const filtered = allProducts.filter(product =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.series?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setResults(filtered);
      } catch (err) {
        console.error('Error searching products:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleResultClick = (product) => {
    onViewDetail(product, product.productType);
    onClose();
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <h2>Tìm kiếm sản phẩm</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="search-modal-body">
          <input
            type="text"
            className="search-input"
            placeholder="Nhập tên sản phẩm hoặc dòng sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />

          <div className="search-results">
            {loading && <p className="search-loading">Đang tìm kiếm...</p>}

            {!loading && searchTerm && results.length === 0 && (
              <p className="search-no-results">Không tìm thấy sản phẩm nào</p>
            )}

            {!loading && searchTerm && results.length > 0 && (
              <>
                <p className="search-count">Tìm thấy {results.length} sản phẩm</p>
                <div className="search-results-list">
                  {results.map(product => (
                    <div
                      key={`${product.id}-${product.productType}`}
                      className="search-result-item"
                      onClick={() => handleResultClick(product)}
                    >
                      <div className="result-image">
                        <img src={product.img} alt={product.name} />
                      </div>
                      <div className="result-info">
                        <div className="result-name">{product.name}</div>
                        <div className="result-series">
                          {product.series} • {product.productType === 'rackets' ? '🎾 Vợt' : '🏸 Cầu'}
                        </div>
                        {product.price && (
                          <div className="result-price">
                            {Number(product.price).toLocaleString('vi-VN')} VND
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!searchTerm && (
              <p className="search-placeholder">Nhập từ khóa để tìm sản phẩm</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
