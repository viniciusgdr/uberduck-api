import request from 'request'

function wait() {
    await new Promise((resolve) => setTimeout((resolve), 1000))
}
function getAudioUrl(
    key: string,
    secretKey: string,
    carachter: string,
    text: string
) {
    if (carachter === undefined) throw new Error('Define the carachter voice.')
    if (key === undefined) throw new Error('Define the key you got from uberduck')
    if (carachter === undefined) throw new Error('Define the secret key u got from uberduck.')

    return new Promise(async (resolve, reject) => {
        await request({
            url: 'https://api.uberduck.ai/speak',
            method: 'POST',
            body: `{"speech": "${text}","voice": "${carachter}"}`,
            auth: {
                'user': key,
                'pass': secretKey
            }
        }, async (error, response, body) => {
            if (error) throw new Error('Error when making request, verify if yours params (key, secretKey, carachter) are correct.')
            const audioResponse: string = 'https://api.uberduck.ai/speak-status?uuid=' + JSON.parse(body).uuid
            let jsonResponse: any = false
            async function getJson(url) {
                await request(url, function (error, response, body) {
                    return body
                })
            }
            jsonResponse = await getJson(audioResponse)
            while (jsonResponse.path === null) jsonResponse = await getJson(audioResponse)
            resolve(jsonResponse.path)
        })
    })
}

export {
    getAudioUrl
}
