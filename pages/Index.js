import { useState, useRef, useEffect } from 'react';

function parseDestinations(text) {
  const destinations = [];
  const regex = /<destination>([\s\S]*?)<\/destination>/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    try {
      destinations.push(JSON.parse(match[1].trim()));
    } catch (e) {}
  }
  return destinations;
}

function cleanText(text) {
  return text.replace(/<destination>[\s\S]*?<\/destination>/g, '').trim();
}

function ImageCard({ query, style }) {
  const [loaded, setLoaded] = useState(false);
  const src = `https://source.unsplash.com/800x500/?${encodeURIComponent(query)}`;
  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {!loaded && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)' }} />}
      <img src={src} alt={query} onLoad={() => setLoaded(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }} />
    </div>
  );
}

function HotelCard({ hotel }) {
  const url = `https://www.booking.com/search.html?ss=${encodeURIComponent(hotel.booking_search)}&utm_source=wandr`;
  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
      <ImageCard query={hotel.unsplash_query} style={{ height: '140px' }} />
      <div style={{ padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{hotel.name}</div>
          <div style={{ color: '#ffd200', fontWeight: '700', fontSize: '13px' }}>{hotel.price_per_night}/night</div>
        </div>
        <div style={{ color: '#ffd200', fontSize: '12px' }}>{'★'.repeat(hotel.stars)}{'☆'.repeat(5-hotel.stars)}</div>
        <div style={{ color: '#7ec8e3', fontSize: '11px', margin: '2px 0 6px' }}>{hotel.type}</div>
        <div style={{ color: '#b0cfe0', fontSize: '12px', lineHeight: '1.4', marginBottom: '10px' }}>{hotel.description}</div>
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', padding: '8px', background: 'linear-gradient(135deg,#003580,#0066cc)', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}>
          View on Booking.com →
        </a>
      </div>
    </div>
  );
}

function ActivityCard({ activity }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
      <ImageCard query={activity.unsplash_query} style={{ height: '120px' }} />
      <div style={{ padding: '10px' }}>
        <div style={{ color: '#fff', fontWeight: '600', fontSize: '13px', marginBottom: '2px' }}>{activity.name}</div>
        <div style={{ color: '#ffd200', fontSize: '11px', marginBottom: '4px' }}>{activity.type} · {activity.duration} · {activity.price}</div>
        <div style={{ color: '#b0cfe0', fontSize: '12px', lineHeight: '1.4' }}>{activity.description}</div>
      </div>
    </div>
  );
}

function RestaurantCard({ restaurant }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
      <ImageCard query={restaurant.unsplash_query} style={{ height: '100px' }} />
      <div style={{ padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <div style={{ color: '#fff', fontWeight: '600', fontSize: '13px' }}>{restaurant.name}</div>
          <div style={{ color: '#ffd200', fontSize: '13px' }}>{restaurant.price_range}</div>
        </div>
        <div style={{ color: '#7ec8e3', fontSize: '11px', marginBottom: '4px' }}>{restaurant.type}</div>
        <div style={{ color: '#b0cfe0', fontSize: '12px', lineHeight: '1.4' }}>{restaurant.description}</div>
      </div>
    </div>
  );
}

function DestinationCard({ data, onSelect }) {
  const [tab, setTab] = useState('overview');
  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(data.booking_search)}&utm_source=wandr`;
  const airbnbUrl = `https://www.airbnb.co.uk/s/${encodeURIComponent(data.airbnb_search)}/homes`;
  return (
    <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', overflow: 'hidden', marginBottom: '16px' }}>
      <div style={{ position: 'relative', height: '220px' }}>
        <ImageCard query={data.unsplash_query} style={{ height: '220px' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
          <div style={{ fontSize: '28px' }}>{data.emoji}</div>
          <div style={{ color: '#fff', fontWeight: '800', fontSize: '22px' }}>{data.name}</div>
          <div style={{ color: '#ffd200', fontSize: '13px' }}>{data.tagline}</div>
        </div>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {[{ icon: '✈️', text: data.flight_from_uk }, { icon: '📅', text: data.best_time }, { icon: '💰', text: data.budget_per_person }].map(item => (
            <div key={item.text} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '20px', padding: '5px 11px', fontSize: '12px', color: '#e8f4f8' }}>{item.icon} {item.text}</div>
          ))}
        </div>
        <p style={{ color: '#b0cfe0', fontSize: '14px', lineHeight: '1.6', marginBottom: '14px' }}>{data.why}</p>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['overview','hotels','activities','food'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '7px 14px', borderRadius: '20px', border: 'none', background: tab === t ? 'linear-gradient(135deg,#f7971e,#ffd200)' : 'rgba(255,255,255,0.08)', color: tab === t ? '#1a1a1a' : '#b0cfe0', fontSize: '12px', fontWeight: tab === t ? '700' : '400', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {t === 'food' ? '🍽️ Food' : t === 'hotels' ? '🏨 Stay' : t === 'activities' ? '🎯 Do' : '📋 Overview'}
            </button>
          ))}
        </div>
        {tab === 'overview' && (
          <div>
            <div style={{ background: 'rgba(247,151,30,0.1)', border: '1px solid rgba(247,151,30,0.25)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
              <div style={{ color: '#ffd200', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>💎 HIDDEN GEM TIP</div>
              <p style={{ color: '#e8f4f8', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{data.hidden_gem}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'block', textAlign: 'center', padding: '12px', background: 'linear-gradient(135deg,#003580,#0066cc)', borderRadius: '12px', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>🏨 Booking.com</a>
              <a href={airbnbUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'block', textAlign: 'center', padding: '12px', background: 'linear-gradient(135deg,#ff5a5f,#ff385c)', borderRadius: '12px', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>🏠 Airbnb</a>
            </div>
          </div>
        )}
        {tab === 'hotels' && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '12px' }}>{data.hotels.map(h => <HotelCard key={h.name} hotel={h} />)}</div>}
        {tab === 'activities' && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '12px' }}>{data.activities.map(a => <ActivityCard key={a.name} activity={a} />)}</div>}
        {tab === 'food' && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '12px' }}>{data.restaurants.map(r => <RestaurantCard key={r.name} restaurant={r} />)}</div>}
        <button onClick={() => onSelect(data)} style={{ width: '100%', marginTop: '16px', padding: '14px', background: 'linear-gradient(135deg,#f7971e,#ffd200)', border: 'none', borderRadius: '12px', color: '#1a1a1a', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
          ✈️ Plan my trip to {data.name.split(',')[0]} →
        </button>
      </div>
    </div>
  );
}

function MessageBubble({ msg, onSelectDestination }) {
  const destinations = msg.role === 'assistant' ? parseDestinations(msg.content) : [];
  const displayText = msg.role === 'assistant' ? cleanText(msg.content) : msg.content;
  const formatText = (text) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n\n/g, '</p><p style="margin:6px 0">').replace(/\n/g, '<br/>');
  return (
    <div style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '8px', marginBottom: '12px' }}>
      {msg.role === 'assistant' && (
        <div style={{ width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0, background: 'linear-gradient(135deg,#f7971e,#ffd200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>✈️</div>
      )}
      <div style={{ maxWidth: msg.role === 'user' ? '75%' : '100%', flex: msg.role === 'assistant' ? 1 : 'unset' }}>
        {displayText && (
          <div style={{ padding: '12px 16px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px', background: msg.role === 'user' ? 'linear-gradient(135deg,#f7971e,#ffd200)' : 'rgba(255,255,255,0.07)', border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)', color: msg.role === 'user' ? '#1a1a1a' : '#e8f4f8', fontSize: '14px', lineHeight: '1.65', marginBottom: destinations.length > 0 ? '16px' : 0 }}
            dangerouslySetInnerHTML={{ __html: formatText(displayText) }} />
        )}
        {destinations.map(dest => <DestinationCard key={dest.name} data={dest} onSelect={onSelectDestination} />)}
      </div>
    </div>
  );
}

const QUICK_PROMPTS = ['🏖️ Beach holiday', '🏔️ Adventure & hiking', '🏛 Culture & history', '🌃 City break', '💑 Romantic getaway', '👨‍👩‍👧 Family holiday'];

export default function Home() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "✈️ **Welcome to Wandr!**\n\nI'm your personal AI travel planner. Tell me what kind of holiday you're dreaming of and I'll find your perfect destination — with real hotels, activities, restaurants and booking links.\n\nWhat kind of adventure are you after? 🌍" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }) });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try { const data = JSON.parse(line.slice(6)); if (data.text) { fullText += data.text; setMessages(prev => [...prev.slice(0,-1), { role: 'assistant', content: fullText }]); } } catch {}
          }
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Something went wrong. Please try again.' }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '800px', padding: '20px 20px 10px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(10px)', background: 'linear-gradient(180deg,rgba(15,32,39,0.95) 0%,transparent 100%)' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#f7971e,#ffd200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>✈️</div>
        <div>
          <div style={{ color: '#fff', fontWeight: '800', fontSize: '20px' }}>Wandr</div>
          <div style={{ color: '#7ec8e3', fontSize: '12px' }}>AI Holiday Planner</div>
        </div>
      </div>
      <div style={{ flex: 1, width: '100%', maxWidth: '800px', padding: '0 16px 120px', overflowY: 'auto' }}>
        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} onSelectDestination={(dest) => sendMessage(`I love ${dest.name}! Can you build me a full day-by-day itinerary?`)} />)}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg,#f7971e,#ffd200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>✈️</div>
            <div style={{ padding: '14px 18px', borderRadius: '4px 18px 18px 18px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '5px' }}>
              {[0,1,2].map(n => <div key={n} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ffd200', animation: `bounce 1.2s ease-in-out ${n*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        {messages.length === 1 && !loading && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px', justifyContent: 'center' }}>
            {QUICK_PROMPTS.map(p => (
              <button key={p} onClick={() => sendMessage(p)} style={{ padding: '10px 16px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.07)', color: '#e8f4f8', fontSize: '14px', cursor: 'pointer' }}>{p}</button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '12px 16px 24px', background: 'linear-gradient(0deg,rgba(15,32,39,1) 0%,transparent 100%)' }}>
        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Tell me your dream holiday..." rows={1} style={{ flex: 1, padding: '14px 18px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '15px', resize: 'none', outline: 'none', lineHeight: '1.5', fontFamily: 'inherit' }} />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{ width: '48px', height: '48px', borderRadius: '16px', border: 'none', background: input.trim() && !loading ? 'linear-gradient(135deg,#f7971e,#ffd200)' : 'rgba(255,255,255,0.1)', color: input.trim() && !loading ? '#1a1a1a' : '#555', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</button>
        </div>
      </div>
      <style>{`textarea::placeholder{color:rgba(255,255,255,0.3)} @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
    </div>
  );
}
