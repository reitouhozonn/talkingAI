<script setup lang="ts">

const userText = ref('')
const errorText = ref()
let resQuery = ''

const res = ref()
const voiceUrl = ref()
const postData = computed(() => userText)

// めたん：ささやき：３６
// めたん：ヒソヒソ：３７
// ビィ：落ち着き：５９

async function post() {
    const { data, error } = await useFetch('/api/createvoice', {
        method: 'POST',
        body: {
            text: postData,
        },
        server: false
    })
    res.value = data.value
    if (error) {
        errorText.value = error.value?.message!
    }
}

async function query() {
    const { data, error } = await useFetch('http://127.0.0.1:50021/audio_query', {
        method: 'POST',
        query: {
            text: postData.value,
            speaker: 59
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
            speaker: 59
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
    await query()
    await createVoice()
    await playAudioFromBlob(res.value)
}

</script>


<template>
    <div>
        <h1>zunda page</h1>
        <div style={contentStyle}>
            <h2>読み上げたい文章を入力</h2>
            <textarea v-model="userText" label="Text" auto-grow variant="outlined" rows="1" row-height="15" />
            <button @click="create()" :disabled="!userText" type="submit" block>submit</button>
        </div>

        <audio :src="voiceUrl" autoplay controls type="audio/wav"></audio>
    </div>
</template>
<style scoped>
</style>
