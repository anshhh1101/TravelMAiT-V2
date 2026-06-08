import { useState } from 'react';
import MoodForm          from './MoodForm';
import ItineraryTimeline from "./itineraryTimeline"
import styles            from './PlannerPage.module.css';

export default function PlannerPage() {
  const [itinerary, setItinerary] = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async (form) => {
    setLoading(true);
    setError('');
    setItinerary(null);

    try {
      const res = await fetch(https://travelmait-backend.onrender.com/api/itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('tm_token')}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.days) {
        setItinerary(data);
      } else {
        setError('Could not generate itinerary. Please try again.');
      }
    } catch {
      setError('Server error. Make sure Flask is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setError('');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Loading state */}
        {loading && (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
            <p>Crafting your perfect itinerary...</p>
            <span>This may take a few seconds</span>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className={styles.errorWrap}>
            <p>{error}</p>
            <button onClick={handleReset} className={styles.retryBtn}>Try Again</button>
          </div>
        )}

        {/* Form */}
        {!loading && !itinerary && !error && (
          <MoodForm onSubmit={handleSubmit} />
        )}

        {/* Result */}
        {!loading && itinerary && (
          <div className={styles.result}>
            <div className={styles.resultHeader}>
              <div>
                <h2 className={styles.resultTitle}>{itinerary.title}</h2>
                <p className={styles.resultSub}>{itinerary.summary}</p>
              </div>
              <button onClick={handleReset} className={styles.replanBtn}>
                <i className="fa-solid fa-rotate-left" /> Plan Again
              </button>
            </div>
            <ItineraryTimeline days={itinerary.days} />
          </div>
        )}

      </div>
    </div>
  );
}


