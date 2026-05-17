import { useNavigate } from 'react-router-dom';
import './Cards.css';
import cardImage from '../assets/card.jpg';
import cardImage1 from '../assets/card1.jpg';
import cardImage2 from '../assets/card2.jpg';

function Cards() {
  const navigate = useNavigate();

  const showcases = [
    {
      id: 'ncs-max',
      productId: 16,
      productType: 'shuttles',
      productName: 'NEW CARBONSONIC MAX (12 PCS)',
      image: cardImage,
      title: 'Tiêu Chuẩn Mới Cho Cầu Tổng Hợp — NCS MAX',
      description: 'Đầu cầu có rãnh nhựa mới thiết kế tăng cường cấu trúc thân, cung cấp khả năng chống biến dạng tốt hơn. Lông cầu tổng hợp khí động học chuyên nghiệp được cải tiến tăng cường độ bền và mang lại cảm giác đánh gần giống cầu lông tự nhiên.'
    },
    {
      id: 'thruster-fc',
      productId: 6,
      productType: 'rackets',
      productName: 'THRUSTER F C ULTRA X',
      image: cardImage1,
      title: 'Chiếm Lĩnh Sân Đấu Với THRUSTER F C Ultra',
      description: 'Tích hợp NANO AEROGEL và SỢI CARBON KIM LOẠI, TK-F C Ultra tăng cường độ bền khung và cảm giác đánh trục tương ứng, đảm bảo ba cấu hình tấn công — 5U | 5.6 mm: LỰC ĐÁNH ĐẦU TIÊN; 4U | 5.8 mm: CẢI TIẾN CÓ KIỂM SOÁT; 3U | 6.0 mm: ĐẠO CHẮC CHẮN'
    },
    {
      id: 'a970-cadv',
      productId: 15,
      productType: 'shoes',
      productName: 'A970cADV AM/B',
      image: cardImage2,
      title: 'Giày Cầu Lông Tấm Hai Carbon Đầu Tiên Của VICTOR – A970cADV',
      description: 'A970cADV tích hợp các công nghệ mới nhất của VICTOR — Đơn vị Strobel tăng cường sức mạnh hướng tới và Đơn vị Midsole tăng cường khả năng chống xoắn. Nó cũng có Lót giày dày 7mm NitroLite và Midsole NitroLite, cung cấp nâng cấp toàn diện về sức đẩy, ổn định và thoải mái.'
    }
  ];

  const handleLearnMore = (productId, productType = 'rackets', productName = '') => {
    const params = new URLSearchParams({ type: productType });
    if (productName) {
      params.set('name', productName);
    }
    navigate(`/detail/${productId}?${params.toString()}`);
  };

  return (
    <section id="ai-features" className="ai-section">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">SẢN PHẨM NỔI BẬT</span>
          <h2>Khám Phá Công Nghệ Mới</h2>
          <p>Trải nghiệm dụng cụ cầu lông thế hệ mới.</p>
        </div>
        
        <div className="showcase-grid">
          {showcases.map((showcase) => (
            <div 
              key={showcase.id} 
              className="ai-product-card"
            >
              <div className="ai-product-image">
                <img src={showcase.image} alt={showcase.title} />
              </div>
              <div className="ai-product-content">
                <h3>{showcase.title}</h3>
                <p>{showcase.description}</p>
                <button 
                  className="learn-more-btn"
                  onClick={() => showcase.productId !== null && handleLearnMore(showcase.productId, showcase.productType, showcase.productName)}
                  disabled={showcase.productId === null}
                  style={showcase.productId === null ? { opacity: 0.4, cursor: 'not-allowed', transform: 'none' } : {}}
                >
                  {showcase.productId === null ? 'Sắp Ra Mắt' : 'Tìm Hiểu Thêm'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Cards;
