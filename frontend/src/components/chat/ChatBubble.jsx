import ItineraryCard from './ItineraryCard';
import styles        from './ChatBubble.module.css';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';

  /* ── User bubble — right aligned pill ── */
  if (isUser) {
    return (
      <div className={styles.rowUser}>
        <div className={styles.userBubble}>{message.text}</div>
      </div>
    );
  }

  /* ── AI reply — plain text left, no bubble box ── */
  return (
    <div className={styles.rowAi}>
      <div className={styles.aiContent}>
        {message.text && (
          <p className={styles.aiText}>
            <Markdown text={message.text} />
          </p>
        )}

        {message.type === 'itinerary' && message.places?.length > 0 && (
          <div className={styles.cards}>
            {message.places.map((place, i) => (
              <ItineraryCard key={i} place={place} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Minimal markdown: **bold**, *italic*, newlines ── */
function Markdown({ text }) {
  return (
    <>
      {text.split('\n').map((line, i, arr) => {
        const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**'))
            return <strong key={j}>{part.slice(2, -2)}</strong>;
          if (part.startsWith('*') && part.endsWith('*'))
            return <em key={j}>{part.slice(1, -1)}</em>;
          return part;
        });
        return (
          <span key={i}>
            {parts}
            {i < arr.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

