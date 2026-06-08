import { HOW_IT_WORKS_STEPS } from '../../constants';
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className="sec-tag">
        <i className="fa-solid fa-circle-info" />
        HOW IT WORKS
      </div>

      <h2 className="sec-heading">
        PLAN SMARTER,<br />TRAVEL BETTER
      </h2>

      <p className="sec-sub">
        A simple, AI-driven process to discover and plan your next adventure.
      </p>

      <div className={styles.grid}>
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <div
            key={step.num}
            className={`${styles.card} ${index >= 2 ? styles.premiumCard : ''}`}
          >
            {/* Premium badge on 3rd and 4th cards */}
            {index >= 2 && (
              <div className={styles.premiumBadge}>
                <i className="fa-solid fa-crown" /> Premium
              </div>
            )}

            <div className={styles.stepNum}>
              {String(index + 1).padStart(2, '0')}
            </div>

            <div className={styles.iconWrap}>
              <i className={step.icon} />
            </div>

            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.desc}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}



