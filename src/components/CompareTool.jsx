import { useState, useEffect } from 'react';
import './CompareTool.css';
import { API_BASE } from '../utils/api';

// Map singular DB status → plural API endpoint
const STATUS_TO_ENDPOINT = { racket: 'rackets', shoe: 'shoes', shoes: 'shoes', shuttle: 'shuttles' };

function CompareTool({ isOpen, onClose, items, onRemove }) {
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || items.length === 0) return;

    const loadDetails = async () => {
      setLoading(true);
      try {
        const details = {};

        for (const item of items) {
          const rawStatus = item.status || item.type || 'racket';
          const endpoint = STATUS_TO_ENDPOINT[rawStatus] || 'rackets';
          const response = await fetch(`${API_BASE}/api/products/${endpoint}`);
          if (!response.ok) {
            console.error(`Failed to fetch /api/products/${endpoint}:`, response.status);
            continue;
          }
          const products = await response.json();
          if (!Array.isArray(products)) continue;

          const found = products.find(p => {
            if (item._id && p._id && String(p._id) === String(item._id)) return true;
            if (item.SKU && p.SKU && p.SKU === item.SKU) return true;
            if (item.sku && p.sku && p.sku === item.sku) return true;
            return !!(item.name && p.name && p.name === item.name);
          });
          if (found) details[item.id] = found;
        }

        setProductDetails(details);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [isOpen, items]);

  const getProductType = (item, product) => {
    return product?.status || item?.status || item?.type || 'rackets';
  };

  const renderProductStats = (item, product) => {
    const productType = getProductType(item, product);
    
    if (productType === 'racket' || productType === 'rackets') {
      return (
        <>
          <div className="stat-row">
            <span className="stat-label">Trọng lượng/Cỡ cầm</span>
            <span className="stat-value">{product ? product['w/s'] : item['w/s'] || 'N/A'}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Điểm cân bằng</span>
            <span className="stat-value">{product ? product.balance : item.balance || 'N/A'}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Sức căng tối đa</span>
            <span className="stat-value">{product ? product.lbs : item.lbs || 'N/A'}</span>
          </div>
          {(product?.stiff || item?.stiff) && (
            <div className="compare-stiff">
              <span className="stat-label">Độ cứng trục</span>
              <img src={product?.stiff || item?.stiff} alt="Biểu đồ độ cứng" className="compare-stiff-img" />
            </div>
          )}

          <div className="ai-stat-bar">
            <div className="ai-stat-header">
              <span>Lực</span>
              <span>{product?.performanceStats?.power || '85%'}</span>
            </div>
            <div className="ai-bar-bg">
              <div className="ai-bar-fill" style={{ width: product?.performanceStats?.power ? product.performanceStats.power.replace('%', '') + '%' : '85%', background: '#d84315' }}></div>
            </div>
          </div>
          
          <div className="ai-stat-bar">
            <div className="ai-stat-header">
              <span>Tốc độ</span>
              <span>{product?.performanceStats?.speed || '80%'}</span>
            </div>
            <div className="ai-bar-bg">
              <div className="ai-bar-fill" style={{ width: product?.performanceStats?.speed ? product.performanceStats.speed.replace('%', '') + '%' : '80%', background: '#0284c7' }}></div>
            </div>
          </div>
          
          <div className="ai-stat-bar">
            <div className="ai-stat-header">
              <span>Kiểm soát</span>
              <span>{product?.performanceStats?.control || '88%'}</span>
            </div>
            <div className="ai-bar-bg">
              <div className="ai-bar-fill" style={{ width: product?.performanceStats?.control ? product.performanceStats.control.replace('%', '') + '%' : '88%', background: '#16a34a' }}></div>
            </div>
          </div>
        </>
      );
    } else if (productType === 'shoe' || productType === 'shoes') {
      return (
        <>
          <div className="stat-row">
            <span className="stat-label">Đế ngoài</span>
            <span className="stat-value">{product?.outsole || item.outsole || 'N/A'}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Đế giữa</span>
            <span className="stat-value">{product?.midsole || item.midsole || 'N/A'}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Thân giày</span>
            <span className="stat-value">{product?.upper || item.upper || 'N/A'}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Cỡ giày</span>
            <span className="stat-value">{product?.size || item.size || 'N/A'}</span>
          </div>
        </>
      );
    } else if (productType === 'shuttle' || productType === 'shuttles') {
      return (
        <>
          <div className="stat-row">
            <span className="stat-label">Loại cầu</span>
            <span className="stat-value">{product?.type || item.type || 'N/A'}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Đầu cầu</span>
            <span className="stat-value">{product?.headMaterial || item.headMaterial || 'N/A'}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Tốc độ</span>
            <span className="stat-value">{product?.speed || item.speed || 'N/A'}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Đơn vị</span>
            <span className="stat-value">{product?.unit || item.unit || 'N/A'}</span>
          </div>
        </>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="compare-overlay" onClick={onClose}>
      <div className="compare-modal glass-panel" onClick={e => e.stopPropagation()}>
        <div className="compare-header">
          <div className="compare-header-title">
            <span className="ai-badge">ĐỀ XUẤT TỐT NHẤT DÀNH CHO BẠN</span>
            <h2>So Sánh Sản Phẩm</h2>
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⚖️</div>
            <p>Chưa chọn vợt nào để so sánh. Thêm tới 3 vợt để đánh giá.</p>
          </div>
        ) : loading ? (
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <p>Đang tải chi tiết sản phẩm...</p>
          </div>
        ) : (
          <div className="compare-grid" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
            {items.map(item => {
              const product = productDetails[item.id];
              return (
                <div key={item.id} className="compare-column glass-panel">
                  <button className="remove-item-btn" onClick={() => onRemove(item.id)}>&times;</button>
                  <div className="compare-img">
                    <img 
                      src={product?.img || item.img} 
                      alt={product?.name || item.name}
                    />
                  </div>
                  <h3>{product?.name || item.name}</h3>
                  <span className="compare-series" data-series={product?.series || item.series}>{product?.series || item.series}</span>
                  
                  <div className="compare-stats">
                    {renderProductStats(item, product)}

                    <div className="stat-row price-row">
                      <span className="stat-label">Giá</span>
                      <span className="stat-value">{product ? product.price : item.price}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CompareTool;
