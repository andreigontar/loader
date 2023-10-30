<template>
    <section class="registration" ref="form">

        <div class="registration__head header-actions">
            <NuxtLink class="logo" to="/">
                <img src="@/assets/img/logo/logo__header.svg" alt="">
            </NuxtLink>
            <template v-if="!submitted">
                <NuxtLink v-if="isLogin" class="header-actions__link"
                          :to="{name: 'registration', query: {profile: 'signin'}}">
                    <i class="icon icon--profile"></i>Регистрация
                </NuxtLink>
                <NuxtLink v-else class="header-actions__link" :to="{name: 'registration', query: {profile: 'login'}}">
                    <i class="icon icon--profile"></i>Войти
                </NuxtLink>
            </template>
        </div>

        <NuxtLink class="registration__to-main" to="/"><i class="i-to-main"></i>На главную</NuxtLink>

        <article v-if="!submitted" class="registration__form">

            <h1 class="registration__title">{{ isLogin ? 'Вход' : 'Регистрация' }}</h1>

            <!-- TODO сделать небольшую анимацию исчезновения -->
            <FormKit
                id="auth"
                :form-class="submitted ? 'hide' : 'show'"
                type="form"
                #default="{ state: { valid } }"
                :actions="false"
                @submit="register"
            >

                <div class="server-message">
                    <FormKitMessages />
<!--                    TODO 2 одинаковых id             -->
                    <FormKit
                        id="auth"
                        type="form"
                        :actions="false"
                        @submit="repeat(true)"
                        v-if="authStore.errorsMessage.notСonfirmed"
                    >
                        <div class="email-message">
                            Ваш e-mail не подтвержден, проверьте почту!
                            <button class="confirm__repeat confirm__repeat--inform" type="submit">Отправить повторно</button>
                        </div>
                    </FormKit>

                    <div class="email-message" v-else-if="authStore.errorsMessage.offerToSignin">
                        Такой e-mail уже зарегистрирован<br><NuxtLink class="server-message__link" :to="{name: 'registration', query: {profile: 'login'}}">Войти?</NuxtLink>
                    </div>

                    <div class="email-message" v-else-if="authStore.errorsMessage.credentials">Ошибка в логине или пароле</div>
                </div>

                <FormKit
                    type="email"
                    label="E-mail"
                    name="email"
                    validation="required|email"
                    validation-visibility="dirty"
                    placeholder="Введите e-mail"
                    v-model="email"
                    :validation-messages="{
                      required: 'введите ваш e-mail адрес',
                      email: 'неправильный e-mail адрес'
                    }"
                />


                <FormKit
                    autocomplete
                    type="password"
                    label="Пароль"
                    name="password"
                    placeholder="Введите пароль"
                    suffix-icon="eyeClosed"
                    @suffix-icon-click="passwordEye"
                    v-model="password"
                    validation-visibility="dirty"
                    :validation="!isLogin ? 'required|length:6,30|matches:/[^a-zA-Z]/' : 'required'"
                    :validation-messages="{
                        required: 'введите ваш пароль',
                        length: 'пароль должен быть от 6 до 30 символов',
                        matches: 'используется недопустимый символ',
                    }"
                />

                <FormKit
                    autocomplete
                    v-if="!isLogin"
                    type="password"
                    label="Повторите пароль"
                    name="password_confirm"
                    placeholder="Повторите пароль"
                    suffix-icon="eyeClosed"
                    @suffix-icon-click="passwordEye"
                    v-model="confirmPassword"
                    validation-visibility="dirty"
                    validation="required|confirm"
                    :validation-messages="{
                        required: 'подтвердите пароль',
                        confirm: 'пароли не совпадают',
                    }"
                />

                <div class="registration__hcaptcha">
                    <vue-hcaptcha
                        :sitekey="sitekey"
                        @verify="verifyCaptcha"
                        @expired="expiredCaptcha"
                    />
                </div>

                <div class="registration__action-block">
                    <button v-if="isLogin" class="registration__action-forgot" type="button">Забыли пароль?</button>
                    <p v-else class="registration__conditions">Нажимая на кнопку регистрации,<br> вы соглашаетесь с <a
                        href="#">условиями<br> пользования сервисом</a></p>
                    <FormKit
                        :disabled="!(valid && isVerifyCaptcha && countdownTimer == 0)"
                        :classes="{outer: '$reset'}"
                        class="registration__action-enter"
                        type="submit"
                        :label="isLogin ? 'Вход' : 'Регистрация'"
                    />
                </div>
            </FormKit>
        </article>

        <article v-else class="registration__confirm confirm">
            <FormKit
                id="auth"
                type="form"
                :actions="false"
                @submit="repeat"
            >
                <h1 class="registration__title confirm__title">Подтверждение</h1>

                <div class="server-message">
                    <FormKitMessages />
                </div>

                <p class="confirm__text">С адреса <b>{{ infoMail }}</b> отправлено письмо на указанную вами почту
                    <b>{{ userEmail }}</b>, внутри ссылка-подтверждение регистрации.</p>
                <template v-if="countdownTimer == 0">
                    <div class="registration__hcaptcha--row">
                        <vue-hcaptcha
                            :sitekey="sitekey"
                            @verify="verifyCaptcha"
                            @expired="expiredCaptcha"
                        />
                    </div>

                    <button class="confirm__repeat" type="submit" :disabled="!isVerifyCaptcha">Отправить повторно</button>
                </template>
                <p v-else class="confirm__repeat confirm__repeat--disabled">Отправить повторно через {{ countdownTimer }} секунд</p>

            </FormKit>
        </article>

        <div class="registration__optional">
            <NuxtLink class="registration__optional-link" to="#">Оферта</NuxtLink>
            <NuxtLink class="registration__optional-link" to="#">Условия</NuxtLink>
            <NuxtLink class="registration__optional-link" to="#">Инструкция</NuxtLink>
        </div>

    </section>
</template>


<script setup>
import {useAuthStore} from '~/stores/auth'
import {useCaptchaStore} from "~/stores/captcha";
import {storeToRefs} from "pinia";
import autoAnimate from "@formkit/auto-animate"
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import {setErrors, clearErrors, FormKitMessages} from '@formkit/vue'

const route = useRoute()
const captchaStore = useCaptchaStore()
const {captchaToken, isVerifyCaptcha} = storeToRefs(captchaStore)
const authStore = useAuthStore()
const {user, isLoggedIn, isEmailExists, isEmailConfirmed, repeatEmailSend, countdownTimer, userEmail} = storeToRefs(authStore)

const props = defineProps({
    valid: Boolean
})

// autoAnimate
/*===============================================================================*/
const form = ref()

onMounted(() => {
    form.value.querySelectorAll(".sh-outer, .sh-messages, .server-message").forEach(autoAnimate)
})
onUpdated(() => {
    form.value.querySelectorAll(".sh-outer, .sh-messages, .server-message").forEach(autoAnimate)
})

// captcha
/*===============================================================================*/
const sitekey = "10000000-ffff-ffff-ffff-000000000001"

const verifyCaptcha = async (token) => {
    captchaToken.value = token

    const {data} = await useFetch('/api/captcha', {
        method: 'POST',
        body: {token}
    })

    if (data.value) {
        isVerifyCaptcha.value = true
    }
    // TODO сюда вывод какой то, если ошибка в капче
}

const expiredCaptcha = () => {
    // console.log('expiredCaptcha')
    isVerifyCaptcha.value = false
    // TODO disabled button
}

// authorization
/*===============================================================================*/
const email = ref('')
const password = ref('')
const confirmPassword = ref('')


const register = async () => {
    if (isVerifyCaptcha.value && countdownTimer.value == 0) {
        clearErrors('auth')

        const {error, server, ...data} = await authStore.register({
            email: email.value.trim(),
            password: password.value.trim(),
            password_confirm: confirmPassword.value.trim(),
            isLogin: isLogin.value
        })

        if (error) {
            if (data.email || data.login) { // TODO избавиться от этой ерунды, есть же errorsMessage
                hcaptcha.reset()
                return false
            } else if (server) {
                console.log('error server')
                setErrors('auth', ['Произошла ошибка на сервере'])
            } else {
                console.log('error not server', error);
                const {input, message} = data
                setErrors('auth', null, {[input]: message})
            }
        } else {
            if (isLogin.value) navigateTo('/')
            Object.keys(authStore.errorsMessage).forEach((key) => {authStore.errorsMessage[key] = false})
            submitted.value = true
            isEmailExists.value = false
            clearErrors('auth')
        }
        hcaptcha.reset()
    }
}


const repeat = async (inForm = false) => {
    clearErrors('auth')

    if (inForm) {
        submitted.value = true
        hcaptcha.reset()
        const {error, server} = await authStore.repeatEmailSend()
        if (error) setErrors('auth', ['Произошла ошибка на сервере'])
    } else {
        if (isVerifyCaptcha.value && countdownTimer.value == 0) {
            const {error, server} = await authStore.repeatEmailSend()
            if (!error) {
                setErrors('auth', ['Письмо отправлено!'])
            } else {
                setErrors('auth', ['Произошла ошибка на сервере'])
            }
            hcaptcha.reset()
        }
    }
    Object.keys(authStore.errorsMessage).forEach((key) => {authStore.errorsMessage[key] = false})
}

// check of login or registration | html
/*===============================================================================*/
const submitted = ref(false)

const isLogin = computed(() => {
    return route.query.profile === 'login'
})

const valid = ref(props.valid)

// other
/*===============================================================================*/
const infoMail = "info@shutterstocksale.com"

// password eye
const passwordEye = (node) => {
    node.props.suffixIcon = node.props.suffixIcon === 'eye' ? 'eyeClosed' : 'eye'
    node.props.type = node.props.type === 'password' ? 'text' : 'password'
}
</script>