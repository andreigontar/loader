<style scoped lang="scss">
@import "assets/css/elems/logo";
@import "assets/css/common/header";
</style>

<template>
    <header class="page__header header">
        <div class="header__container container">
            <NuxtLink class="header__logo logo" to="/">
                <img src="@/assets/img/logo/logo__header.svg" alt="">
            </NuxtLink>
            <ul class="header__social social-nav">
                <li class="social-nav__item"><a class="social-nav__link" :href="config.vkGroup" target="_blank"><img
                    src="@/assets/img/social/vk.png" alt=""></a></li>
                <li class="social-nav__item"><a class="social-nav__link" :href="config.telegramQ" target="_blank"><img
                    src="@/assets/img/social/telegram.png" alt=""></a></li>
            </ul>
            <ul class="header__site-navigation site-nav">
                <li class="site-nav__item">
                    <NuxtLink class="site-nav__link" to="/">Инструкция</NuxtLink>
                </li>
                <li class="site-nav__item">
                    <NuxtLink class="site-nav__link" to="/">Новости</NuxtLink>
                </li>
                <li class="site-nav__item">
                    <NuxtLink class="site-nav__link" to="/">Прайс</NuxtLink>
                </li>
            </ul>

            <ul class="header__actions header-actions">
                <!--    TODO не забыть поменять на isLoggedIn        -->
                <template v-if="isLoggedIn">
                    <li class="header-actions__item">
                        <NuxtLink class="header-actions__link header-actions__link--balance" to="/account/balance">
                            <i class="icon icon--coin"></i>Баланс:<b>{{ balance }} ₽</b>
                        </NuxtLink>
                    </li>
                    <li class="header-actions__item">
                        <NuxtLink class="header-actions__link header-actions__link--profile" to="/account">
                            <i class="icon icon--profile"></i>Профиль
                        </NuxtLink>
                    </li>
                    <li class="header-actions__item">
                        <NuxtLink class="header-actions__link header-actions__link--download" to="/account/history">
                            <i class="icon icon--folder"></i>Загрузки
                        </NuxtLink>
                    </li>
                    <li class="header-actions__item">
                        <NuxtLink class="header-actions__link header-actions__link--favorite" to="/account/favorite">
                            <i class="icon icon--favorite"></i>
                        </NuxtLink>
                    </li>
                    <li class="header-actions__item">
                        <NuxtLink class="header-actions__link header-actions__link--cart" to="/">
                            <i class="icon icon--cart"></i>Корзина<b>(36)</b>
                        </NuxtLink>
                    </li>
                </template>
                <template v-else>
                    <li class="header-actions__item">
                        <NuxtLink class="header-actions__link" :to="{name: 'registration', query: {profile: 'login'}}">
                            <i class="icon icon--profile"></i>Войти
                        </NuxtLink>
                    </li>
                    <li class="header-actions__item">
                        <NuxtLink class="header-actions__link header-actions__link--create" :to="{name: 'registration', query: {profile: 'signin'}}">
                            Создать аккаунт
                        </NuxtLink>
                    </li>
                </template>
            </ul>
        </div>
    </header>
</template>


<script setup>
import {useAuthStore} from '~/stores/auth'
import {storeToRefs} from "pinia";
import {useWalletStore} from "~/stores/wallet";

const config = useRuntimeConfig()
// const {$fancybox} = useNuxtApp()

const {$io} = useNuxtApp()
const authStore = useAuthStore()
const walletStore = useWalletStore()
const {isLoggedIn, userId} = storeToRefs(authStore)
const {balance} = storeToRefs(walletStore)


onMounted(() => {
    walletStore.getBalance(userId)

    $io.on('balanceUpdate', (data) => {
        balance.value = data
    })
})
</script>