import styles from "./itineraryTimeline.module.css"

export default function ItineraryTimeline({ days }) {
  return (
    <div className={styles.timeline}>
      {days.map((day, i) => (
        <div key={i} className={styles.day}>
          {/* Day header */}
          <div className={styles.dayHeader}>
            <div className={styles.dayBadge}>Day {day.day}</div>
            <div className={styles.dayInfo}>
              <h3 className={styles.dayTitle}>{day.title}</h3>
              <p className={styles.dayLocation}>
                <i className="fa-solid fa-location-dot" />
                {day.location}
              </p>
            </div>
          </div>

          {/* Activities */}
          <div className={styles.activities}>
            {day.activities.map((act, j) => (
              <div key={j} className={styles.activity}>
                <div className={styles.activityTime}>{act.time}</div>
                <div className={styles.activityDot} />
                <div className={styles.activityContent}>
                  <h4>{act.title}</h4>
                  <p>{act.desc}</p>
                  {act.isHiddenGem && (
                    <span className={styles.gemBadge}>
                      <i className="fa-solid fa-gem" /> Hidden Gem
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
