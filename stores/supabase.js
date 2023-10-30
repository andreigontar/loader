import {defineStore, storeToRefs} from 'pinia'
import {useCaptchaStore} from './captcha'
import {useAuthStore} from "~/stores/auth";

export const useSupabaseStore = defineStore('supabase', () => {
    const supabase = useSupabaseAuthClient()
    const captchaStore = useCaptchaStore()
    const authStore = useAuthStore()
    const {captchaToken} = storeToRefs(captchaStore)
    const {countdownTimer} = storeToRefs(authStore)

    const signUp = async ({email, password}) => {
        if (countdownTimer.value != 0) return false;
        const {data: {user}, error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                captchaToken: captchaToken.value,
                emailRedirectTo: window.location.origin
            }
        })
        captchaStore.resetCaptcha()
        if(!error) authStore.startCountdownTimer()

        return error ? {error: true, server: true} : {error: false, server: true, user}
    }

    const login = async ({email, password}) => {
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password,
            options: {
                captchaToken: captchaToken.value
            }
        })
        // TODO запускать таймер спустя 5 попыток
        captchaStore.resetCaptcha()

        if (error) {
            if (String(error).includes('Invalid login credentials')) {
                authStore.errorsMessage.credentials = true
                return {error: true, server: true, login: true}
            }
            return {error: true, server: true}
        }

        return {error: false, server: true}
    }

    return {
        signUp,
        login
    }
})