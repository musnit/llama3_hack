

export const models = {
    openai_dalle: {
        apiKey: process.env.OPENAI_API_KEY,
        url: "https://api.openai.com/v1",
        model: "dall-e-3",
    },
    openai_vision: {
        apiKey: process.env.OPENAI_API_KEY,
        url: "https://api.openai.com/v1",
        model: "gpt-4-turbo",
    },
    groq_llama: {
        apiKey: process.env.GROQ_API_KEY,
        url: "https://api.groq.com/openai/v1",
        model: "llama",
    },
    fal_workflow: {
        apiKey: process.env.FAL_API_KEY,
    }
}

