/**
 * UNIVA OS AI SERVICE — GROK POWERED
 * Structured, role-based multi-task prompt pipeline.
 * API key loaded securely from .env (VITE_XAI_API_KEY)
 */

const API_KEY = import.meta.env.VITE_XAI_API_KEY || '';
const MODEL = import.meta.env.VITE_AI_MODEL || 'grok-3-latest';
const BASE_URL = 'https://api.x.ai/v1/chat/completions';

const SYSTEM_PROMPT =
  'You are an expert AI assistant embedded in UNIVA OS, an AI productivity operating system. ' +
  'You help users plan tasks, summarize content, write essays, do research, edit documents, and humanize AI-generated text. ' +
  'Always respond in a clear, useful, and natural human tone. Avoid robotic phrasing. Be concise but complete.';

export type AIResponse = {
  content: string;
  status: 'success' | 'error';
};

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

async function callGrok(messages: ChatMessage[]): Promise<AIResponse> {
  if (!API_KEY) {
    return { content: '⚠️ AI not configured. Add VITE_XAI_API_KEY to your .env file.', status: 'error' };
  }

  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const err = await res.text();

      if (err.includes('credits') || err.includes('license')) {
        // Known billing error — no credits on the team account. Handled gracefully.
        console.warn('[AI SERVICE] No credits/licenses on Grok account. Purchase at https://console.x.ai');
        return { 
          content: '💡 Your Grok account team has no credits or licenses. Please purchase them on the x.ai console to enable AI features.', 
          status: 'error' 
        };
      }

      console.error('[AI SERVICE] API Error:', err);
      return { content: `API Error: ${res.status}. Check your API key and billing status.`, status: 'error' };
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || 'No response from AI.';
    return { content, status: 'success' };
  } catch (e: any) {
    console.error('[AI SERVICE] Network error:', e);
    return { content: 'Network error. Make sure you are connected to the internet.', status: 'error' };
  }
}

export const aiService = {
  /** General chat — passes full conversation history for context */
  async chat(history: ChatMessage[], userMessage: string): Promise<AIResponse> {
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: userMessage },
    ];
    return callGrok(messages);
  },

  /** Summarize a task or text into 5-8 bullet points */
  async summarize(text: string): Promise<AIResponse> {
    return callGrok([
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `TASK: Summarize the following text.\n\nINPUT:\n${text}\n\nREQUIREMENTS:\n- Extract key points only\n- Use bullet points\n- Keep it concise\n\nOUTPUT FORMAT:\n- 5–8 bullet points`,
      },
    ]);
  },

  /** Break a goal/task into clear actionable sub-steps */
  async breakDown(task: string): Promise<AIResponse> {
    return callGrok([
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `TASK: Break down the following goal into actionable steps with timelines.\n\nGOAL:\n${task}\n\nOUTPUT FORMAT:\n### Action Plan\n- Step 1: ...\n- Step 2: ...\n(etc, with priority and time estimate)`,
      },
    ]);
  },

  /** Humanize AI-generated text */
  async humanize(text: string): Promise<AIResponse> {
    return callGrok([
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `TASK: Rewrite the following text to sound natural and human-written.\n\nINPUT:\n${text}\n\nREQUIREMENTS:\n- Remove robotic/AI tone\n- Use simple, natural language\n- Maintain meaning\n- Vary sentence structure\n\nOUTPUT FORMAT:\n- Clean paragraph`,
      },
    ]);
  },

  /** Write a full essay or document draft */
  async writeEssay(topic: string): Promise<AIResponse> {
    return callGrok([
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `TASK: Write a well-structured essay on the following topic.\n\nTOPIC:\n${topic}\n\nOUTPUT FORMAT:\n### Introduction\n...\n### Body\n...\n### Conclusion\n...`,
      },
    ]);
  },

  /** Research a topic and return structured insights */
  async research(topic: string): Promise<AIResponse> {
    return callGrok([
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `TASK: Research and explain the following topic clearly.\n\nTOPIC:\n${topic}\n\nOUTPUT FORMAT:\n### Overview\n...\n### Key Facts\n- ...\n### Insights\n- ...`,
      },
    ]);
  },

  /** Improve/edit a piece of text for clarity */
  async improve(text: string): Promise<AIResponse> {
    return callGrok([
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `TASK: Improve the following text for clarity, tone, and grammar.\n\nINPUT:\n${text}\n\nOUTPUT FORMAT:\nImproved version only, clean and professional.`,
      },
    ]);
  },
  /** Multi-task AI prompt (optimized) — Combines summarize, humanize, and insights */
  async multiTaskAnalyze(text: string): Promise<AIResponse> {
    return callGrok([
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `TASK: Perform a deep analysis on the following input.\n\nINPUT:\n${text}\n\nREQUIREMENTS:\n1. Summarize the content concisely.\n2. Create a humanized version (natural tone).\n3. Extract 3 key research insights.\n\nOUTPUT FORMAT:\n### Summary\n...\n### Humanized Version\n...\n### Insights\n1. ...\n2. ...\n3. ...`,
      },
    ]);
  },
};
