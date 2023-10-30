<template>
    <section class="page__instruction instruction">
        <div class="title-block">
            <h2 class="title-block__title-m">Инструкция по работе</h2>
            <h3 class="title-block__desc">Скачаем для вас материалы с Shutterstock / Adobe Stock / iStock / Depositphotos<br> Изображения, фотографии, вектор, иллюстрации, аудио, видео и другие материалы</h3>
            <p class="title-block__opt">*Все материалы через сайт предоставляются только в рамках стандартной лицензии.</p>
        </div>
        <div class="instruction__block">
            <nav class="instruction__list">
                <li class="instruction__item"><NuxtLink class="instruction__link" :to="{name: 'registration', query: {profile: 'signin'}}">Авторизируйтесь</NuxtLink><br> на сайте</li>
                <li class="instruction__item">Пополните баланс<br> от 70 рублей</li>
                <li class="instruction__item">Вставьте ссылки или коды нужных<br> материалов в блок загрузки</li>
                <li class="instruction__item">Нажмите кнопку «Купить» и получите<br> ваши файлы после завершения загрузки!</li>
                <button class="instruction__action">Подробная инструкция</button>
            </nav>
            <div class="instruction__video">
                <video src="">

                </video>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
@import "assets/css/base/button/main";
@import "assets/css/info/instruction";
</style>