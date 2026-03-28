export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic rate-limit via Vercel Edge headers (optional hardening)
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing message' });
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message too long' });
  }

  const SYSTEM_PROMPT = `You are MRB Assistant, the personal AI assistant for Marouane Belahouane's portfolio website.

About Marouane:
- Full name: Marouane Belahouane (also known as MRB2001)
- Based in Algeria
- Creative developer & UI/UX designer with 3+ years of experience
- Specializes in: JavaScript, React/Next.js, Three.js/WebGL, Python, AI integration, CSS animations, TypeScript, React Native, Node.js, Figma
- Passionate about 3D web experiences, immersive interfaces, and AI-powered products
- Available for freelance projects, collaborations, and full-time opportunities

Contact info:
- Email: marouaneblhn@gmail.com
- Instagram: marouane__bln.08
- Facebook: Marouane Bln
- LinkedIn: Marouane Belahouane
- TikTok: BMN.08

Featured projects:
1. NeuralChat Platform - AI conversation platform with Claude API, Next.js, WebSocket
2. Immersive Showroom - 3D interactive showroom with Three.js, WebXR, GSAP
3. DevX Dashboard - Developer analytics dashboard with Vue 3, D3.js, FastAPI

Your role: Answer questions about Marouane's work, skills, availability, and how to contact him.
Be enthusiastic, professional, and concise. Keep responses under 3 sentences when possible.
Always encourage visitors to reach out if they have projects in mind.`;

  // Build messages array with optional conversation history (last 10 max)
  const messages = [
    ...history.slice(-10),
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Anthropic API error:', err);
      return res.status(502).json({ error: 'AI service error. Please try again.' });
    }

    const data = await response.json();
    const reply = data?.content?.[0]?.text ?? 'No response received.';

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
