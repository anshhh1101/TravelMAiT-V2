import { useState } from 'react';
import styles from './MoodForm.module.css';

const MOODS = [
  { id: 'adventure',  label: 'Adventure',  icon: 'fa-solid fa-person-hiking' },
  { id: 'relaxation', label: 'Relaxation', icon: 'fa-solid fa-umbrella-beach' },
  { id: 'cultural',   label: 'Cultural',   icon: 'fa-solid fa-landmark' },
  { id: 'romantic',   label: 'Romantic',   icon: 'fa-solid fa-heart' },
  { id: 'spiritual',  label: 'Spiritual',  icon: 'fa-solid fa-place-of-worship' },
  { id: 'offbeat',    label: 'Offbeat',    icon: 'fa-solid fa-map-location-dot' },
];

const BUDGETS = [
  { id: 'budget',  label: 'Budget',  sub: 'Under ₹5,000/day' },
  { id: 'mid',     label: 'Mid',     sub: '₹5,000–₹15,000/day' },
  { id: 'luxury',  label: 'Luxury',  sub: 'Above ₹15,000/day' },
];

const GROUP_TYPES = [
  { id: 'solo',    label: 'Solo',         icon: 'fa-solid fa-person' },
  { id: 'couple',  label: 'Couple',       icon: 'fa-solid fa-heart' },
  { id: 'friends', label: 'Friends',      icon: 'fa-solid fa-user-group' },
  { id: 'family',  label: 'Family',       icon: 'fa-solid fa-house-chimney-user' },
  { id: 'match',   label: 'Find a Group', icon: 'fa-solid fa-handshake', premium: true },
];

const STEPS = ['Destination', 'Vibe', 'Duration', 'Budget', 'Group'];

export default function MoodForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    destination: '',
    mood:        '',
    duration:    3,
    budget:      '',
    groupType:   '',
  });

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);
  const set  = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const canNext = () => {
    if (step === 0) return form.destination.trim().length > 0;
    if (step === 1) return form.mood !== '';
    if (step === 2) return form.duration > 0;
    if (step === 3) return form.budget !== '';
    if (step === 4) return form.groupType !== '' && form.groupType !== 'match';
    return false;
  };

  const handleGroupClick = (id) => {
    if (id === 'match') {
      alert('Find a Group is coming soon! This premium feature will let you connect with fellow travellers heading to the same destination.');
      return;
    }
    set('groupType', id);
  };

  const handleSubmit = () => {
    if (canNext()) onSubmit(form);
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className="sec-tag">
          <i className="fa-solid fa-wand-magic-sparkles" />
          AI TRIP PLANNER
        </div>
        <h1 className={styles.heading}>PLAN YOUR TRIP</h1>
        <p className={styles.sub}>Tell us what you're looking for and we'll craft the perfect itinerary.</p>
      </div>

      {/* Progress bar */}
      <div className={styles.progress}>
        {STEPS.map((label, i) => (
          <div key={i} className={`${styles.stepDot} ${i <= step ? styles.stepActive : ''}`}>
            <div className={styles.dot} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className={styles.card}>

        {/* Step 0 — Destination */}
        {step === 0 && (
          <div className={styles.stepContent}>
            <h2>Where do you want to go?</h2>
            <p>Enter a city, region, or just say "surprise me"</p>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Puri, Konark, Chilika..."
              value={form.destination}
              onChange={(e) => set('destination', e.target.value)}
              autoFocus
            />
          </div>
        )}

        {/* Step 1 — Mood/Vibe */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h2>What's your vibe?</h2>
            <p>Pick the mood that best describes your ideal trip</p>
            <div className={styles.moodGrid}>
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  className={`${styles.moodCard} ${form.mood === m.id ? styles.selected : ''}`}
                  onClick={() => set('mood', m.id)}
                >
                  <i className={`${m.icon} ${styles.moodIcon}`} />
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Duration */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h2>How many days?</h2>
            <p>Drag or use the buttons to set your trip length</p>
            <div className={styles.durationControl}>
              <button
                className={styles.durationBtn}
                onClick={() => set('duration', Math.max(1, form.duration - 1))}
              >−</button>
              <div className={styles.durationDisplay}>
                <span className={styles.durationNum}>{form.duration}</span>
                <span className={styles.durationLabel}>days</span>
              </div>
              <button
                className={styles.durationBtn}
                onClick={() => set('duration', Math.min(30, form.duration + 1))}
              >+</button>
            </div>
            <input
              type="range" min="1" max="30"
              value={form.duration}
              onChange={(e) => set('duration', Number(e.target.value))}
              className={styles.slider}
            />
            <p className={styles.durationHint}>
              {form.duration <= 3 ? 'Perfect for a quick getaway' :
               form.duration <= 7 ? 'Great for a full week exploration' :
               'An epic long journey ahead!'}
            </p>
          </div>
        )}

        {/* Step 3 — Budget */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h2>What's your budget?</h2>
            <p>Per person, per day estimate</p>
            <div className={styles.budgetGrid}>
              {BUDGETS.map((b) => (
                <button
                  key={b.id}
                  className={`${styles.budgetCard} ${form.budget === b.id ? styles.selected : ''}`}
                  onClick={() => set('budget', b.id)}
                >
                  <span className={styles.budgetLabel}>{b.label}</span>
                  <span className={styles.budgetSub}>{b.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 — Group Type */}
        {step === 4 && (
          <div className={styles.stepContent}>
            <h2>Who's travelling?</h2>
            <p>Choose your group type</p>
            <div className={styles.moodGrid}>
              {GROUP_TYPES.map((g) => (
                <button
                  key={g.id}
                  className={`${styles.moodCard} ${form.groupType === g.id ? styles.selected : ''} ${g.premium ? styles.premiumCard : ''}`}
                  onClick={() => handleGroupClick(g.id)}
                >
                  {g.premium && <div className={styles.premiumBadge}>
                    <i className="fa-solid fa-crown" /> Premium
                  </div>}
                  <i className={`${g.icon} ${styles.moodIcon}`} />
                  <span>{g.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className={styles.navBtns}>
          {step > 0 && (
            <button className={styles.prevBtn} onClick={prev}>
              <i className="fa-solid fa-arrow-left" /> Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button className={styles.nextBtn} onClick={next} disabled={!canNext()}>
              Next <i className="fa-solid fa-arrow-right" />
            </button>
          ) : (
            <button className={styles.submitBtn} onClick={handleSubmit} disabled={!canNext()}>
              <i className="fa-solid fa-wand-magic-sparkles" />
              Generate Itinerary
            </button>
          )}
        </div>
      </div>
    </div>
  );
}