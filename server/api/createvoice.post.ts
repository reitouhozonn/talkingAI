import { Configuration, OpenAIApi } from 'openai'

const apiKey = useRuntimeConfig().openaiApiKey
const configuration = new Configuration({ apiKey })
const openai = new OpenAIApi(configuration)

const system = { role: "system", content: "日本語で返答してください" }

export default defineEventHandler(async (event) => {
    const { text: text } = await readBody(event)
    if (!text) {
        return event.node.res.end('No text provided')
    }

    try {

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "日本語で返答してください" },
                { role: "user", content: text }
            ],
            // stream: true
        })
        const message = completion.data.choices[0].message?.content!

        return message
    } catch (error) {
        console.error(error);
    }

})
