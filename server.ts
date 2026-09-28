import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // Gemini AI Resume Optimizer / Grounding Endpoint
  app.post('/api/optimize-resume', async (req, res) => {
    try {
      const { jobDescription, currentResume } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({ error: 'GEMINI_API_KEY is not configured in environment.' });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are an expert ATS Resume Optimizer and Career Coach (Resume Grounding Expert). 
Analyze the candidate's current resume against the provided Job Description.

Candidate Current Resume:
${JSON.stringify(currentResume, null, 2)}

Target Job Description:
${jobDescription}

Provide a JSON response with:
1. "atsScore": a number between 65 and 98 representing compatibility score.
2. "optimizedSummary": a powerful, highly tailored professional summary tuned specifically to match keywords in the job description.
3. "matchedKeywords": array of 5-8 matching keywords found or added.
4. "missingKeywords": array of 3-5 recommended keywords to include.
5. "tailoredBulletPoints": array of 3 enhanced experience bullet points tailored for this job role.

Return ONLY valid JSON matching this schema:
{
  "atsScore": number,
  "optimizedSummary": string,
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "tailoredBulletPoints": string[]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      // Clean markdown code blocks if any
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleaned);

      res.json(result);
    } catch (err: any) {
      console.error('Gemini Optimization Error:', err);
      res.status(500).json({ error: err.message || 'Failed to optimize resume with AI.' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
