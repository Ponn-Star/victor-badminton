import './Hero.css';
import heroImage from '../assets/png.png';

function Hero() {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-wrapper">
        <div className="hero-container">
          <div className="hero-content">
            <div className="badge-new">🏆 Kỷ Nguyên Mới</div>
            <h1 className="hero-title">
              <span className="text-gradient">MỌI LÚC, MỌI NƠI</span> <br/>
              <span className="highlight-text">HÃY CÙNG VICTOR SẴN SÀNG CHIẾN THẮNG.</span>
            </h1>
            <p className="hero-subtitle">
              Cầu lông là môn thể thao không hề xa lạ đối với người Việt. Dù là đầu ngõ hay trên sân đấu, Victor luôn mang lại trải nghiệm tuyệt vời nhất cho người chơi qua các trang thiết bị xuất sắc. Cùng Victor, mỗi cầu thủ đều luôn sẵn sàng chiến thắng.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">100+</span>
                <span className="stat-label">Quốc Gia</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Vận Động Viên</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">25+</span>
                <span className="stat-label">Năm</span>
              </div>
            </div>
            <div className="hero-actions">
              <a
                className="btn-secondary play-video"
                href="https://www.victorsport.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="icon">▶</span> Tìm Hiểu Thêm
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <img 
              src={heroImage} 
              alt="Professional Badminton Player - Zheng Siwei" 
              className="hero-main-image" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
