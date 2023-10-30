<template>
    <aside class="account-navigate">
        <ul class="account-navigate__list">
            <li class="account-navigate__item">
                <NuxtLink
                    to="/account"
                    class="account-navigate__link"
                    exact-active-class="account-navigate__link--active"><i class="icon icon--profile"></i>Профиль<i class="arrow"></i></NuxtLink>
            </li>
            <li class="account-navigate__item">
                <NuxtLink
                    to="/account/balance"
                    class="account-navigate__link"
                    exact-active-class="account-navigate__link--active"><i class="icon icon--coin"></i>Пополнить баланс<i class="arrow"></i></NuxtLink>
            </li>
            <li class="account-navigate__item">
                <NuxtLink
                    to="/account/favorite"
                    class="account-navigate__link"
                    exact-active-class="account-navigate__link--active"><i class="icon icon--favorite"></i>Отложенные<i class="arrow"></i></NuxtLink>
            </li>
            <li class="account-navigate__item">
                <NuxtLink
                    to="/account/history"
                    class="account-navigate__link"
                    exact-active-class="account-navigate__link--active"><i class="icon icon--folder"></i>Загрузки<i class="arrow"></i></NuxtLink>
            </li>
        </ul>
    </aside>
</template>


<style scoped lang="scss">
@import "assets/css/account/navigate";
</style>