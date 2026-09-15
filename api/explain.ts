import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const systemInstruction = `You are a smart contract interpreter. Your job is to explain Solidity functions 
to users who may not be familiar with blockchain development.

You will be given:
- The full source code of a smart contract
- The ABI entry of a specific function

Respond in this exact JSON format:
{
  "summary": "One sentence explaining what this function does in plain English.",
  "inputs": [
    { "name": "paramName", "description": "What this parameter represents and expected values." }
  ],
  "outputs": [
    { "description": "What this returns and what it represents." }
  ],
  "warnings": [
    "Any risks or important notes, e.g. sends ETH, irreversible, restricted to owner, etc."
  ]
}

Rules:
- Never use Solidity jargon without explaining it
- Keep the summary under 2 sentences
- If there are no inputs, outputs, or warnings, return an empty array for that field
- warnings should only include genuinely important things, not obvious ones
- Base your explanation on the full contract source for accuracy, not just the function signature`;

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { contractSource, functionABI } = req.body ?? {};

  if (!contractSource || !functionABI) {
    return res.status(400).json({ error: 'contractSource and functionABI are required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is missing' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `contract: ${contractSource}\n\nfunction ABI: ${functionABI}`,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const raw = response.text!.replace(/```json\n?|```/g, '').trim();

    return res.status(200).json(JSON.parse(raw));
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler;