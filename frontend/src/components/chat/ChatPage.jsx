import { useState, useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput  from './ChatInput';
import { useAuth } from '../../hooks/useAuth';
import styles     from './ChatPage.module.css';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const bottomRef               = useRef(null);
  const { user }                = useAuth();

  const hasMessages = messages.length > 0;
  const firstName   = user?.name?.split(' ')[0] || 'Traveller';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { id: Date.now(), role: 'user', type: 'text', text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text || '',
      }));

      const res = await fetch(`https://travelmait-backend.onrender.com/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('tm_token')}`,
        },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();

      if (data.type === 'itinerary') {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: 'ai', type: 'itinerary', text: data.intro, places: data.places },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: 'ai', type: 'text', text: data.reply },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'ai', type: 'text', text: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.page} ${hasMessages ? styles.chatMode : styles.idleMode}`}>

      {/* ── IDLE STATE ── */}
      {!hasMessages && (
        <div className={styles.idleCenter}>
          <h1 className={styles.welcomeText}>
            What can I help with, <span className={styles.nameHighlight}>{firstName}?</span>
          </h1>
          <div className={styles.inputWrapper}>
            <ChatInput onSend={sendMessage} disabled={loading} idle />
          </div>
        </div>
      )}

      {/* ── CHAT STATE ── */}
      {hasMessages && (
        <>
          <div className={styles.feed}>
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}

            {loading && (
              <div className={styles.typingRow}>
                <div className={styles.typingBubble}>
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className={styles.inputBar}>
            <ChatInput onSend={sendMessage} disabled={loading} />
          </div>
        </>
      )}
    </div>
  );
}



