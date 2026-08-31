import { NextResponse } from 'next/server';
import { generateLocalAIResponse, getSystemPrompt, AIChatMessage } from '@/lib/aiKnowledge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, language = 'en', history = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    const trimmed = message.trim();

    // 1. Try OpenAI if OPENAI_API_KEY is configured
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (openaiApiKey) {
      try {
        const messages: AIChatMessage[] = [
          { role: 'system', content: getSystemPrompt(language) },
          ...(Array.isArray(history) ? history.slice(-6) : []),
          { role: 'user', content: trimmed },
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages,
            temperature: 0.7,
            max_tokens: 600,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            const isAmharic = language === 'am' || /[\u1200-\u137F]/.test(trimmed);
            return NextResponse.json({
              success: true,
              message: reply,
              suggestions: isAmharic
                ? ['የምንሰጣቸው አገልግሎቶች', 'የግንባታ ዋጋ ግምት', 'ነፃ የማማከር ቀጠሮ']
                : ['Explore Services', 'Pricing Estimates', 'Book a Consultation'],
              showLeadForm: /consultation|quote|price|estimate|contact|booking|ዋጋ|ቀጠሮ|ግምት/i.test(trimmed),
            });
          }
        }
      } catch (err) {
        console.warn('[AI/OpenAI] Fallback to local intelligence:', err);
      }
    }

    // 2. Try Google Gemini if GEMINI_API_KEY is configured
    const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
    if (geminiApiKey && geminiApiKey.length > 5) {
      try {
        const geminiModel = process.env.GEMINI_MODEL || 'gemini-3.7-flash';
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': geminiApiKey,
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: getSystemPrompt(language) }],
              },
              contents: [
                ...(Array.isArray(history)
                  ? history.slice(-6).map((h: { role: string; content: string }) => ({
                      role: h.role === 'user' ? 'user' : 'model',
                      parts: [{ text: h.content }],
                    }))
                  : []),
                { role: 'user', parts: [{ text: trimmed }] },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            const isAmharic = language === 'am' || /[\u1200-\u137F]/.test(trimmed);
            return NextResponse.json({
              success: true,
              message: reply,
              suggestions: isAmharic
                ? ['የምንሰጣቸው አገልግሎቶች', 'የግንባታ ዋጋ ስንት ነው?', 'ነፃ ምክር ቀጠሮ']
                : ['Explore Our Services', 'Cost & Pricing Estimates', 'Book a Free Consultation'],
              showLeadForm: /consultation|quote|price|estimate|contact|booking|ዋጋ|ቀጠሮ|ግምት/i.test(trimmed),
            });
          }
        } else {
          const errText = await response.text();
          console.warn('[AI/Gemini API error]:', response.status, errText);
        }
      } catch (err) {
        console.warn('[AI/Gemini] Fallback to local intelligence:', err);
      }
    }



    // 3. Built-in Local AI Engine (Fast, Reliable, Zero-Config)
    const localResult = generateLocalAIResponse(trimmed, language);
    return NextResponse.json({
      success: true,
      message: localResult.message,
      suggestions: localResult.suggestions,
      showLeadForm: localResult.showLeadForm || false,
    });
  } catch (error) {
    console.error('[AI Chat API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process AI query',
      },
      { status: 500 }
    );
  }
}
