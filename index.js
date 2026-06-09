import { useState, useRef, useEffect } from 'react';
import DestinationCard from '../components/DestinationCard';

function parseDestinations(text) {
  const destinations = [];
  const regex = /<destination>([\s\S]*?)<\/destination>/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    try {
      const json = match[1].trim();
      destinations.push(JSON.parse(json));
    } catch (e) {
      console.error('Failed to parse destination:', e);
    }
  }
  return destinations;
}

function cleanText(text) {
  return text.replace(/<destination>[\s\S]*?<\/destination>/g, '').trim();
}

function MessageBubble({ msg, onSelectDestination }) {
  const destinations = msg.role === 'assistant' ? parseDestinations(msg.content) : [];
  const displayText = msg.role === 'assistant' ? cleanText(msg.content) : msg.content;

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gm, '<li style="margin:3px 0;margin-left:16px">$1</li>')
      .replace(/\n\n/g, '</p><p style="margin:6px 0">')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="fade-in" style={{
      display: 'flex',
      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-end',
      gap: '8px',
      marginBottom: '12px',
    }}>
      {msg.role === 'assistant' && (
        <div style={{
          width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
          background: 'linear-gradient(135deg,#f7971e,#ffd200)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
        }}>✈️</div>
      )}
      <div style={{ maxWidth: msg.role === 'user' ? '75%' : '100%', flex: msg.role === 'assistant' ? 1 : 'unset' }}>
        {displayText && (
          <div style={{
            padding: '12px 16px',
            borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
            background: msg.role === 'user'
              ? 'linear-gradient(135deg,#f7971e,#ffd200)'
              : 'rgba(255,255,255,0.07)',
            border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
            color: msg.role === 'user' ? '#1a1a1a' : '#e8f4f8',
            fontSize: '14px', lineHeight: '1.65',
            marginBottom: destinations.length > 0 ? '16px' : 0,
          }}
            dangerouslySetInnerHTML={{ __html: formatText(displayText) }}
          />
        )}
        {destinations.map(dest => (
          <DestinationCard key={dest.name} data={dest} onSelect={onSelectDestination} />
        ))}
      </div>
    </div>
  );
}

const QUICK_PROMPTS = [
  "🏖️ I need a beach holiday",
  "🏔️ Adventure & hiking trip",
  "🏛️ Culture & history",
  "🌃 City break",
  "💑 Romantic getaway",
  "👨‍👩‍👧 Family holiday with kids",
];

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "✈️ **Welcome to Wandr!**\n\nI'm your personal AI travel planner. Tell me what kind of holiday you're dreaming of and I'll find your perfect destination — with real hotels, things to do, restaurants and booking links.\n\nWhat kind of adventure are you after? 🌍",
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                fullText += data.text;
                setMessages(prev => [
                  ...prev.slice(0, -1),
                  { role: 'assistant', content: fullText },
                ]);
              }
            } catch {}
          }
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Something went wrong. Please try again.' }]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  const handleSelectDestination = (dest) => {
    sendMessage(`I love the look of ${dest.name}! Can you build me a full day-by-day itinerary for this destination?`);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      {/* Header */}
      <div style={{
        width: '100%', maxWidth: '800px',
        padding: '20px 20px 10px',
        display: 'flex', alignItems: 'center', gap: '12px',
        position: 'sticky', top: 0, zIndex: 10,
        background: 'linear-gradient(180deg,rgba(15,32,39,0.95) 0%,transparent 100%)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
          background: 'linear-gradient(135deg,#f7971e,#ffd200)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
        }}>✈️</div>
        <div>
          <div style={{ color: '#fff', fontWeight: '800', fontSize: '20px', letterSpacing: '-0.5px' }}>Wandr</div>
          <div style={{ color: '#7ec8e3', fontSize: '12px' }}>AI Holiday Planner</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, width: '100%', maxWidth: '800px',
        padding: '0 16px 100px',
        overflowY: 'auto',
      }}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} onSelectDestination={handleSelectDestination} />
        ))}

        {loading && (
          <div className="fade-in" style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'linear-gradient(135deg,#f7971e,#ffd200)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
            }}>✈️</div>
            <div style={{
              padding: '14px 18px', borderRadius: '4px 18px 18px 18px',
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', gap: '5px', alignItems: 'center',
            }}>
              {[0,1,2].map(n => (
                <div key={n} style={{
                  width: '7px', height: '7px', borderRadius: '50%', background: '#ffd200',
                  animation: `bounce 1.2s ease-in-out ${n * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Quick prompts */}
        {messages.length === 1 && !loading && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px', justifyContent: 'center' }}>
            {QUICK_PROMPTS.map(p => (
              <button key={p} onClick={() => sendMessage(p)} style={{
                padding: '10px 16px', borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.07)', color: '#e8f4f8',
                fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(247,151,30,0.2)'; e.currentTarget.style.borderColor = 'rgba(247,151,30,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              >{p}</button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        padding: '12px 16px 24px',
        background: 'linear-gradient(0deg,rgba(15,32,39,1) 0%,transparent 100%)',
      }}>
        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Tell me your dream holiday..."
            rows={1}
            style={{
              flex: 1, padding: '14px 18px', borderRadius: '18px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
              color: '#fff', fontSize: '15px', resize: 'none', outline: 'none',
              lineHeight: '1.5', fontFamily: 'inherit', maxHeight: '120px',
            }}
            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: '48px', height: '48px', borderRadius: '16px', border: 'none', flexShrink: 0,
              background: input.trim() && !loading ? 'linear-gradient(135deg,#f7971e,#ffd200)' : 'rgba(255,255,255,0.1)',
              color: input.trim() && !loading ? '#1a1a1a' : '#555',
              fontSize: '20px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >→</button>
        </div>
      </div>

      <style>{`
        textarea::placeholder { color: rgba(255,255,255,0.3); }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>
    </div>
  );
}
