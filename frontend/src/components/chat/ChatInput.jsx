import { useState, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';

export default function ChatInput({ onSend, disabled, idle }) {
  const [text, setText]   = useState('');
  const textareaRef       = useRef(null);

  // auto-grow only in chat mode (not idle — fixed height bar)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el || idle) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, [text, idle]);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`${styles.bar} ${idle ? styles.idle : ''}`}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        placeholder="Ask TRAVELMAiT AI…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        rows={1}
        disabled={disabled}
      />
      <button
        className={styles.sendBtn}
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        aria-label="Send"
      >
        <i className="fa-solid fa-arrow-up" />
      </button>
    </div>
  );
}



