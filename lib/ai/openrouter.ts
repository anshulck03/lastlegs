import { ProfileSafe, CoachType, Facilities, StrengthPriority } from '../plan/types';

const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'deepseek-chat-v3';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_HTTP_REFERER = process.env.OPENROUTER_HTTP_REFERER || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const OPENROUTER_TITLE = process.env.OPENROUTER_TITLE || 'Last Legs AI Coach';

export interface CoachPromptInput {
  profileSafe: ProfileSafe;
  planSlice: any; // overview or a single week
  tone: 'analytical'; // fixed for v0
  type: CoachType;
  tokenBudget: number; // e.g., 300 or 200
}

function buildSystemPrompt(tokenBudget: number): string {
  return `You are an expert Ironman coach. Communicate concisely and analytically. Do not change training structure. Explain rationale, risk controls, and priorities. Avoid medical claims. Keep to <= ${tokenBudget} tokens.`;
}

function buildUserPrompt(input: CoachPromptInput): string {
  const { profileSafe, planSlice, type } = input;
  
  const facilitiesList = profileSafe.facilities ? 
    Object.entries(profileSafe.facilities)
      .filter(([_, available]) => available)
      .map(([facility, _]) => facility)
      .join(', ') || 'Limited facilities' : 'Standard facilities';

  const baseProfile = `Athlete Profile (safe):
- Distance: ${profileSafe.distance}
- Fitness Level: ${profileSafe.fitnessLevel}
- Age Band: ${profileSafe.ageBand}
- Facilities: ${facilitiesList}
- Strength Priority: ${profileSafe.strengthPriority}
- Weeks to Race: ${profileSafe.weeksToRace}`;

  const constraintsText = profileSafe.constraintsSummary ? 
    `\n- Constraints: ${profileSafe.constraintsSummary}` : '';

  switch (type) {
    case 'PLAN_OVERVIEW':
      return `${baseProfile}${constraintsText}

Plan Overview (structured JSON):
${JSON.stringify(planSlice, null, 2)}

Task:
Write a concise analytical overview (4-6 sentences) explaining:
- the overall training strategy and periodization,
- how the plan adapts to the athlete's runway and fitness level,
- key safety considerations and volume management,
- strength training integration based on priority.

Tone: analytical, supportive, no fluff.`;

    case 'WEEKLY_EXPLANATION':
      return `${baseProfile}${constraintsText}

Plan Week ${planSlice.weekIndex} Summary (structured JSON):
${JSON.stringify(planSlice, null, 2)}

Task:
Write a concise analytical note (3-5 sentences) explaining:
- the week's primary goal,
- why long/quality sessions are placed as they are,
- how strength is handled given the countdown and priority,
- any safety caps (long run/ride),
- what to focus on for execution.

Tone: analytical, supportive, no fluff, no generic tips unrelated to the week.`;

    case 'CONSTRAINT_TRANSLATION':
      return `${baseProfile}

Raw Constraints: "${profileSafe.constraintsSummary}"

Task:
Translate the raw constraints into 2-3 specific, actionable training adaptations (2-4 sentences). Focus on practical modifications rather than repeating the constraints. Be analytical and specific.

Tone: analytical, solution-focused.`;

    case 'STRENGTH_RATIONALE':
      return `${baseProfile}${constraintsText}

Strength Priority: ${profileSafe.strengthPriority}
Current Phase: ${planSlice.phase || 'Not specified'}
Weeks to Race: ${profileSafe.weeksToRace}

Task:
Explain the strength training rationale (2-3 sentences) for this phase given:
- the athlete's strength priority,
- interference management with endurance work,
- timing relative to race preparation.

Tone: analytical, evidence-based.`;

    default:
      throw new Error(`Unknown coach type: ${type}`);
  }
}

export async function getCoachText(input: CoachPromptInput): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not configured');
    return '';
  }

  try {
    const systemPrompt = buildSystemPrompt(input.tokenBudget);
    const userPrompt = buildUserPrompt(input);

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': OPENROUTER_HTTP_REFERER,
        'X-Title': OPENROUTER_TITLE,
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: input.tokenBudget,
        temperature: 0.7,
        top_p: 0.9,
      }),
      signal: AbortSignal.timeout(12000), // 12s timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return '';
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected OpenRouter response format:', data);
      return '';
    }

    const text = data.choices[0].message.content?.trim() || '';
    
    // Basic validation - ensure we got meaningful content
    if (text.length < 10) {
      console.warn('OpenRouter returned very short response:', text);
      return '';
    }

    return text;

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('OpenRouter request timeout');
      } else {
        console.error('OpenRouter request failed:', error.message);
      }
    } else {
      console.error('OpenRouter request failed:', error);
    }
    return '';
  }
}