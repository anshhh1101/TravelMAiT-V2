import { useState } from 'react';
import MoodForm from '../components/itinerary/MoodForm';
import styles from './PlanTrip.module.css';

export default function PlanTrip() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData]   = useState(null);

  const handleSubmit = (data) => {
    setFormData(data);
    setSubmitted(true);
    console.log('Mood form data:', data);
    // TODO: send to Gemini API
  };

  return (
    <div className={styles.page}>
      {!submitted ? (
        <MoodForm onSubmit={handleSubmit} />
      ) : (
        <div className={styles.submitted}>
          <h2>Generating your itinerary...</h2>
          <p>Based on: <strong>{formData.destination}</strong></p>
          <p>Vibe: <strong>{formData.mood}</strong></p>
          <p>Duration: <strong>{formData.duration} days</strong></p>
          <p>Budget: <strong>{formData.budget}</strong></p>
          <p>Group: <strong>{formData.groupType}</strong></p>
          <button onClick={() => setSubmitted(false)} className={styles.backBtn}>
            ← Change Preferences
          </button>
        </div>
      )}
    </div>
  );
}

