import './News.css';
import shutImage1 from '../assets/shut1.png';
import shutImage2 from '../assets/shut.png';

function News() {
  return (
    <section id="news" className="news-section">
      {/* Background Blur */}
      <div className="news-blur news-blur-1"></div>
      <div className="news-blur news-blur-2"></div>

      <div className="news-container">
        {/* Header */}
        <div className="news-header">
          <h1 className="news-title">VICTOR NCS</h1>
          <p className="news-subtitle">Ổn định hơn, bền bỉ hơn, vượt trội mọi đường cầu!</p>
        </div>

        {/* Showcase */}
        <div className="news-showcase">

          {/* Center - Product Images */}
          <div className="showcase-center">
            <div className="showcase-images">
              <img
                src={shutImage2}
                alt="Shuttle Back"
                className="showcase-image showcase-image-back"
              />
              <img
                src={shutImage1}
                alt="Featured Shuttle"
                className="showcase-image showcase-image-front"
              />
            </div>
          </div>

          {/* Left labels */}
          <div className="labels-left">
            <div className="label-box lbl-1 float-a">
              <div className="label-accent"></div>
              <div className="label-content">
                <span className="label-tag">Chất liệu</span>
                <p className="label-subtitle">Lông vũ tự nhiên cao cấp</p>
                <p className="label-text">16 lông ngỗng tuyển chọn kỹ lưỡng, đường bay ổn định</p>
              </div>
            </div>

            <div className="label-box lbl-2 float-b">
              <div className="label-accent"></div>
              <div className="label-content">
                <span className="label-tag">Công nghệ</span>
                <p className="label-subtitle">Độ chính xác đường bay</p>
                <p className="label-text">Công nghệ NCS giúp cầu bay thẳng, dễ kiểm soát</p>
              </div>
            </div>

            <div className="label-box lbl-3 float-c">
              <div className="label-accent"></div>
              <div className="label-content">
                <span className="label-tag">Môi trường</span>
                <p className="label-subtitle">Thích nghi mọi điều kiện</p>
                <p className="label-text">Phù hợp mọi nhiệt độ & độ ẩm, lý tưởng sân trong nhà</p>
              </div>
            </div>
          </div>

          {/* Right labels */}
          <div className="labels-right">
            <div className="label-box lbl-4 float-d">
              <div className="label-accent"></div>
              <div className="label-content">
                <span className="label-tag">Độ bền</span>
                <p className="label-subtitle">Bền bỉ vượt trội</p>
                <p className="label-text">Chịu lực cao, dùng lâu hơn lông thường đến 30%</p>
              </div>
            </div>

            <div className="label-box lbl-5 float-e">
              <div className="label-accent"></div>
              <div className="label-content">
                <span className="label-tag">Hiệu suất</span>
                <p className="label-subtitle">Tốc độ & Cảm giác cầu</p>
                <p className="label-text">Đáp ứng chuẩn thi đấu quốc tế BWF</p>
              </div>
            </div>

            <div className="label-box lbl-6 float-f">
              <div className="label-accent"></div>
              <div className="label-content">
                <span className="label-tag">Tiêu chuẩn</span>
                <p className="label-subtitle">Kiểm định chất lượng</p>
                <p className="label-text">Được kiểm tra nghiêm ngặt trước khi xuất xưởng</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default News;
