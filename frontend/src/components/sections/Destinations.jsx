import { useState, useRef, useEffect } from 'react';
import { DESTINATION_TABS } from '../../constants';
import styles from './Destinations.module.css';

export default function Destinations() {
  const [activeTab, setActiveTab] = useState(DESTINATION_TABS[0].id);
  const scrollRef = useRef(null);

  // Automatically load the data for the currently clicked tab
  const currentData =
    DESTINATION_TABS.find((t) => t.id === activeTab)?.data ?? [];

  // CRITICAL FIX: Reset the scroll position to the very beginning whenever the tab changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [activeTab]);

  const scroll = (dir) => {
    if (scrollRef.current) {
      // 250px (card width) + 16px (gap) = 266px jump
      const scrollAmount = 266; 
      
      scrollRef.current.scrollBy({
        left: dir * scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className={styles.section} id="destinations">
      {/* Explore Tag */}
      <div className="sec-tag">
        <i className="fa-solid fa-map-pin" />
        EXPLORE
      </div>

      {/* Heading */}
      <h2 className="sec-heading">DESTINATIONS</h2>

      {/* Paragraph */}
      <p className="sec-sub">
        From iconic landmarks to secret spots — find your next story.
      </p>

      {/* Tabs */}
      <div className={styles.tabs}>
        {DESTINATION_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.tabActive : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Slider Wrapper */}
      <div className={styles.sliderWrapper}>
        {/* Left Arrow */}
        <button
          className={`${styles.arrowBtn} ${styles.leftArrow}`}
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>

        {/* Cards */}
        <div className={styles.cards} ref={scrollRef}>
          {currentData.map((item) => (
            <div key={item.label} className={styles.card}>
              <img
                src={item.img}
                alt={item.label}
                loading="lazy"
                className={styles.cardImg}
              />
              <div className={styles.cardOverlay}>
                <div className={styles.cardLabel}>{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className={`${styles.arrowBtn} ${styles.rightArrow}`}
          onClick={() => scroll(1)}
          aria-label="Scroll right"
        >
          <i className="fa-solid fa-arrow-right" />
        </button>
      </div>
    </section>
  );
}

