<template>
    <section class="page__order-work order-work">
        <article class="order-work__how-working how-working">
            <h2 class="how-working__title">Как мы работаем? <img src="@/assets/img/form-elem/mascot-icon.svg" alt=""></h2>
            <p class="how-working__desc">Скачаем для вас материалы с Shutterstock / Adobe Stock / iStock / Depositphotos<br> Изображения, фотографии, вектор, иллюстрации, аудио, видео и другие материалы.</p>
            <ul class="how-working__order">
                <li class="how-working__order-item"><NuxtLink to="/">Авторизируйтесь</NuxtLink>&nbsp;на сайте</li>
                <li class="how-working__order-item">Пополните баланс от 70 рублей</li>
                <li class="how-working__order-item">Вставьте ссылки или коды нужных материалов <a href="#">&nbsp;в блок загрузки</a></li>
                <li class="how-working__order-item">Нажмите кнопку скачать и получите ваши файлы после завершения загрузки!</li>
            </ul>
            <p class="how-working__opti">*Все материалы предоставляются только в рамках стандартной лицензии.</p>
            <button class="how-working__full-info btn-main">Полная информация о работе сервиса</button>
        </article>
        <article class="order-work__questions questions">
            <h2 class="questions__title">По вопросам обращайтесь:</h2>
            <ul class="questions__list-links">
                <li class="questions__link">
                    <a class="link-inline" href="#">Служба поддержки на сайте<img src="@/assets/img/form-elem/link.svg" alt=""></a>
                </li>
                <li class="questions__link">
                    <a class="link-inline" href="#" target="_blank">Телеграм<img src="@/assets/img/form-elem/link.svg" alt=""></a>
                </li>
                <li class="questions__link">
                    <a class="link-inline" href="#" target="_blank">Сообщения группы ВКонтакте<img src="@/assets/img/form-elem/link.svg" alt=""></a>
                </li>
            </ul>
            <p class="questions__text">
                Менеджеры поддержки работают ежедневно<br> <b>с 10:00 до 23:00</b> по МСК без праздников и выходных.<br>
                Ответ в ночное время может осуществляться<br> с задержкой.
            </p>
            <p class="questions__text">Возможность загрузки 4k видео, аудио, скачивание<br> матириалов с других стоков, также уточняте у менеджера.</p>
        </article>
    </section>
</template>

<style scoped lang="scss">
@import "assets/css/elems/link-inline";
@import "assets/css/info/order-work";
</style>