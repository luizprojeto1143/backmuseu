import axios from "axios";
import { AppDataSource } from "../utils/data-source";
import { Tenant } from "../entities/Tenant";

function getProvider(): string {
  return process.env.AI_PROVIDER || "openai";
}

async function callAI(prompt: string): Promise<string> {
  const provider = getProvider();

  if (!process.env.OPENAI_API_KEY) {
    return "A experiência com IA ainda não está ativada neste museu. Em breve teremos um guia virtual inteligente! 😉";
  }

  if (provider === "openai") {
    const key = process.env.OPENAI_API_KEY!;
    const resp = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: { Authorization: `Bearer ${key}` },
      }
    );
    const text = resp.data?.choices?.[0]?.message?.content ?? "";
    return text.trim();
  }

  throw new Error("AI provider não suportado no momento.");
}

export async function aiGenerateSmartDescription(params: {
  tenantId?: string;
  artworkName: string;
  context: string;
}) {
  const { tenantId, artworkName, context } = params;

  let personaInstruction = "";
  if (tenantId) {
    const repo = AppDataSource.getRepository(Tenant);
    const tenant = await repo.findOne({ where: { id: tenantId } });
    personaInstruction = tenant?.persona_config?.systemInstruction || "";
  }

  const prompt = `
Você é um guia cultural de um espaço chamado "${context}".
${personaInstruction}

Explique de forma envolvente (em português do Brasil) a obra/ponto:
"${artworkName}"

Use 1 ou 2 parágrafos, com curiosidades e contexto histórico/cultural.
Se não tiver detalhes específicos, faça uma explicação genérica, mas interessante.
`;

  return await callAI(prompt);
}

export async function aiChatWithGuide(params: {
  tenantId: string;
  history: { role: "user" | "model"; text: string }[];
  message: string;
  knownPointsTitles?: string[];
}) {
  const { tenantId, history, message, knownPointsTitles = [] } = params;

  const tenantRepo = AppDataSource.getRepository(Tenant);
  const tenant = await tenantRepo.findOne({ where: { id: tenantId } });

  const persona = tenant?.persona_config || {};
  const systemInstruction =
    persona.systemInstruction ||
    `
Você é um guia virtual amigável, que explica de maneira clara, acolhedora e acessível.
Responda sempre em português do Brasil.
`;

  const historyText = history
    .map((h) => `${h.role === "user" ? "Visitante" : "Guia"}: ${h.text}`)
    .join("\n");

  const pointsText = knownPointsTitles.length
    ? `Pontos conhecidos neste local: ${knownPointsTitles.join(", ")}.`
    : "";

  const prompt = `
${systemInstruction}

Local: ${tenant?.name || "espaço cultural"}.
${pointsText}

Histórico da conversa:
${historyText}

Nova mensagem do visitante:
${message}

Responda como um guia, de forma simpática, contextualizando com a cultura/local.
Convide o visitante a explorar outras obras/trilhas/eventos.
`;

  return await callAI(prompt);
}

export async function aiGenerateSouvenir(params: {
  userName: string;
  visitedTitles: string[];
  tenantName: string;
}) {
  const { userName, visitedTitles, tenantName } = params;

  const prompt = `
Crie um texto de lembrança de visita, em primeira pessoa, em português do Brasil.

Visitante: ${userName}
Local: ${tenantName}
Pontos visitados: ${visitedTitles.join(", ")}

Formato:
- 1 parágrafo curto
- tom emocional, carinhoso
- parecendo um diário de viagem
- convide para voltar ao local.
`;

  return await callAI(prompt);
}
