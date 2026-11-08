import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route for AI Historical Critique
app.post('/api/historical-critique', async (req: Request, res: Response) => {
  const { leaderName, scores, userNotes } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Provide a smart historical commentary fallback
    return res.json({
      critique: `Tarihçiler "${leaderName}" figürünü değerlendirirken tek boyutlu yargılardan kaçınırlar. Askeri deha (${scores.military}/100) ile kurumsal/hukuki miras (${scores.societal}/100) arasındaki gerilim, liderin yaşadığı çağın jeopolitik krizleri ışığında okunmalıdır. Belirlediğiniz puanlar, bu liderin pragmatik güç kullanımı ile vizyoner reformları arasındaki tarihi dengeyi yansıtmaktadır.`,
      source: 'offline-scholar'
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Sen tarafsız, analitik ve saygın bir tarih profesörüsün. Kullanıcı "${leaderName}" adlı tarihi lideri şu 6 boyutta 0-100 arasında puanladı:
- Askeri & Stratejik Deha: ${scores.military}/100
- Ekonomi & Refah Yönetimi: ${scores.economy}/100
- Toplumsal & Hukuki Reform: ${scores.societal}/100
- Diplomasi & Jeopolitik: ${scores.diplomacy}/100
- Liderlik & Kriz İdaresi: ${scores.leadership}/100
- Tarihsel Miras & Kalıcılık: ${scores.legacy}/100
${userNotes ? `Kullanıcının özel notu: "${userNotes}"` : ''}

Lütfen Türkçe olarak yaklaşık 3-4 paragraflık derinlemesine bir tarihsel analiz sun:
1. Kullanıcının puanlarının tarihsel akademik mutabakat ile örtüşen ve ayrışan yönleri nelerdir?
2. Bu liderin en güçlü ve en tartışmalı yönleri neydi?
3. Dünya veya kendi ulusal tarihindeki dönüm noktası nedir?
Akıcı, edebi ve analitik bir üslup kullan. Başlık veya markdown hiyerarşisiyle okunaklı sun.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || 'Analiz oluşturulamadı.';
    return res.json({ critique: text, source: 'gemini' });
  } catch (error: any) {
    console.error('Gemini error:', error);
    return res.json({
      critique: `"${leaderName}" için kullanıcı puanlaması (${scores.military} askeri, ${scores.economy} ekonomi, ${scores.societal} reform) tarihsel yazındaki ana tartışma odaklarıyla paralellik taşımaktadır. Liderin kriz anlarındaki kararları modern siyaset biliminde halen vaka analizi olarak incelenmektedir.`,
      source: 'fallback'
    });
  }
});

// Mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
