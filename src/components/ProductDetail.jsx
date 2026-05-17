import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './ProductDetail.css';

function ProductDetail({ product: propProduct, productType: propProductType, onCompare }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const typeFromUrl = new URLSearchParams(location.search).get('type');
  const nameFromUrl = new URLSearchParams(location.search).get('name');
  const [product, setProduct] = useState(propProduct);
  const [productType, setProductType] = useState(propProductType || typeFromUrl || 'rackets');
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(!propProduct);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const knownType = typeFromUrl || propProductType;
      const baseOrder = ['rackets', 'shuttles', 'shoes'];
      const order = knownType
        ? [knownType, ...baseOrder.filter(type => type !== knownType)]
        : baseOrder;

      const normalize = (value = '') => String(value)
        .trim()
        .toLowerCase();
      const normalizedNameFromUrl = normalize(nameFromUrl);

      for (const type of order) {
        const response = await fetch(`/api/products/${type}`);
        if (response.ok) {
          const data = await response.json();
          const found = data.find((p) => {
            const routeId = String(productId || '');
            const matchesId = [p.id, p._id].some((candidateId) => String(candidateId || '') === routeId);
            const matchesName = normalizedNameFromUrl && normalize(p.name) === normalizedNameFromUrl;
            return matchesId || matchesName;
          });
          if (found) {
            setProduct(found);
            setProductType(type);
            return;
          }
        }
      }
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, [productId, typeFromUrl, propProductType, nameFromUrl]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    if (propProduct) {
      setProduct(propProduct);
    } else if (productId) {
      fetchProduct();
    }
  }, [productId, propProduct, fetchProduct]);

  useEffect(() => {
    setSelectedImage(null);
    setSelectedColor(null);
  }, [product]);

  const handleWhereToBuy = () => {
    alert('Tính năng tìm nơi mua sắp có sẵn!');
  };

  if (loading) {
    return (
      <section className="product-detail-section">
        <div className="detail-container">
          <p>Loading product...</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="product-detail-section">
        <div className="detail-container">
          <p>Product not found</p>
          <button onClick={() => navigate('/catalog')}>Back to Catalog</button>
        </div>
      </section>
    );
  }

  const isRacket = productType === 'rackets';
  const isShuttle = productType === 'shuttles';
  const isShoe = productType === 'shoes';
  const displayThumbnails = (isRacket || isShoe)
    ? (product.thumbnails || [product.img])
    : [product.img];
  const mainImage = selectedImage || product.img;

  return (
    <section className="product-detail-section">
      <div className="detail-container">
        <div className="detail-wrapper">
          <div className="detail-images">
            <div className="main-image">
              <img 
                src={mainImage} 
                alt={product.name}
              />
            </div>
            <div className={`image-thumbnails ${(isRacket || isShoe) ? '' : 'single-thumbnail'}`}>
              {displayThumbnails.map((thumb, i) => (
                <div
                  key={i}
                  className={`thumbnail ${mainImage === thumb ? 'active' : ''}`}
                  onClick={() => setSelectedImage(thumb)}
                >
                  <img 
                    src={thumb} 
                    alt={`Ảnh sản phẩm ${i + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="detail-info">
            {/* Header */}
            <div className="detail-header">
              <span className="status-badge">2026 NEW</span>
              <h1 className="product-name">{product.name}</h1>
              <p className="product-sku">SKU: {product.SKU || product.sku || product.code || 'N/A'}</p>
            </div>

            {/* Price */}
            <div className="detail-price">
              <h2>{Number(product.price).toLocaleString('vi-VN')} VND</h2>
            </div>

            {/* Description */}
            <div className="product-description">
              <p>
                {isRacket
                  ? `Vợt badminton độc đáo của VICTOR kết hợp tính đàn hồi cao với góc đánh mạnh. Nó mang lại cảm giác đánh mạnh, mà không cảm được sức mạnh với xử lý nhanh, lý tưởng cho các cầu thủ xuất sắc với tốc độ.`
                  : isShoe
                  ? `Giày cầu lông VICTOR được thiết kế chuyên biệt, tối ưu hiệu suất di chuyển và độ bám sân, mang lại sự thoải mái và bảo vệ tốt nhất cho người chơi.`
                  : `Sản phẩm chất lượng cao từ VICTOR, được thiết kế để mang lại hiệu suất tối ưu và độ bền vượt trội.`
                }
              </p>
            </div>

            {/* Color selector for shoes */}
            {isShoe && product.colors && product.colors.length > 1 && (
              <div className="shoe-color-selector">
                <div className="color-selector-label">Màu sắc:</div>
                <div className="color-selector-options">
                  {product.colors.map((color, i) => (
                    <span
                      key={i}
                      className={`color-tag ${selectedColor === color ? 'selected' : ''}`}
                      onClick={() => setSelectedColor(color === selectedColor ? null : color)}
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-actions">
              <button className="where-to-buy-btn" onClick={handleWhereToBuy}>
                NƠI MUA
              </button>
              <button 
                className="compare-btn-icon" 
                onClick={() => onCompare(product)}
                title="Thêm vào so sánh"
              >
                ⚖️
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Specs Tabs */}
        <div className="detail-tabs">
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              CHI TIẾT SẢN PHẨM
            </button>
            <button 
              className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              THÔNG SỐ KỸ THUẬT
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'details' && (
              <div className="tab-pane">
                <h3>Đặc điểm sản phẩm</h3>
                {productType === 'rackets' ? (
                  <div className="materials-info">
                    <div className="material-section">
                      <h4>Vợt (Head Material)</h4>
                      <p>{product.fm || 'Chưa có thông tin'}</p>
                    </div>
                    <div className="material-section">
                      <h4>Cán (Shaft Material)</h4>
                      <p>{product.sm || 'Chưa có thông tin'}</p>
                    </div>
                  </div>
                ) : isShuttle ? (
                  <div className="materials-info">
                    <div className="material-section">
                      <h4>Type</h4>
                      <p>{product.type || 'Chưa có thông tin'}</p>
                    </div>
                    <div className="material-section">
                      <h4>Head Material</h4>
                      <p>{product.headMaterial || 'Chưa có thông tin'}</p>
                    </div>
                    <div className="material-section">
                      <h4>Unit</h4>
                      <p>{product.unit || 'Chưa có thông tin'}</p>
                    </div>
                  </div>
                ) : isShoe ? (
                  <div className="materials-info">
                    <div className="material-section">
                      <h4>Outsole</h4>
                      <p>{product.outsole || 'Chưa có thông tin'}</p>
                    </div>
                    <div className="material-section">
                      <h4>Midsole</h4>
                      <p>{product.midsole || 'Chưa có thông tin'}</p>
                    </div>
                    <div className="material-section">
                      <h4>Upper</h4>
                      <p>{product.upper || 'Chưa có thông tin'}</p>
                    </div>
                  </div>
                ) : (
                  <p>Chưa có thông tin chi tiết.</p>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="tab-pane">
                <h3>Thông số kỹ thuật</h3>
                <table className="specs-table">
                  <tbody>
                    <tr>
                      <td className="spec-key">Tên sản phẩm:</td>
                      <td className="spec-val">{product.name}</td>
                    </tr>
                    <tr>
                      <td className="spec-key">Mã SKU:</td>
                      <td className="spec-val">{product.SKU || product.sku || product.code || '-'}</td>
                    </tr>
                    {isRacket && (
                      <>
                        <tr>
                          <td className="spec-key">Cân nặng/Caliber:</td>
                          <td className="spec-val">{product['w/s'] || '-'}</td>
                        </tr>
                        <tr>
                          <td className="spec-key">Điểm cân bằng:</td>
                          <td className="spec-val">{product.balance || '-'}</td>
                        </tr>
                        <tr>
                          <td className="spec-key">LBS:</td>
                          <td className="spec-val">{product.lbs || '-'}</td>
                        </tr>
                        <tr>
                          <td className="spec-key">Vợt (Head Material):</td>
                          <td className="spec-val">{product.fm || '-'}</td>
                        </tr>
                        <tr>
                          <td className="spec-key">Cán (Shaft Material):</td>
                          <td className="spec-val">{product.sm || '-'}</td>
                        </tr>
                      </>
                    )}
                    {isRacket && product.stiff && (
                      <tr>
                        <td className="spec-key">Độ cứng trục:</td>
                        <td className="spec-val">
                          <img src={product.stiff} alt="Biểu đồ độ cứng trục" className="stiff-image" />
                        </td>
                      </tr>
                    )}
                    {isShuttle && (
                      <tr>
                        <td className="spec-key">Tốc độ:</td>
                        <td className="spec-val">{product.speed || '-'}</td>
                      </tr>
                    )}
                    {isShoe && (
                      <>
                        <tr>
                          <td className="spec-key">Màu sắc:</td>
                          <td className="spec-val">{(product.colors || []).join(', ') || '-'}</td>
                        </tr>
                        <tr>
                          <td className="spec-key">Outsole:</td>
                          <td className="spec-val">{product.outsole || '-'}</td>
                        </tr>
                        <tr>
                          <td className="spec-key">Midsole:</td>
                          <td className="spec-val">{product.midsole || '-'}</td>
                        </tr>
                        <tr>
                          <td className="spec-key">Upper:</td>
                          <td className="spec-val">{product.upper || '-'}</td>
                        </tr>
                        <tr>
                          <td className="spec-key">Cỡ giày:</td>
                          <td className="spec-val">{product.size || '-'}</td>
                        </tr>
                      </>
                    )}
                    <tr>
                      <td className="spec-key">Dòng sản phẩm:</td>
                      <td className="spec-val">{product.series || '-'}</td>
                    </tr>
                    <tr>
                      <td className="spec-key">Giá:</td>
                      <td className="spec-val">{Number(product.price).toLocaleString('vi-VN')} VND</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
