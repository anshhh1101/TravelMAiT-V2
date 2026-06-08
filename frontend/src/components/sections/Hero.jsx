import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSlideshow } from '../../hooks/useSlideshow';
import { SLIDES } from '../../constants';
import styles from './Hero.module.css';

export default function Hero() {
  const { current, goTo } = useSlideshow(SLIDES.length, 5000);
  const { user }          = useAuth();
  const navigate          = useNavigate();

  const handleAskClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/chat');
    } else {
      alert('Please log in first to use TRAVELMAiT AI!');
    }
  };

  const handlePlanClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/planner');
    } else {
      alert('Please log in first to plan your trip!');
    }
  };

  return (
    <section className={styles.hero} id="hero">
      {/* Slideshow background */}
      <div className={styles.bg}>
        {SLIDES.map((src, i) => (
          <div
            key={i}
            className={`${styles.slide} ${i === current ? styles.active : ''}`}
          >
            <img src={src} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
        <div className={styles.overlay} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className="sec-tag">
          <i className="fa-solid fa-globe" />
          AI-Powered Travel
        </div>

        <h1 className={styles.heading}>
          DISCOVER<br />
          YOUR <span>DREAM</span><br />
          DESTINATION
        </h1>

        <p className={styles.sub}>
          Let TRAVELMAiT guide you to unforgettable experiences —
          curated by AI, tailored just for you.
        </p>

        <div className={styles.actions}>
          <button onClick={handleAskClick} className={styles.askTravelmaitBtn}>
            <i className="fa-solid fa-wand-magic-sparkles" />
            Ask TRAVELMAiT
          </button>

          <button onClick={handlePlanClick} className="btn-ghost">
            <i className="fa-solid fa-map" />
            Plan Your Trip
          </button>
        </div>
      </div>

      {/* Slide dots */}
      <div className={styles.dots}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollHint}>
        <div className={styles.scrollLine} />
        <span>SCROLL</span>
      </div>
    </section>
  );
}
