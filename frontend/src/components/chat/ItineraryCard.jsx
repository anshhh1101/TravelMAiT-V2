import styles from './ItineraryCard.module.css';

const TYPE_ICONS = {
  beach:       'fa-solid fa-umbrella-beach',
  temple:      'fa-solid fa-place-of-worship',
  wildlife:    'fa-solid fa-paw',
  waterfall:   'fa-solid fa-water',
  lake:        'fa-solid fa-water',
  hill:        'fa-solid fa-mountain',
  forest:      'fa-solid fa-tree',
  heritage:    'fa-solid fa-landmark',
  tribal:      'fa-solid fa-campground',
  dam:         'fa-solid fa-water',
  default:     'fa-solid fa-map-pin',
};

const BUDGET_LABEL = {
  free:   { text: 'Free',       cls: 'free'   },
  low:    { text: 'Budget',     cls: 'low'    },
  medium: { text: 'Mid-range',  cls: 'medium' },
  high:   { text: 'Premium',    cls: 'high'   },
};

function getPhotoUrl(place, index) {
  if (place.id) {
    return `https://res.cloudinary.com/dqu8fqstm/image/upload/f_auto,q_auto/${place.id}`;
  }
  const seeds = [10, 15, 22, 28, 33, 41, 55, 62, 74, 83];
  return `https://picsum.photos/seed/${seeds[index % seeds.length]}/400/200`;
}

export default function ItineraryCard({ place, index }) {
  const icon   = TYPE_ICONS[place.type?.toLowerCase()] || TYPE_ICONS.default;
  const budget = BUDGET_LABEL[place.budget_level] || { text: place.budget_level || 'Budget', cls: 'low' };
  const fee    = place.entry_fee_inr === 0 ? 'Free entry' : `₹${place.entry_fee_inr} entry`;
  const moods  = place.mood_tags?.slice(0, 3) || [];
  const photo  = getPhotoUrl(place, index);

  return (
    <div className={styles.card} style={{ animationDelay: `${index * 0.08}s` }}>
      {/* Photo */}
      <div className={styles.photoWrap}>
        <img
          src={photo}
          alt={place.name}
          className={styles.photo}
          onError={(e) => {
            e.target.onerror = null; // prevent infinite loop
            e.target.src = `https://picsum.photos/seed/${index + 10}/400/200`;
          }}
        />
        <span className={`${styles.budgetBadge} ${styles[budget.cls]}`}>
          {budget.text}
        </span>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {/* Top row */}
        <div className={styles.top}>
          <div className={styles.iconBox}>
            <i className={icon} />
          </div>
          <div className={styles.meta}>
            <h3 className={styles.name}>{place.name}</h3>
            <p className={styles.region}>{place.region}</p>
          </div>
        </div>

        {/* Description */}
        <p className={styles.desc}>{place.description}</p>

        {/* Mood tags */}
        {moods.length > 0 && (
          <div className={styles.tags}>
            {moods.map((m) => (
              <span key={m} className={styles.tag}>{m}</span>
            ))}
          </div>
        )}

        {/* Footer stats */}
        <div className={styles.footer}>
          <span><i className="fa-solid fa-ticket" /> {fee}</span>
          {place.best_season?.length > 0 && (
            <span><i className="fa-regular fa-calendar" /> {place.best_season[0]}</span>
          )}
        </div>
      </div>
    </div>
  );
}
