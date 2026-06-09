import { useState } from 'react';

function StarRating({ stars }) {
  return (
    <span style={{ color: '#ffd200', fontSize: '13px' }}>
      {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
    </span>
  );
}

function ImageCard({ query, style }) {
  const [loaded, setLoaded] = useState(false);
  const encodedQuery = encodeURIComponent(query);
  const src = `https://source.unsplash.com/800x500/?${encodedQuery}`;

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }} />
      )}
      <img
        src={src}
        alt={query}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          opacity: loaded ? 1 : 0, transition: 'opacity 0.3s',
        }}
      />
    </div>
  );
}

function HotelCard({ hotel }) {
  const bookingUrl = `https://www.booking.com/search.html?ss=${encodeURIComponent(hotel.booking_search)}&utm_source=wandr`;
  
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(247,151,30,0.4)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
    >
      <ImageCard query={hotel.unsplash_query} style={{ height: '140px', borderRadius: 0 }} />
      <div style={{ padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
          <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{hotel.name}</div>
          <div style={{ color: '#ffd200', fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap', marginLeft: '8px' }}>{hotel.price_per_night}/night</div>
        </div>
        <StarRating stars={hotel.stars} />
        <div style={{ color: '#7ec8e3', fontSize: '11px', marginTop: '2px', marginBottom: '6px' }}>{hotel.type}</div>
        <div style={{ color: '#b0cfe0', fontSize: '12px', lineHeight: '1.4', marginBottom: '10px' }}>{hotel.description}</div>
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" style={{
          display: 'block', textAlign: 'center', padding: '8px',
          background: 'linear-gradient(135deg, #003580, #0066cc)',
          borderRadius: '8px', color: '#fff', textDecoration: 'none',
          fontSize: '12px', fontWeight: '600',
        }}>
          📖 View on Booking.com
        </a>
      </div>
    </div>
  );
}

function ActivityCard({ activity }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px', overflow: 'hidden',
    }}>
      <ImageCard query={activity.unsplash_query} style={{ height: '120px', borderRadius: 0 }} />
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
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px', overflow: 'hidden',
    }}>
      <ImageCard query={restaurant.unsplash_query} style={{ height: '100px', borderRadius: 0 }} />
      <div style={{ padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
          <div style={{ color: '#fff', fontWeight: '600', fontSize: '13px' }}>{restaurant.name}</div>
          <div style={{ color: '#ffd200', fontSize: '13px' }}>{restaurant.price_range}</div>
        </div>
        <div style={{ color: '#7ec8e3', fontSize: '11px', marginBottom: '4px' }}>{restaurant.type}</div>
        <div style={{ color: '#b0cfe0', fontSize: '12px', lineHeight: '1.4' }}>{restaurant.description}</div>
      </div>
    </div>
  );
}

export default function DestinationCard({ data, onSelect }) {
  const [tab, setTab] = useState('overview');
  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(data.booking_search)}&utm_source=wandr`;
  const airbnbUrl = `https://www.airbnb.co.uk/s/${encodeURIComponent(data.airbnb_search)}/homes`;

  const tabs = ['overview', 'hotels', 'activities', 'food'];

  return (
    <div className="fade-in" style={{
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '20px',
      overflow: 'hidden',
      marginBottom: '20px',
    }}>
      {/* Hero image */}
      <div style={{ position: 'relative', height: '220px' }}>
        <ImageCard query={data.unsplash_query} style={{ height: '220px', borderRadius: 0 }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
        }} />
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
          <div style={{ fontSize: '28px', marginBottom: '4px' }}>{data.emoji}</div>
          <div style={{ color: '#fff', fontWeight: '800', fontSize: '22px', lineHeight: '1.2' }}>{data.name}</div>
          <div style={{ color: '#ffd200', fontSize: '13px', marginTop: '2px' }}>{data.tagline}</div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Quick stats */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {[
            { icon: '✈️', text: data.flight_from_uk },
            { icon: '📅', text: data.best_time },
            { icon: '💰', text: data.budget_per_person },
          ].map(item => (
            <div key={item.text} style={{
              background: 'rgba(255,255,255,0.07)', borderRadius: '20px',
              padding: '5px 11px', fontSize: '12px', color: '#e8f4f8',
              display: 'flex', gap: '5px', alignItems: 'center',
            }}>
              <span>{item.icon}</span><span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Why this destination */}
        <p style={{ color: '#b0cfe0', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>{data.why}</p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '7px 14px', borderRadius: '20px', border: 'none',
              background: tab === t ? 'linear-gradient(135deg,#f7971e,#ffd200)' : 'rgba(255,255,255,0.08)',
              color: tab === t ? '#1a1a1a' : '#b0cfe0',
              fontSize: '12px', fontWeight: tab === t ? '700' : '400',
              cursor: 'pointer', whiteSpace: 'nowrap', textTransform: 'capitalize',
            }}>{t === 'food' ? '🍽️ Food' : t === 'hotels' ? '🏨 Stay' : t === 'activities' ? '🎯 Do' : '📋 Overview'}</button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && (
          <div>
            <div style={{
              background: 'rgba(247,151,30,0.1)', border: '1px solid rgba(247,151,30,0.25)',
              borderRadius: '12px', padding: '14px', marginBottom: '14px',
            }}>
              <div style={{ color: '#ffd200', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>💎 HIDDEN GEM TIP</div>
              <p style={{ color: '#e8f4f8', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{data.hidden_gem}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer" style={{
                flex: 1, display: 'block', textAlign: 'center', padding: '12px',
                background: 'linear-gradient(135deg,#003580,#0066cc)',
                borderRadius: '12px', color: '#fff', textDecoration: 'none',
                fontSize: '13px', fontWeight: '600',
              }}>🏨 Hotels on Booking.com</a>
              <a href={airbnbUrl} target="_blank" rel="noopener noreferrer" style={{
                flex: 1, display: 'block', textAlign: 'center', padding: '12px',
                background: 'linear-gradient(135deg,#ff5a5f,#ff385c)',
                borderRadius: '12px', color: '#fff', textDecoration: 'none',
                fontSize: '13px', fontWeight: '600',
              }}>🏠 Homes on Airbnb</a>
            </div>
          </div>
        )}

        {tab === 'hotels' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {data.hotels.map(h => <HotelCard key={h.name} hotel={h} />)}
          </div>
        )}

        {tab === 'activities' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {data.activities.map(a => <ActivityCard key={a.name} activity={a} />)}
          </div>
        )}

        {tab === 'food' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {data.restaurants.map(r => <RestaurantCard key={r.name} restaurant={r} />)}
          </div>
        )}

        {/* Pick this destination button */}
        <button onClick={() => onSelect(data)} style={{
          width: '100%', marginTop: '16px', padding: '14px',
          background: 'linear-gradient(135deg,#f7971e,#ffd200)',
          border: 'none', borderRadius: '12px',
          color: '#1a1a1a', fontWeight: '700', fontSize: '15px', cursor: 'pointer',
        }}>
          ✈️ Plan my trip to {data.name.split(',')[0]} →
        </button>
      </div>
    </div>
  );
}
