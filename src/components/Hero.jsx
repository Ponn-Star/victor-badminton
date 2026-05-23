import './Hero.css';
import athletesImg from '../assets/pngwing.com.png';

function Hero() {
  return (
    <section id="hero" className="hero-section">
      <svg className="hero-bg-shapes" viewBox="0 0 1440 820" aria-hidden="true" preserveAspectRatio="none">
        <defs>
          <linearGradient id="topPurpleGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8f75ea" />
            <stop offset="100%" stopColor="#c7b0ef" />
          </linearGradient>
        </defs>
        {/* Blob lớn nhất - lớp sau cùng */}
        <path
          className="shape-accent"
          d="M0 0H1050C1140 0 1210 52 1232 150C1266 295 1205 490 1085 553C965 616 818 610 714 552C610 494 538 380 420 352C315 328 210 370 0 430V0Z"
        />
        {/* Blob tím gradient - lớp giữa */}
        <path
          className="shape-top-purple"
          d="M0 0H820C900 0 960 42 980 126C1010 250 960 415 845 480C730 542 600 538 498 482C396 426 330 322 218 300C130 283 46 320 0 378V0Z"
        />
        {/* Blob nhỏ nhất - lớp trước */}
        <path
          className="shape-left-pink"
          d="M0 0H420C472 0 514 24 532 72C558 148 530 248 460 292C390 336 298 330 238 290C186 258 158 206 100 198C62 193 26 210 0 240V0Z"
        />
      </svg>

      <div className="hero-wrapper">
        <div className="hero-container">
          <div className="hero-content">
            <div className="badge-new">🏆 Kỷ Nguyên Mới</div>
            <h1 className="hero-title">
              <span className="text-gradient">HÃY CÙNG VICTOR SẴN SÀNG CHIẾN THẮNG.</span>
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
        </div>
      </div>

      <div className="hero-visual">
            <svg className="hero-art" viewBox="0 0 720 600" preserveAspectRatio="none" overflow="visible" aria-hidden="true">
              <defs>
                <linearGradient id="heroMainGradient" x1="0.18" y1="0.08" x2="0.82" y2="0.96">
                  <stop offset="0%" stopColor="#b467c8" />
                  <stop offset="54%" stopColor="#c077b8" />
                  <stop offset="100%" stopColor="#d99c98" />
                </linearGradient>
              </defs>
              <path
                className="hero-art-back-large"
                d="M-60 480C-30 295 125 148 380 138C635 128 820 262 830 468C840 648 782 820 538 840C294 860 -90 756 -60 576C-65 540 -65 508 -60 480Z"
              />
              <path
                className="hero-art-back-small"
                d="M506 -195C593 -238 772 -148 818 36C864 218 806 368 702 392C598 416 502 320 494 208C486 108 462 -160 506 -195Z"
              />
              <path
                className="hero-art-main"
                d="M205 -55C262 -168 415 -238 552 -168C678 -103 768 58 772 248L772 478C772 546 850 586 868 668L316 668C130 648 -54 562 -70 422C-86 292 32 140 175 100C204 90 196 38 205 -55Z"
              />
              <path
                className="hero-art-shade"
                d="M205 -55C262 -168 415 -238 552 -168C678 -103 768 58 772 248L772 478C772 546 850 586 868 668L316 668C130 648 -54 562 -70 422C-86 292 32 140 175 100C204 90 196 38 205 -55Z"
              />
            </svg>
            <img className="hero-img" src={athletesImg} alt="Victor athletes" />
          </div>
    </section>
  );
}

export default Hero;
