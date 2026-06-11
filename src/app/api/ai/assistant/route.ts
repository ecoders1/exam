import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, subject, context } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Return a helpful fallback if no API key
      return NextResponse.json({
        reply: getFallbackResponse(message, subject),
        source: "fallback",
      });
    }

    const systemPrompt = `You are an expert Ethiopian university exit exam tutor. 
Your role is to help students prepare for their exit exams.
${subject ? `The student is studying: ${subject}.` : ""}
${context ? `Context: ${context}` : ""}
- Give clear, concise explanations
- Use examples relevant to Ethiopian education context
- Focus on exam preparation strategies
- Explain concepts step by step
- Encourage the student`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API error");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply, source: "ai" });
  } catch {
    return NextResponse.json({
      reply: "I'm having trouble connecting right now. Please try again later.",
      source: "error",
    });
  }
}

function getFallbackResponse(message: string, subject?: string): string {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes("how") && lowerMsg.includes("study")) {
    return `Here are proven study strategies for ${subject ?? "your exit exam"}:\n\n1. **Spaced Repetition** — Review topics at increasing intervals\n2. **Practice Tests** — Take mock exams under real conditions\n3. **Active Recall** — Test yourself without looking at notes\n4. **Focus on Weak Areas** — Spend more time on topics you find difficult\n5. **Daily Practice** — 2-3 hours of focused study daily\n\nGood luck! You've got this! 🎯`;
  }

  if (lowerMsg.includes("pass") || lowerMsg.includes("score")) {
    return `To pass the Ethiopian exit exam:\n\n• The passing mark is typically **50%**\n• Focus on understanding concepts, not just memorizing\n• Practice at least 50 questions per subject daily\n• Review your mistakes carefully\n• Use the Mock Test feature to simulate real exam conditions\n\nKeep practicing! 💪`;
  }

  return `That's a great question about ${subject ?? "your studies"}! 

I recommend using the **Practice** section to test your knowledge, and the **Mock Test** for full exam simulation.

Focus on understanding core concepts and reviewing explanations after each question. Consistent daily practice is the key to success in the Ethiopian exit exam! 📚`;
}
