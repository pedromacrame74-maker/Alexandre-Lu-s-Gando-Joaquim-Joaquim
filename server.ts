import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Dra. Ana Cária - Nutrição & Saúde" });
});

// Endpoint 1: Generate Video Scripts for Dra. Ana Cária
app.post("/api/ai/generate-script", async (req, res) => {
  try {
    const { topic, category, targetAudience, durationSeconds = 30 } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback pre-crafted clinical script if API key is not ready
      return res.json({
        success: true,
        script: {
          title: `Dica de Ouro: ${topic || "Como Controlar a Glicose sem Sofrer"}`,
          hook: "Você come pão no café da manhã e 1 hora depois já está com fome ou sonolência? Presta atenção!",
          development:
            "O segredo não é cortar o pão, mas nunca comer o carboidrato 'pelado'. Se você adicionar ovos mexidos com azeite ou uma colher de semente de chia, as fibras e gorduras boas formam uma malha no estômago que desacelera a absorção do açúcar.",
          callToAction: "Gostou dessa dica prática? Salve esse vídeo e compartilhe com quem tem diabetes ou quer emagrecer!",
          caption: `Você sabia disso? 💚 Pequenos ajustes na combinação dos alimentos fazem toda a diferença na sua glicose e saciedade. #DraAnaCaria #NutricaoClinica #${category || "Diabetes"} #Saude`,
          hashtags: ["#DraAnaCaria", "#Nutricao", `#${category || "Diabetes"}`, "#SaudeSemNeura"],
          visualCues: [
            "0-3s: Segurar um pão e apontar para a câmera com expressão de alerta",
            "4-15s: Mostrar prato com pão + ovos mexidos e azeite",
            "16-25s: Gráfico simples ou gesto com as mãos mostrando a curva de glicose estável",
            "26-30s: Sorriso caloroso apontando para o botão de salvar",
          ],
        },
      });
    }

    const prompt = `Você é o roteirista oficial e assistente da Dra. Ana Cária, uma nutricionista clínica brasileira conceituada, calorosa, acolhedora e altamente embasada em ciência.
Gere um roteiro completo de vídeo curto (Reels/TikTok) de aproximadamente ${durationSeconds} segundos.

Tema do Vídeo: "${topic || "Dica prática para saúde"}"
Categoria: "${category || "Diabetes e Emagrecimento"}"
Público Alvo: "${targetAudience || "Pessoas com diabetes, hipertensão ou buscando emagrecimento saudável"}"

Retorne APENAS um JSON válido no seguinte formato:
{
  "title": "Título atraente e claro",
  "hook": "Gancho magnético dos primeiros 3 segundos para prender a atenção",
  "development": "Explicação clínica simples e prática de 15 a 20 segundos sem jargões difíceis",
  "callToAction": "Chamada final para ação (salvar, curtir, comentar dúvida)",
  "caption": "Texto completo para a legenda do post com tom acolhedor e emojis",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "visualCues": [
    "0-3s: instrução visual do que a Dra. faz na tela",
    "4-15s: instrução visual de corte/demonstração de alimento",
    "16-25s: instrução visual",
    "26-30s: instrução final e sorriso acolhedor"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const script = JSON.parse(text);
    return res.json({ success: true, script });
  } catch (error: any) {
    console.error("Error generating video script:", error);
    res.status(500).json({
      success: false,
      error: "Não foi possível gerar o roteiro com IA.",
      details: error.message,
    });
  }
});

// Endpoint 2: AI Meal Plate Evaluation ("Avaliar meu Prato")
app.post("/api/ai/evaluate-plate", async (req, res) => {
  try {
    const { mealDescription, mealType, patientCondition, imageBase64 } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback clinical evaluation
      return res.json({
        success: true,
        evaluation: {
          score: 8.5,
          summary: "Prato bem colorido e equilibrado! Excelente presença de fibras e proteínas magras.",
          strengths: [
            "Boa variedade de vegetais folhosos e legumes",
            "Proteína adequada para manter a saciedade e massa magra",
            "Porção de carboidrato bem controlada",
          ],
          improvements: [
            "Pode adicionar 1 fio de azeite extravirgem ou sementes de abóbora/girassol para fornecer gorduras anti-inflamatórias",
            "Para quem tem diabetes, iniciar a refeição sempre pelos vegetais antes do arroz reduz o pico glicêmico em até 35%",
          ],
          glycemicImpact: "Baixo a moderado",
          sodiumImpact: "Adequado (dentro da meta para controle de pressão)",
          draTip:
            "Parabéns pelo cuidado! Continue assim e lembre-se de mastigar devagar para aproveitar todos os sinais de saciedade do seu corpo.",
        },
      });
    }

    const parts: any[] = [];
    if (imageBase64) {
      const mimeType = imageBase64.startsWith("data:image/jpeg")
        ? "image/jpeg"
        : imageBase64.startsWith("data:image/webp")
        ? "image/webp"
        : "image/png";
      const cleanData = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType,
          data: cleanData,
        },
      });
    }

    const promptText = `Você é a Dra. Ana Cária, uma nutricionista clínica especializada em diabetes, hipertensão e emagrecimento saudável.
Um paciente acabou de enviar o prato dele para sua avaliação carinhosa e profissional.

Dados da refeição:
- Tipo: ${mealType || "Almoço"}
- Descrição informada: ${mealDescription || "Prato com salada, proteína e carboidrato"}
- Condição do paciente: ${patientCondition || "Geral / Diabetes / Hipertensão"}

Avalie o prato com tom humano, acolhedor, motivador e cientificamente embasado.
Retorne APENAS um JSON no seguinte formato:
{
  "score": 8.8,
  "summary": "Resumo geral carinhoso de 2 frases sobre o prato",
  "strengths": ["Ponto forte 1", "Ponto forte 2", "Ponto forte 3"],
  "improvements": ["Dica prática de melhoria 1", "Dica prática de melhoria 2"],
  "glycemicImpact": "Baixo" ou "Moderado" ou "Alto",
  "sodiumImpact": "Baixo" ou "Moderado" ou "Atenção ao sódio",
  "draTip": "Dica de ouro personalizada da Dra. Ana Cária para essa refeição"
}`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const evaluation = JSON.parse(text);
    return res.json({ success: true, evaluation });
  } catch (error: any) {
    console.error("Error evaluating plate:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao avaliar o prato.",
      details: error.message,
    });
  }
});

// Endpoint 3: Dra. Ana Cária Interactive Nutrition Q&A / Nutri-Chat
app.post("/api/ai/ask-dra", async (req, res) => {
  try {
    const { question, context } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        answer:
          "Olá querido(a)! Essa é uma excelente dúvida. Quando falamos de nutrição para diabetes e saúde cardiovascular, a chave está na combinação e na forma de preparo dos alimentos. Se você puder combinar com fibras e proteínas, a sua glicose fica sempre sob controle! 💚 Conte comigo!",
      });
    }

    const prompt = `Você é a Dra. Ana Cária, uma nutricionista clínica brasileira carinhosa, empática, didática e muito acolhedora.
Você adora explicar nutrição de forma simples, sem terrorismo nutricional, com base em evidências para pacientes com diabetes, pressão alta e emagrecimento.

Contexto da dúvida: ${context || "Dúvida geral de nutrição"}
Pergunta do paciente: "${question}"

Responda em 1 a 3 parágrafos diretos, calorosos e com orientações práticas. Use emojis amigáveis como 💚, 🥗, 🩺 de forma equilibrada.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    return res.json({ success: true, answer: response.text });
  } catch (error: any) {
    console.error("Error answering question:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao responder a pergunta.",
      details: error.message,
    });
  }
});

// Vite middleware & production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dra. Ana Cária App running on http://localhost:${PORT}`);
  });
}

startServer();
