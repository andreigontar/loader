import {defineStore} from 'pinia'
import '@hcaptcha/vue3-hcaptcha';

export const useCaptchaStore = defineStore('captcha', () => {
    const captchaToken = ref(null)
    const isVerifyCaptcha = ref(false)

/*    const config = useRuntimeConfig()
    const sitekey = ref(config.hcaptchaSiteKey)*/

    const resetCaptcha = () => {
        captchaToken.value = null
        isVerifyCaptcha.value = false
    }

    return {
        captchaToken,
        isVerifyCaptcha,
        resetCaptcha
    }
})