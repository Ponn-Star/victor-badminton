import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AthleteDetail.css';
import { API_BASE } from '../utils/api';

function AthleteDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/athletes/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setAthlete(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="athlete-detail-page">
        <div className="athlete-detail-loading">Đang tải...</div>
      </div>
    );
  }

  if (notFound || !athlete) {
    return (
      <div className="athlete-detail-page">
        <div className="athlete-detail-loading">Không tìm thấy vận động viên.</div>
        <button className="athlete-back-btn" onClick={() => navigate('/athletes')}>← Quay lại</button>
      </div>
    );
  }

  return (
    <div className="athlete-detail-page">

      {/* Gray section: country + name only */}
      <div className="athlete-detail-gray">
        <div className="athlete-detail-container">
          <div className="athlete-detail-top">
            <p className="athlete-detail-country">{athlete.country}</p>
            <h1 className="athlete-detail-name">{athlete.name}</h1>
          </div>
        </div>
      </div>

      {/* Photo bridge: straddles gray/white boundary */}
      <div className="athlete-detail-photo-bridge">
        <div className="athlete-detail-container">
          <img src={athlete.img2} alt={athlete.name} />
        </div>
      </div>

      {/* White section: info rows */}
      <div className="athlete-detail-white">
        <div className="athlete-detail-container">
          <div className="athlete-detail-info">
            <div className="athlete-detail-row">
              <span className="athlete-detail-label">Nội Dung Thi Đấu</span>
              <span className="athlete-detail-value">{athlete.events.join(', ')}</span>
            </div>
            <div className="athlete-detail-row">
              <span className="athlete-detail-label">Thành Tích Cao Nhất</span>
              <span className="athlete-detail-value">{athlete.careerHigh}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AthleteDetail;
