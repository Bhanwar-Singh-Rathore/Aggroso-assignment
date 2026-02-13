const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const INVOKE_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function processTranscript(transcript) {
  const systemPrompt = `
You are a meeting assistant. Analyze the transcript and return a JSON object with:
- title: A short, descriptive title for the meeting.
- summary: A 2-3 sentence executive summary.
- purpose: The primary goal or objective.
- topics: A list of main topics discussed.
- participants: A list of people identified in the meeting.
- actionItems: A list of objects { task, owner, dueDate, done: false }.

Return ONLY valid JSON. No markdown.
`;

  try {
    const payload = {
      model: "google/gemini-2.0-flash-001",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: transcript },
      ],
      response_format: { type: "json_object" },
    };

    const response = await fetch(INVOKE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Meeting Tracker AI",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty AI response");

    const result = JSON.parse(content);
    return {
      ...result,
      id: Date.now(),
      date: new Date().toISOString(),
      actionItems: (result.actionItems || []).map((item, i) => ({
        ...item,
        id: Date.now() + i,
        done: false,
      })),
    };
  } catch (error) {
    throw error;
  }
}

export async function chatWithTranscript(transcript, history, message) {
  const systemPrompt = `
You are an AI assistant helping a user with their meeting notes. 
Context (Transcript): ${transcript}
Answer questions based on this context. 
Be concise and helpful.
`;

  try {
    const payload = {
      model: "google/gemini-2.0-flash-001",
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message },
      ],
    };

    const response = await fetch(INVOKE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Meeting Tracker AI Chat",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Chat request failed");
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response";
  } catch (error) {
    throw error;
  }
}
