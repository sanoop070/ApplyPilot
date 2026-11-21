import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

function formatUserFriendlyError(rawError: any): string {
  const msg = rawError?.message || String(rawError);
  try {
    const parsed = JSON.parse(msg);
    if (parsed.error?.code === 503 || parsed.code === 503) {
      return 'Google AI servers are currently experiencing temporary high traffic. Please retry in a few moments.';
    }
    if (parsed.error?.code === 429 || parsed.code === 429) {
      return 'API rate limit reached. Please wait a moment before parsing again.';
    }
    if (parsed.error?.message) {
      return parsed.error.message;
    }
  } catch {}

  if (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
    return 'Google AI servers are currently experiencing temporary high traffic. Please retry in a few moments.';
  }
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
    return 'API quota exceeded. Please wait a moment before trying again.';
  }
  return msg;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jdText, company } = body;

    if (!jdText || typeof jdText !== 'string' || !jdText.trim()) {
      return NextResponse.json(
        { error: 'Job description text (jdText) is required.' },
        { status: 400 }
      );
    }

    const rawApiKey = process.env.GEMINI_API_KEY;
    const apiKey = rawApiKey ? rawApiKey.replace(/^\[|\]$/g, '').trim() : '';
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(
        {
          error:
            'GEMINI_API_KEY is not configured. Please set your Gemini API key in frontend/.env.local',
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert AI technical recruiter and job match evaluator.
Analyze the following Job Description (JD) and evaluate it strictly against the candidate profile:
Candidate Profile: Engineering student skilled in Python, React, PyTorch, SQL, Data Engineering, and LLMs.

Job Description:
"""
${jdText.trim()}
"""
${company ? `User suggested company name: "${company}". Use this if applicable, otherwise extract the actual hiring company.` : ''}

Extract and evaluate:
1. company: The name of the hiring company. If unknown, use "Target Company".
2. role: The specific job title or role name.
3. location: The job location or geographic region (e.g. "San Francisco, CA", "Bengaluru, India", "Remote").
4. salary: Mentioned salary or compensation range (or a realistic market standard like "$110,000 - $140,000 / year" or "₹60,000 - ₹90,000 / month" or "Competitive").
5. mode: One of "Remote", "Hybrid", or "On-site".
6. score: An integer score strictly between 40 and 99 reflecting how strongly the candidate matches the requirements based on skills (Python, React, PyTorch, SQL, Data Engineering, and LLMs). Completely unrelated roles (e.g. Graphic Design, Chef, Marketing) must receive 40-55. Strong matches (e.g. AI/ML, Python backend, Data Engineering) must receive 85-98.
7. gaps: An array of exactly 2 to 3 concise, specific missing skills or requirements from the JD that the candidate does not have in their profile.
8. summary: Exactly 1 sentence summarizing the candidate's fit and reasoning for the assigned score.

Return strictly valid JSON adhering to the specified schema.`;

    const schemaConfig = {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          location: { type: Type.STRING },
          salary: { type: Type.STRING },
          mode: { type: Type.STRING },
          score: { type: Type.INTEGER },
          gaps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          summary: { type: Type.STRING },
        },
        required: [
          'company',
          'role',
          'location',
          'salary',
          'mode',
          'score',
          'gaps',
          'summary',
        ],
      },
    };

    let response: any = null;
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: schemaConfig,
        });
        if (response && response.text) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed, trying next fallback...:`, err?.message);
      }
    }

    if (!response || !response.text) {
      const friendlyMsg = formatUserFriendlyError(lastError);
      return NextResponse.json({ error: friendlyMsg }, { status: 503 });
    }

    const rawText = response.text.trim();
    let parsedData: any;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      const clean = rawText.replace(/```json\n?|```/g, '').trim();
      parsedData = JSON.parse(clean);
    }

    if (typeof parsedData.score === 'number') {
      parsedData.score = Math.max(40, Math.min(99, Math.round(parsedData.score)));
    } else {
      parsedData.score = 75;
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/parse-jd:', error);
    const friendlyMsg = formatUserFriendlyError(error);
    return NextResponse.json({ error: friendlyMsg }, { status: 500 });
  }
}
