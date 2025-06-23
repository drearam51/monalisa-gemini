import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

app.use(cors());

dotenv.config();
const app = express();
app.use(express.json({ limit: '10mb' }));

// Permitir servir index.html
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze', async (req, res) => {
  const { image } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent({
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: image,
            }
          },
          {
            text: `Eres Leonardo Da Vinci. Describe a la persona en esta imagen como si la estuvieras pintando en 1505. Sé poético, filosófico y profundo. Usa menos de 60 palabras.`
          }
        ]
      }]
    });

    const response = await result.response;
    res.json({ message: response.text() });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error analizando la imagen" });
  }
});

app.get("/", (_, res) => {
  res.send("✅ Backend de La Gioconda está vivo.");
});

app.listen(3000, () => {
  console.log("Servidor activo en http://localhost:3000");
});
