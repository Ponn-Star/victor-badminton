import { useState, useEffect } from 'react';
import './CampaignCarousel.css';
import cam from '../assets/Cam.jpg';
import cam1 from '../assets/Cam1.jpg';
import cam2 from '../assets/Cam2.jpg';
import cam3 from '../assets/Cam3.jpg';

function CampaignCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const campaigns = [
    {
      id: 1,
      image: cam1,
    },
    {
      id: 2,
      image: cam2,
    },
    {
      id: 3,
      image: cam3,
    },
    {
      id: 4,
      image: cam,
    }
  ];

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % campaigns.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay, campaigns.length]);


  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + campaigns.length) % campaigns.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 5000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % campaigns.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 5000);
  };

  return (
    <section className="campaign-carousel-section">
      <div className="carousel-container">
        <div className="carousel-wrapper">
          <div className="carousel-slides">
            {campaigns.map((campaign, index) => (
              <div
                key={campaign.id}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <div 
                  className="slide-background"
                  style={{
                    backgroundImage: `url(${campaign.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="slide-overlay"></div>
                </div>
                <div className="slide-content">
                  <div className="slide-text">
                    <h2 className="slide-title">{campaign.title}</h2>
                    <p className="slide-subtitle">{campaign.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="carousel-button carousel-button-prev"
            onClick={goToPrev}
            aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            className="carousel-button carousel-button-next"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div className="carousel-progress-bar">
          {campaigns.map((campaign, index) => (
            <div
              key={campaign.id}
              className={`progress-segment ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundColor: index === currentSlide ? '#FF8C00' : '#0052CC',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CampaignCarousel;
