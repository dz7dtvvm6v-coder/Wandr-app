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
            <div key={item.text} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '20px', padding: '5px 11px', fontSize: '12px', color: '#e8f4f8' }}>{item.icon} {item.
