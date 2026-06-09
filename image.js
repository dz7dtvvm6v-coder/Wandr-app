export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'No query' });

  // Using Unsplash source for free images - no API key needed
  // Returns a redirect to a relevant image
  const encodedQuery = encodeURIComponent(query);
  const imageUrl = `https://source.unsplash.com/800x600/?${encodedQuery}`;
  
  res.status(200).json({ url: imageUrl });
}
