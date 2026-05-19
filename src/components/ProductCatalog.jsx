import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductCatalog.css';
import { API_BASE } from '../utils/api';
import racketBanner from '../assets/racket.webp';
import shoesBanner from '../assets/shoes.webp';
import shuttleBanner from '../assets/shuttke.webp';

function ProductCatalog({ onCompare, onViewDetail }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [productType, setProductType] = useState(() => {
    const typeFromUrl = new URLSearchParams(window.location.search).get('type');
    return typeFromUrl === 'shuttles' ? 'shuttles' : typeFromUrl === 'shoes' ? 'shoes' : 'rackets';
  });
  
  const [playStyle] = useState({
    attack: false,
    control: false,
    balance: false
  });
  const [weightSpecFilter, setWeightSpecFilter] = useState('');
  const [balance, setBalance] = useState(300);
  const [price, setPrice] = useState(4000000);
  const [shoeColorFilter, setShoeColorFilter] = useState('All');
  const [shuttleSpeedFilter, setShuttleSpeedFilter] = useState('All');

  useEffect(() => {
    fetchProducts(productType);
  }, [productType]);

  useEffect(() => {
    const typeFromUrl = new URLSearchParams(location.search).get('type');
    const normalizedType = typeFromUrl === 'shuttles' ? 'shuttles' : typeFromUrl === 'shoes' ? 'shoes' : 'rackets';
    if (normalizedType !== productType) {
      setProductType(normalizedType);
    }
  }, [location.search, productType]);

  useEffect(() => {
    setActiveTab('All');
    setWeightSpecFilter('');
    setShoeColorFilter('All');
    setShuttleSpeedFilter('All');
  }, [productType]);

  const fetchProducts = async (type) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/products/${type}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      const mappedData = data.map((product, index) => ({
        ...product,
        id: product.id || index,
        hue: index * 40,
        tag: null,
      }));
      setProducts(mappedData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductTypeChange = (type) => {
    setProductType(type);
    navigate(`/catalog?type=${type}`, { replace: true });
  };

  const getUniqueSeries = () => {
    const series = new Set(products.map(p => p.series));
    return ['All', ...Array.from(series).sort()];
  };

        const parseBalance = (balanceStr) => {
          if (!balanceStr) return 0;
           const match = balanceStr.match(/(\d+)/);
           return match ? parseInt(match[1]) : 0;
         };
       
         const hasWeightSpec = (wsStr, spec) => {
           if (!wsStr || !spec) return true;
           const normalized = String(wsStr).toUpperCase().replace(/\s+/g, ' ');

           if (spec === '3U/G5') {
             return normalized.includes('3U/G5');
           }

           if (spec === '4U/G5') {
             return normalized.includes('4U/G5');
           }

           if (spec === '4U/G6') {
             return normalized.includes('4U/G6');
           }

           if (spec === '4U/G5-4U/G6') {
             return normalized.includes('4U/G5') || normalized.includes('4U/G6');
           }

           return true;
         };
       
         const getPlayStyle = (product) => {
           const bal = parseBalance(product.balance);
          if (bal >= 305) return 'attack';    
          if (bal <= 290) return 'control';   
           return 'balance';                   
         };
       
         const filterProducts = (() => {
           let filtered = activeTab === 'All'
             ? products
            : products.filter(p => p.series === activeTab);
       
          if (productType === 'rackets') {
            const activeStyles = Object.entries(playStyle).filter(([, v]) => v).map(([k]) => k);
             if (activeStyles.length > 0) {
              filtered = filtered.filter(p => activeStyles.includes(getPlayStyle(p)));
          }
      
            if (weightSpecFilter) {
              filtered = filtered.filter(p => hasWeightSpec(p['w/s'], weightSpecFilter));
            }
            filtered = filtered.filter(p => parseBalance(p.balance) >= balance);
    
            filtered = filtered.filter(p => Number(p.price) <= price);
          }

          if (productType === 'shoes') {
            filtered = filtered.filter(p => Number(p.price) <= price);
            if (shoeColorFilter !== 'All') {
              filtered = filtered.filter(p => p.colors && p.colors.includes(shoeColorFilter));
            }
          }

          if (productType === 'shuttles') {
            if (shuttleSpeedFilter !== 'All') {
              filtered = filtered.filter(p => String(p.speed) === shuttleSpeedFilter);
            }
          }
      
          return filtered;
  })();


  const getSpecValue = (product, field) => {
    if (productType === 'rackets') {
      switch(field) {
        case 'spec1': return product['w/s'] || '-';
        case 'spec2': return product.balance || '-';
        case 'spec3': return product.lbs || '-';
        default: return '-';
      }
    } else if (productType === 'shuttles') {
      switch(field) {
        case 'spec1': return product.type || '-';
        case 'spec2': return product.speed || '-';
        case 'spec3': return product.unit || '-';
        default: return '-';
      }
    } else if (productType === 'shoes') {
      switch(field) {
        case 'spec1': return product.outsole || '-';
        case 'spec2': return product.upper || '-';
        case 'spec3': return product.size || '-';
        default: return '-';
      }
    }
  };

  const getSpecLabel = (field) => {
    if (productType === 'rackets') {
      switch(field) {
        case 'spec1': return 'Weight';
        case 'spec2': return 'Balance';
        case 'spec3': return 'LBS';
        default: return '';
      }
    } else if (productType === 'shuttles') {
      switch(field) {
        case 'spec1': return 'Type';
        case 'spec2': return 'Speed';
        case 'spec3': return 'Unit';
        default: return '';
      }
    } else if (productType === 'shoes') {
      switch(field) {
        case 'spec1': return 'Outsole';
        case 'spec2': return 'Upper';
        case 'spec3': return 'Size';
        default: return '';
      }
    }
  };

  const getUniqueShoeColors = () => {
    const colorSet = new Set();
    products.forEach(p => (p.colors || []).forEach(c => colorSet.add(c)));
    return ['All', ...Array.from(colorSet).sort()];
  };

  if (loading) {
    return (
      <section id="product-catalog" className="product-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">CATALOG</span>
            <h2>Product Catalog</h2>
            <p>Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="product-catalog" className="product-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">CATALOG</span>
            <h2>Product Catalog</h2>
            <p style={{ color: 'red' }}>Error loading products: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="catalog-section">
      <div className="container">
        <div className="catalog-header">
          <img
            src={productType === 'rackets' ? racketBanner : productType === 'shuttles' ? shuttleBanner : shoesBanner}
            alt={productType === 'rackets' ? 'Lựa chọn vợt phù hợp nhất' : productType === 'shuttles' ? 'Lựa chọn cầu phù hợp nhất' : 'Lựa chọn giày phù hợp nhất'}
            className="catalog-header-banner"
          />
        </div>

        <div className="catalog-wrapper">
          <div className="catalog-sidebar">
            <div className="filter-panel">
              <div className="filter-title">
                {productType === 'rackets' ? 'RACKET FILTER' : productType === 'shuttles' ? 'SHUTTLE FILTER' : 'SHOES FILTER'}
              </div>

              {productType === 'rackets' && (
                <>
                  <div className="filter-group">
                    <div className="filter-group-title">Trọng lượng</div>
                    <div className="weight-option-group">
                      <button
                        type="button"
                        className={`weight-option-btn ${weightSpecFilter === '3U/G5' ? 'active' : ''}`}
                        onClick={() => setWeightSpecFilter(prev => prev === '3U/G5' ? '' : '3U/G5')}
                      >
                        3U/G5
                      </button>
                      <button
                        type="button"
                        className={`weight-option-btn ${weightSpecFilter === '4U/G5' ? 'active' : ''}`}
                        onClick={() => setWeightSpecFilter(prev => prev === '4U/G5' ? '' : '4U/G5')}
                      >
                        4U/G5
                      </button>
                      <button
                        type="button"
                        className={`weight-option-btn ${weightSpecFilter === '4U/G6' ? 'active' : ''}`}
                        onClick={() => setWeightSpecFilter(prev => prev === '4U/G6' ? '' : '4U/G6')}
                      >
                        4U/G6
                      </button>
                    </div>
                  </div>
                  <div className="filter-group">
                    <div className="slider-group">
                      <div className="slider-label slider-label-stack">
                        <span className="slider-label-text">Điểm Cân Bằng</span>
                        <span className="slider-value slider-value-block">{balance}</span>
                      </div>
                      <input 
                        type="range" 
                        min="280" 
                        max="310" 
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                      />
                      <div className="slider-markers">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {productType === 'shuttles' && (
                <div className="filter-group">
                  <div className="filter-group-title">Tốc độ cầu</div>
                  <div className="shoe-color-filter">
                    {['All', '75', '76', '77', '78'].map(speed => (
                      <button
                        key={speed}
                        className={`color-filter-btn ${shuttleSpeedFilter === speed ? 'active' : ''}`}
                        onClick={() => setShuttleSpeedFilter(speed)}
                      >
                        {speed === 'All' ? 'Tất cả' : speed}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {productType === 'shoes' && (
                <div className="filter-group">
                  <div className="filter-group-title">Màu sắc</div>
                  <div className="shoe-color-filter">
                    {getUniqueShoeColors().map(color => (
                      <button
                        key={color}
                        className={`color-filter-btn ${shoeColorFilter === color ? 'active' : ''}`}
                        onClick={() => setShoeColorFilter(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(productType === 'rackets' || productType === 'shoes') && (
              <div className="filter-group">
                <div className="slider-group">
                  <div className="slider-label slider-label-stack">
                    <span className="slider-label-text">Giá</span>
                    <span className="slider-value slider-value-block">
                      {price.toLocaleString()} VND
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="100000" 
                    max="6000000" 
                    step="50000"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                  <div className="slider-markers">
                    <span>Cheap</span>  
                    <span>Mid</span>
                    <span>Premium</span>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="catalog-main">
            {/* Product Type Selector */}
            <div className="catalog-type-tabs">
              <button 
                className={`type-tab ${productType === 'rackets' ? 'active' : ''}`}
                onClick={() => handleProductTypeChange('rackets')}
              >
                Vợt Cầu Lông
              </button>
              <button 
                className={`type-tab ${productType === 'shuttles' ? 'active' : ''}`}
                onClick={() => handleProductTypeChange('shuttles')}
              >
                Quả Cầu Lông
              </button>
              <button 
                className={`type-tab ${productType === 'shoes' ? 'active' : ''}`}
                onClick={() => handleProductTypeChange('shoes')}
              >
                Giày Cầu Lông
              </button>
            </div>

            {/* Series Filter */}
            <div className="catalog-filters">
              {getUniqueSeries().map(cat => (
                <button 
                  key={cat} 
                  className={`filter-btn ${activeTab === cat ? 'active' : ''}`}
                  onClick={() => setActiveTab(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="catalog-grid">
              {filterProducts.map(product => (
                <div 
                  key={product.id} 
                  className="product-card"
                  onClick={() => onViewDetail(product, productType)}
                  style={{ cursor: 'pointer' }}
                >
                  {product.tag && <div className="product-tag">{product.tag}</div>}
                  <div className="product-image-wrapper">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="product-img-render" 
                      style={{ filter: `drop-shadow(0 10px 15px rgba(0,0,0,0.1))` }}
                    />
                  </div>
                  <div className="product-info">
                    <span className="series-label">VICTOR</span>
                    <h3>{product.name}</h3>
                    <div className="specs-grid">
                      <div className="spec-item">
                        <span className="spec-label">
                          <span className="spec-icon">📦</span>
                          {getSpecLabel('spec1')}
                        </span>
                        <span className="spec-value">{getSpecValue(product, 'spec1')}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">
                          <span className="spec-icon">⚡</span>
                          {getSpecLabel('spec2')}
                        </span>
                        <span className="spec-value">{getSpecValue(product, 'spec2')}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">
                          <span className="spec-icon">💪</span>
                          {getSpecLabel('spec3')}
                        </span>
                        <span className="spec-value">{getSpecValue(product, 'spec3')}</span>
                      </div>
                    </div>
                    <div className="product-price">
                      {product.price 
                        ? `${Number(product.price).toLocaleString('vi-VN')} VND`
                        : '-'
                      }
                    </div>
                    <div className="product-actions">
                      <button 
                        className="compare-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompare(product);
                        }}
                      >
                        <span>COMPARE</span>
                      </button>
                      <button 
                        className="cart-icon-btn" 
                        title="Add to cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`${product.name} đã được thêm vào giỏ hàng!`);
                        }}
                      >
                        <span>🛒</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductCatalog;
