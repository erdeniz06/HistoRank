import express, { type Request, type Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const rawPort = process.env.DEFAULT_APP_PORT || process.env.PORT || '3000';
const PORT = rawPort === '8080' ? 3000 : Number(rawPort) || 3000;

app.use(express.json());

// API route for AI Historical Critique
app.post('/api/historical-critique', async (req: Request, res: Response) => {
  const { leaderName, scores, userNotes } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Provide a smart historical commentary fallback
    return res.json({
      critique: `Historians avoid one-dimensional judgments when evaluating "${leaderName}". The tension between military prowess (${scores.military}/100) and institutional/legal legacy (${scores.societal}/100) must be read through the geopolitical crises of their era. Your assigned scores reflect the historical balance between this leader's pragmatic use of power and visionary reforms.`,
      source: 'offline-scholar'
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are an objective, analytical, and distinguished professor of history. A user rated the historical figure "${leaderName}" from 0 to 100 across these 6 dimensions:
- Military & Strategic Genius: ${scores.military}/100
- Economy & Prosperity Management: ${scores.economy}/100
- Societal & Legal Reform: ${scores.societal}/100
- Diplomacy & Geopolitics: ${scores.diplomacy}/100
- Leadership & Crisis Management: ${scores.leadership}/100
- Historical Legacy & Durability: ${scores.legacy}/100
${userNotes ? `User's personal note: "${userNotes}"` : ''}

Please provide an insightful 3-4 paragraph historical analysis in English:
1. Where do the user's ratings align with or diverge from mainstream historical scholarship?
2. What were this figure's greatest strengths and most contentious controversies?
3. What was their defining turning point in world or national history?
Use a crisp, scholarly, and engaging tone with clear structure.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || 'Unable to generate historical analysis.';
    return res.json({ critique: text, source: 'gemini' });
  } catch (error: any) {
    console.error('Gemini error:', error);
    return res.json({
      critique: `The user ratings for "${leaderName}" (${scores.military} military, ${scores.economy} economy, ${scores.societal} reform) parallel the central debates in modern historiography. Their decisions under crisis continue to be studied as key case studies in political science.`,
      source: 'fallback'
    });
  }
});

// Start Express immediately so port 3000 is open without waiting for Vite initialization
function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const viteReady = import('vite').then(({ createServer: createViteServer }) =>
      createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      })
    );

    app.use(async (req, res, next) => {
      try {
        const vite = await viteReady;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
