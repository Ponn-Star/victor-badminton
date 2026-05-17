import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AthleteList.css';

const PAGE_SIZE = 6;

function AthleteList() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/athletes')
      .then(res => res.json())
      .then(data => {
        setAthletes(data.athletes || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="athlete-list-page">
        <div className="athlete-list-loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="athlete-list-page">
      <div className="athlete-list-header">
        <span className="athlete-list-badge">TEAM VICTOR</span>
        <h1>Vận Động Viên</h1>
        <p>Những ngôi sao đỉnh cao thế giới – đồng hành cùng VICTOR</p>
      </div>

      <div className="athlete-grid">
        {athletes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(athlete => (
          <div
            key={athlete.id}
            className="athlete-card"
            onClick={() => navigate(`/athletes/${athlete.slug}`)}
          >
            <div className="athlete-card-img">
              <img src={athlete.img} alt={athlete.name} />
            </div>
            <div className="athlete-card-info">
              <div className="athlete-card-white">
                <div className="athlete-card-name">{athlete.name}</div>
              </div>
              <div className="athlete-card-blue">
                <div className="athlete-card-country">{athlete.country}</div>
                <div className="athlete-card-career">{athlete.careerHigh}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {Math.ceil(athletes.length / PAGE_SIZE) > 1 && (
        <div className="athlete-pagination">
          <button
            className="athlete-page-btn athlete-page-arrow"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ‹
          </button>
          {Array.from({ length: Math.ceil(athletes.length / PAGE_SIZE) }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              className={`athlete-page-btn${page === n ? ' athlete-page-active' : ''}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            className="athlete-page-btn athlete-page-arrow"
            onClick={() => setPage(p => Math.min(Math.ceil(athletes.length / PAGE_SIZE), p + 1))}
            disabled={page === Math.ceil(athletes.length / PAGE_SIZE)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default AthleteList;
