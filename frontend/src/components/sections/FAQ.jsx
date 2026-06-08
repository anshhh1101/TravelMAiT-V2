import { useState } from 'react';
import { FAQS } from '../../constants';
import styles from './FAQ.module.css';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (idx) => setOpenIdx((prev) => (prev === idx ? null : idx));

  return (
    <section className={styles.section} id="faq">
      <div className="sec-tag">
        <i className="fa-solid fa-circle-question" />
        FAQ
      </div>
      <h2 className="sec-heading">GOT QUESTIONS?</h2>
      <p className="sec-sub">
        Everything you need to know before your next adventure.
      </p>

      <div className={styles.list}>
        {FAQS.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} className={`${styles.item} ${isOpen ? styles.open : ''}`}>
              <button className={styles.question} onClick={() => toggle(i)}>
                <span>{faq.q}</span>
                <i className={`fa-solid ${isOpen ? 'fa-minus' : 'fa-plus'}`} />
              </button>
              <div className={styles.answer} aria-hidden={!isOpen}>
                <p>{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}



