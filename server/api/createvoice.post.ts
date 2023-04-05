// import { Configuration, OpenAIApi } from 'openai'

const apiKey = useRuntimeConfig().openaiApiKey
// const configuration = new Configuration({ apiKey })
// const openai = new OpenAIApi(configuration)

const system = { role: "system", content: "日本語で返答してください" }

export default defineEventHandler(async (event) => {
    const { text: text } = await readBody(event)
    if (!text) {
        return event.node.res.end('No text provided')
    }
    console.log('01', text._value);

    // const completion = await openai.createChatCompletion({
    //     model: "gpt-3.5-turbo",
    //     messages: text
    // })
    // const message = completion.data.choices[0].message?.content
    try {
        // const createQuery: Object = await $fetch('http://localhost:50021/audio_query', {
        //     method: 'POST',
        //     query: { text: text._value, speaker: 1 },
        //     headers: { 'Content-Type': 'application/json' }
        // })
        // console.log(createQuery);

        // const audio_query_response = await fetch(
        //     'http://localhost:50021/audio_query?text=aaaa&speaker=1',
        //     {
        //         method: 'post',
        //         headers: { 'Content-Type': 'application/json' }
        //     }
        // )
        // console.log(audio_query_response);


    } catch (error) {
        console.error(error);
    }

    // const voiceData = await $fetch('http://localhost:50021/synthesis', {
    //     method: 'POST',
    //     query: { speaker: 1 },
    //     body: createQuery,
    //     // server: false
    // })
    // console.log(voiceData);

    return 'ok'

})
