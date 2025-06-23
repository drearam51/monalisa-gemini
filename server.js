import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Modelo actualizado
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

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
          data: image.replace(/^data:image\/\w+;base64,/, ""), // separamos el base64 del encabezado
        },
      },
      {
        text: `Describe este rostro como si fueras Leonardo da Vinci en una carta del año 1505. Usa un lenguaje poético y renacentista, como si observaras su alma a través del pincel.`,
      },
    ]);

    const response = await result.response;
    const text = await response.text();
    console.log("🖋️ Descripción generada:", text);
    res.json({ description: text });
  } catch (error) {
    console.error("❌ Error analizando la imagen:", error);
    res.status(500).json({ error: "Error analizando la imagen" });
  }
});

// Ruta de prueba (opcional)
app.get("/", (_, res) => {
  res.send("Servidor de La Gioconda está vivo.");
});

app.listen(port, () => {
  console.log(`✅ Servidor activo en http://localhost:${port}`);
});
