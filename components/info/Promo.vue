<template>
    <section class="page__promo promo">
        <div class="promo__desc">
            <h1 class="promo__title promo-title">Фото <b>|</b> вектор <b>|</b> аудио <b>|</b> видео<br>с самых популярных стоков</h1>
            <h2 class="promo__optional">Shutterstock  •  Adobe Stock  •  iStock  •  Depositphotos<br>Freepik  •  Dreamstime  •  123RF</h2>
            <nav class="promo__nav">
                <button class="promo__nav-order">сделать заказ</button>
                <NuxtLink class="promo__nav-howto" to="/">Как скачать материалы со стока?</NuxtLink>
            </nav>
        </div>
        <div class="promo__back">
            <img class="promo__back-mascot" src="@/assets/img/promo/mascot.png" alt="">
            <p class="promo__back-work">Работаем!</p>
            <div class="promo__back-license">
                <img class="promo__back-license-img" src="@/assets/img/promo/license.png" alt="">
                <p class="promo__back-license-title">Предоставление <b>лицензий</b><br>Shutterstock и Depositphotos</p>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
@import "assets/css/base/button/main";
@import "assets/css/info/promo";
</style>

<script setup></script>