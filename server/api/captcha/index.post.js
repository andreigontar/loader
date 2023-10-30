import {verify} from 'hcaptcha';
export default defineEventHandler(async (event) => {
    const {token} = await readBody(event)
    const secret = process.env.HCAPTCHA_SECRET_KEY

    const data = await verify(secret, token)
    return data.success === true
})
