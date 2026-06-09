export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      system: 'You are Wandr, a friendly holiday planning assistant. Help users find their perfect holiday destination. Ask about their preferences, budget, travel dates and group size. Then suggest 3 destinations with hotels, activities and restaurants. Be enthusiastic and use emojis.',
      messages,
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text || 'Sorry, something went wrong.';
  res.status(200).json({ text });
}
