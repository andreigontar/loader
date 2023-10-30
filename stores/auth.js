import {defineStore} from 'pinia'
import {useSupabaseStore} from "./supabase";
import {useWalletStore} from "./wallet";

export const useAuthStore = defineStore('auth', () => {
    const supabase = useSupabaseAuthClient()
    const user = useSupabaseUser()
    const userId = computed(() => (user.value ? user.value.id : undefined))

    const isSignUpConfirmed = ref(false)

    const isEmailExists = ref(false)
    const isEmailConfirmed = ref(false)
    const countdownTimer = ref(0)

    const userEmail = ref('')
    const userPassword = ref('')

    const errorsMessage = reactive({
        notСonfirmed: false,
        offerToSignin: false,
        credentials: false
    })

    const logout = async () => {
        const {error} = await supabase.auth.signOut();
        if (error) throw error;
        navigateTo('/')
    }

    const isLoggedIn = computed(() => {
        return !!user.value;
    })

    const register = async ({email, password, password_confirm, isLogin}) => {
        const supabaseStore = useSupabaseStore()

        const {error, ...data} = await $fetch('/api/validation', {
            method: 'POST',
            body: {email, password, password_confirm, isLogin},
        })

        if (error) return {error, data}

        userEmail.value = data.email
        userPassword.value = data.password

        if (!isLogin) {
            await checkExistEmail(isLogin, data.email)
            if (isEmailExists.value) {
                if(isEmailConfirmed.value) {
                    errorsMessage.offerToSignin = true
                } else {
                    errorsMessage.notСonfirmed = true
                }
                return {error: true, email: true}
            }
        }


        if (isLogin) {
            await checkExistEmail(isLogin, data.email)
            if (isEmailExists.value && !isEmailConfirmed.value) {
                errorsMessage.notСonfirmed = true
                return {error: true, email: true}
            }

            const res = await supabaseStore.login(data)
            return res
        } else {
            const {error, server, user} = await supabaseStore.signUp(data)
            if(error) return {error, server}

            const res = await $fetch('/api/user', {
                method: 'POST',
                body: {
                    id: user.id,
                    email: user.email
                },
            })
            return res
        }
    }

    const checkExistEmail = async (isLogin, email) => {
        const data = await $fetch(`/api/user/get`, {
            method: 'POST',
            body: {email},
        })

        if (data) {
            isEmailExists.value = true
            isEmailConfirmed.value = data.confirmed
        }
    }

    const repeatEmailSend = async () => {
        const supabaseStore = useSupabaseStore()
        const {error, server} = await supabaseStore.signUp({email: userEmail.value, password: userPassword.value})
        return {error, server}
    }

    const checkSignUpConfirm = async () => {
        const route = useRoute()

        const hash = route.hash
        isSignUpConfirmed.value = hash.includes('type=signup')
    }

    const confirmEmail = async (id) => {
        const walletStore = useWalletStore()

        const {error} = await $fetch('/api/user/confirm-email', {
            method: 'POST',
            body: {id}
        })
        if(!error) {
            isEmailConfirmed.value = true
            isEmailExists.value = false
            isSignUpConfirmed.value = false
        }
        await walletStore.create(id)
        await walletStore.getBalance(id)
    }


    // todo вынести в отдельный файл
    const startCountdownTimer = () => {
        countdownTimer.value = 60
        let timerId = setInterval(() => {
            countdownTimer.value -= 1
        }, 1000)

        setTimeout(() => {
            clearInterval(timerId)
        }, 60000);
    }



    const update = async (data) => {
    }

    const sendPasswordRestEmail = async (email) => {
    }

    watch(userId, async () => {
        if (isSignUpConfirmed.value) {
            await confirmEmail(userId.value)
        }
    })

    return {
        supabase,
        user,
        userId,
        isLoggedIn,
        isEmailExists,
        isEmailConfirmed,
        countdownTimer,
        errorsMessage,
        userEmail,
        isSignUpConfirmed,
        checkSignUpConfirm,
        register,
        logout,
        confirmEmail,
        repeatEmailSend,
        startCountdownTimer
    }
})


/*    const doubleCount = computed(() => {
        return count.value * 2
    })
    const doublePlusOne = computed(() => {
        return doubleCount.value + 1
    })
    const getUserById = computed(() => {
        return (id) => {
            return `text: ${id}`
        }
    })*/