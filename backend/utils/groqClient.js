

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-120b"; 

const callGroqChatCompletion = async (systemPrompt, userPrompt) => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not configured on the server");
    }

    const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.7, 
             max_completion_tokens: 300, 
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
            `Groq API request failed: ${response.status} ${errorBody}`,
        );
    }

    const data = await response.json();

    
    const generatedText = data?.choices?.[0]?.message?.content?.trim();

    if (!generatedText) {
        throw new Error("Groq API returned an empty response");
    }

    return generatedText;
};

export { callGroqChatCompletion };
