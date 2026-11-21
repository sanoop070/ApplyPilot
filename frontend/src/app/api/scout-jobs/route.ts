import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

interface ScoutedJob {
  title: string;
  company: string;
  location: string;
  url: string;
  score: number;
  reason: string;
}

function extractJsonArray(text: string): ScoutedJob[] {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    cleaned = cleaned.substring(firstBracket, lastBracket + 1);
  }

  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) {
    throw new Error('Model did not return a JSON array');
  }

  return parsed.map((item: any) => ({
    title: String(item.title || 'Software Engineer'),
    company: String(item.company || 'Tech Company'),
    location: String(item.location || 'Remote / Hybrid'),
    url: String(item.url || 'https://google.com/search?q=' + encodeURIComponent((item.title || '') + ' ' + (item.company || '') + ' careers')),
    score: Math.max(40, Math.min(99, Math.round(Number(item.score) || 75))),
    reason: String(item.reason || 'Candidate skills align with requirements.'),
  }));
}

function formatUserFriendlyError(rawError: any): string {
  const msg = rawError?.message || String(rawError);
  try {
    const parsed = JSON.parse(msg);
    if (parsed.error?.code === 503 || parsed.code === 503) {
      return 'Google AI servers are currently experiencing temporary high traffic. Please retry in a few moments.';
    }
    if (parsed.error?.code === 429 || parsed.code === 429) {
      return 'API rate limit reached. Please wait a moment before scouting again.';
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
    const roleQuery = (body.roleQuery || '').trim();
    const locationQuery = (body.locationQuery || '').trim();

    return await scoutJobs(roleQuery, locationQuery);
  } catch (error: any) {
    console.error('Error parsing POST body in /api/scout-jobs:', error);
    return NextResponse.json(
      { error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roleQuery = (searchParams.get('roleQuery') || '').trim();
  const locationQuery = (searchParams.get('locationQuery') || '').trim();

  return await scoutJobs(roleQuery, locationQuery);
}

async function scoutJobs(roleQuery: string, locationQuery: string) {
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

  const roleTarget = roleQuery || 'AI Engineer / Python Developer / Data Engineer';
  const locationTarget = locationQuery || 'Remote / Bengaluru / India';

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Find 4 to 6 real, active, currently open job listings or internships for:
Role: "${roleTarget}"
Location: "${locationTarget}"

Focus on active postings on company career portals, LinkedIn, Greenhouse, Lever, Indeed, Wellfound, or similar job boards.

Evaluate each opening against this candidate profile:
Candidate Profile: Engineering student skilled in Python, React, PyTorch, SQL, Data Engineering, and LLMs.

For each real opening found, extract and score them:
- title: Specific job title (e.g. "Junior Machine Learning Engineer", "Full Stack AI Developer")
- company: Company name (e.g. "Google", "Databricks", "Scale AI", "Microsoft")
- location: Specific location (e.g. "Bengaluru, India", "San Francisco, CA", "Remote")
- url: The real job application or career portal link
- score: Integer between 40 and 99 evaluating candidate match for Python, React, PyTorch, SQL, Data Engineering, and LLMs
- reason: Exactly 1 concise sentence explaining why this opening matches the candidate's profile and what makes them a fit.

Return ONLY a valid JSON array of objects. Do not include markdown code blocks or text outside the array.
Format:
[
  {
    "title": "Machine Learning Engineer Intern",
    "company": "Example AI",
    "location": "Bengaluru (Hybrid)",
    "url": "https://careers.example.com/job/123",
    "score": 93,
    "reason": "Strong match for candidate's PyTorch, Python, and LLM development experience."
  }
]`;

  let response: any = null;
  // Step 1: Attempt with Google Search grounding across flash models
  const groundingModels = ['gemini-3.8-flash', 'gemini-3.5-flash'];
  for (const model of groundingModels) {
    try {
      response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      if (response && response.text) break;
    } catch (groundingErr: any) {
      console.warn(`Search grounding with ${model} warning:`, groundingErr?.message);
    }
  }

  // Step 2: Fallback across high-availability models if search grounding had rate-limits or 503 demand
  if (!response || !response.text) {
    const fallbackModels = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];
    let lastErr: any = null;

    for (const model of fallbackModels) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: prompt + "\nOutput strictly the JSON array.",
        });
        if (response && response.text) break;
      } catch (fbErr: any) {
        lastErr = fbErr;
        console.warn(`Model ${model} fallback failed:`, fbErr?.message);
      }
    }

    if (!response || !response.text) {
      const friendlyMsg = formatUserFriendlyError(lastErr);
      return NextResponse.json({ error: friendlyMsg }, { status: 503 });
    }
  }

  try {
    const rawText = response.text || '';
    const jobs = extractJsonArray(rawText);
    jobs.sort((a, b) => b.score - a.score);
    return NextResponse.json(jobs);
  } catch (parseErr: any) {
    console.error('Failed to parse model output:', parseErr);
    return NextResponse.json(
      { error: 'Failed to format job listings. Please retry.' },
      { status: 500 }
    );
  }
}
