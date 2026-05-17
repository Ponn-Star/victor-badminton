import victorLogo1 from '../assets/victor1.webp';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-wrapper">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={victorLogo1} alt="Victor Logo" className="logo-img" />
            </div>
          </div>

          <div className="footer-columns">
            <div className="footer-column">
              <h4 className="column-title">GIỚI THIỆU</h4>
              <div className="title-line"></div>
              <div className="column-info">
                <p>VICTOR là thương hiệu cầu lông hàng đầu thế giới, thành lập năm 1968, cam kết mang đến sản phẩm chất lượng cao cho mọi cấp độ vận động viên.</p>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="column-title">LIÊN HỆ</h4>
              <div className="title-line"></div>
              <div className="column-info">
                <p>📍 123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</p>
                <p>📞 1800 1234 (miễn phí)</p>
                <p>✉️ hotro@victor.vn</p>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="column-title">GIỜ LÀM VIỆC</h4>
              <div className="title-line"></div>
              <div className="column-info">
                <p>Thứ Hai – Thứ Sáu</p>
                <p>08:00 – 17:30</p>
                <p>Thứ Bảy</p>
                <p>08:00 – 12:00</p>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="column-title">VĂN PHÒNG ĐẠI DIỆN</h4>
              <div className="title-line"></div>
              <div className="column-info">
                <p>VICTOR Việt Nam</p>
                <p>Toà nhà Bitexco, Tầng 18</p>
                <p>TP. Hồ Chí Minh, Việt Nam</p>
              </div>
            </div>
          </div>

          <div className="footer-social">
            <a href="https://www.facebook.com/victorsport.official" className="social-icon facebook" title="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/victorsport_official/" className="social-icon instagram" title="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.521h-11.042V6.521h11.042v11zm-5.521-9.405c-1.587 0-2.882 1.295-2.882 2.882s1.295 2.882 2.882 2.882 2.882-1.295 2.882-2.882-1.295-2.882-2.882-2.882zm6.521-2.116h-1.884v-2.116h1.884v2.116z"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/channel/UCrqFPpQO2xEN52RTiu9RR2w" className="social-icon youtube" title="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy;2025 VICTOR RACKETS IND. CORP. All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
