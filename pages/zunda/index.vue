<script setup lang="ts">

const userText = ref('')
const errorText = ref()
let resQuery = ''
const isPending = ref(false)
const res = ref()
const gptResponse = ref()
const voiceUrl = ref()
const SPEAKER = 59
// めたん：ささやき：３６
// めたん：ヒソヒソ：３７
// ビィ：落ち着き：５９

async function test() {
    const { data, error } = await useFetch('/api/aiStrime', {
        method: 'POST',
        body: {
            text: userText.value,
        },
        server: false
    })
    if (error) {
        errorText.value = error.value?.message!
    }
    gptResponse.value = data.value
}

async function post() {
    const { data, error } = await useFetch('/api/createvoice', {
        method: 'POST',
        body: {
            text: userText.value,
        },
        server: false
    })
    console.log(userText.value)
    // gptResponse.value = data.value
    if (error) {
        errorText.value = error.value?.message!
    }
    return data.value
}

async function query(result: any) {
    const { data, error } = await useFetch('http://127.0.0.1:50021/audio_query', {
        method: 'POST',
        query: {
            text: result,
            speaker: SPEAKER
        },
        server: false
    })
    resQuery = data.value as string
    if (error) {
        errorText.value = error.value?.message!
    }
}

async function createVoice() {
    const { data, error } = await useFetch('http://127.0.0.1:50021/synthesis', {
        method: 'POST',
        query: {
            speaker: SPEAKER
        },
        body: resQuery,
        server: false
    })
    res.value = data.value
    if (error) {
        errorText.value = error.value?.message!
    }
}

async function playAudioFromBlob(blob: any) {
    voiceUrl.value = URL.createObjectURL(blob)
}


async function create() {
    isPending.value = true
    const result = await post()
    console.log(result);

    await query(result)
    await createVoice()
    gptResponse.value = result
    await playAudioFromBlob(res.value)
    isPending.value = false
}

</script>


<template>
    <div>
        <h1>zunda page</h1>
        <div style={contentStyle}>
            <h2>読み上げたい文章を入力</h2>
            <textarea v-model="userText" label="Text" auto-grow variant="outlined" rows="1" row-height="15" />
            <button @click="create()" :disabled="!userText" type="submit" block>submit</button>
            <!-- <button @click="test()" :disabled="!userText" type="submit" block>test</button> -->
        </div>
        <div v-if="isPending">考え中です</div>
        <audio :src="voiceUrl" autoplay controls type="audio/wav"></audio>
        <div> {{ gptResponse }}</div>
    </div>
</template>

<style scoped>
textarea {
    width: 100%;
    height: 200px;
    /* resize: none; */
    border: 2px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    font-size: 16px;
}
</style>
