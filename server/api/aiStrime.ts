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
        console.log(text);
        const start_time = Date.now();


        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "日本語で返答してください" },
                { role: "user", content: text }
            ],
            stream: true
        })

        const collected_chunks: any[] = [];
        const collected_messages: any[] = [];


        for await (const chunk of completion as any) {
            const chunk_time = Date.now() - start_time; // calculate the time delay of the chunk
            collected_chunks.push(chunk); // save the event response
            const chunk_message = chunk.choices[0].text.trim(); // extract the message
            collected_messages.push(chunk_message); // save the message
            console.log(`Message received ${chunk_time} milliseconds after request: ${chunk_message}`); // print the delay and text
        }
        const chunk_time = Date.now() - start_time;
        console.log(`Full response received ${chunk_time} milliseconds after request`);
        const full_reply_content = collected_messages.join('').trim();
        console.log(`Full conversation received: ${full_reply_content}`);

        return
    } catch (error) {
        console.error(error);
    }

})
