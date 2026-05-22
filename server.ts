import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  app.post('/api/ai-assistant', async (req, res) => {
    try {
      const { goals } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(200).json({ 
          message: "Smart AI Assistant uchun GEMINI_API_KEY topilmadi. '.env' faylini sozlang." 
        });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `Sen professional moliyaviy maslahatchisan. Foydalanuvchining hozirgi maqsadlari quyidagilar:
      ${JSON.stringify(goals, null, 2)}
      
      Iltimos, foydalanuvchiga qanday qilib pulni yaxshiroq yig'ish, deadlinega ulgurish haqida qisqacha (max 3-4 gap) professional o'zbek tilida tavsiya ber. Bunga qo'shimcha tarzda qimmatbaho, realistik maslahatlar qo'sh. O'ta motivatsion bo'lmasin, matematik tahlil va aniqlikka asoslansin.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      return res.status(200).json({ message: response.text });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'AI tahlilida xatolik yuz berdi' });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

startServer();
