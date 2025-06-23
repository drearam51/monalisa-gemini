import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ Habilitar CORS
app.use(cors());

// ✅ Parsear JSON
app.use(express.json());

// ✅ Configurar Gemini 1.5 Vision
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-vision-preview",
});

// ✅ Endpoint de análisis
app.post("/api/analyze", async (req, res) => {
  try {
    const image = req.body.image;

    if (!image) {
      return res.status(400).json({ error: "No se envió ninguna imagen" });
    }

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: image.split(",")[1],
        },
      },
      {
        text: `Describe este rostro como si fueras Leonardo da Vinci en una carta del año 1505. Usa un lenguaje poético y renacentista, como si observaras su alma a través del pincel.`,
      },
    ]);

    const response = await result.response;
    const text = response.text();
    res.json({ description: text });
  } catch (error) {
    console.error("❌ Error analizando la imagen:", error);
    res.status(500).json({ error: "Error analizando la imagen" });
  }
});

// ✅ Ruta de prueba
app.get("/", (_, res) => {
  res.send("✅ Backend de La Gioconda está vivo.");
});

app.listen(port, () => {
  console.log(`Servidor activo en http://localhost:${port}`);
});
