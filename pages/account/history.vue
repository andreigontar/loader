<template>
    <div class="history">
        <h1 class="title-account">Загрузки</h1>
        <div class="history__filter filter">
            <p class="filter__title">Фильтр:</p>
            <div class="filter__check">

            </div>
            <div class="filter__action">
                <button class="filter__to-mail"><div class="check check--active"></div>Дублировать на почту</button>
                <button class="filter__download-check"><i class="icon icon--folder"></i>Скачать (2)</button>
            </div>
        </div>

        <ul class="history__titles history-titles">
            <li data-type="preview">Превью<img src="@/assets/img/input/tip.svg" class="tip" alt="tip"></li>
            <li data-type="order">№ Заказа</li>
            <li data-type="stock-count">Сток / Кол-во</li>
            <li data-type="format">Формат</li>
            <li data-type="id">id</li>
            <li data-type="price">Цена</li>
            <li data-type="date">Дата</li>
        </ul>

        <ul class="history__list history-list">
            <li class="history-list__item history-item">
                <button class="history-item__check">
                    <div class="check"></div>
                </button>
                <div class="history-item__preview" data-type="preview">превью<br> картинки</div>
                <div class="history-item__order" data-type="order">№ 3638946304</div>
                <div class="history-item__stock-count" data-type="stock-count">Depositphotos</div>
                <div class="history-item__format" data-type="format">
                    <div class="type">JPEG</div>
                    <div class="size">3280x4928</div>
                </div>
                <div class="history-item__id" data-type="id">4815162342</div>
                <div class="history-item__price" data-type="price">700 ₽</div>
                <div class="history-item__date" data-type="date">11.02.2023</div>
                <div class="history-item__download" data-type="download">
                    <button class="download"><i class="icon icon--folder"></i></button>
                </div>
            </li>
            <li class="history-list__item history-item history-item--active">
                <button class="history-item__check">
                    <div class="check check--active"></div>
                </button>
                <div class="history-item__preview" data-type="preview">превью<br> картинки</div>
                <div class="history-item__order" data-type="order">№ 3638946304</div>
                <div class="history-item__stock-count" data-type="stock-count">Depositphotos</div>
                <div class="history-item__format" data-type="format">
                    <div class="type">JPEG</div>
                    <div class="size">3280x4928</div>
                </div>
                <div class="history-item__id" data-type="id">4815162342</div>
                <div class="history-item__price" data-type="price">700 ₽</div>
                <div class="history-item__date" data-type="date">11.02.2023</div>
                <div class="history-item__download" data-type="download">
                    <button class="download"><i class="icon icon--folder"></i></button>
                </div>
            </li>
            <li class="history-list__item history-item history-item--multi open">
                <div class="history-item__wrap-title">
                    <button class="history-item__check">
                        <div class="check"></div>
                    </button>
                    <div class="history-item__preview" data-type="preview">превью<br> картинки</div>
                    <div class="history-item__order" data-type="order">№ 3638946304</div>
                    <div class="history-item__stock-count" data-type="stock-count">100 шт.</div>
                    <button class="history-item__more more">Развернуть<i class="icon icon--arrow"></i></button>
                    <div class="history-item__price" data-type="price">700 ₽</div>
                    <div class="history-item__date" data-type="date">11.02.2023</div>
                    <div class="history-item__download" data-type="download">
                        <button class="download"><i class="icon icon--folder"></i></button>
                    </div>
                </div>

                <ul class="history-item__inner-list inner-list">
                    <li class="history-list__item history-item">
                        <button class="history-item__check">
                            <div class="check"></div>
                        </button>
                        <div class="history-item__preview" data-type="preview">превью<br> картинки</div>
                        <div class="history-item__space" data-type="space"></div>
                        <div class="history-item__stock-count" data-type="stock-count">Depositphotos</div>
                        <div class="history-item__format" data-type="format">
                            <div class="type">JPEG</div>
                            <div class="size">3280x4928</div>
                        </div>
                        <div class="history-item__id" data-type="id">4815162342</div>
                        <div class="history-item__price" data-type="price">700 ₽</div>
                        <div class="history-item__date" data-type="date"></div>
                        <div class="history-item__download" data-type="download">
                            <button class="download"><i class="icon icon--folder"></i></button>
                        </div>
                    </li>
                    <li class="history-list__item history-item">
                        <button class="history-item__check">
                            <div class="check"></div>
                        </button>
                        <div class="history-item__preview" data-type="preview">превью<br> картинки</div>
                        <div class="history-item__space" data-type="space"></div>
                        <div class="history-item__stock-count" data-type="stock-count">Shutterstock</div>
                        <div class="history-item__format" data-type="format">
                            <div class="type">HD select</div>
                        </div>
                        <div class="history-item__id" data-type="id">4815162342</div>
                        <div class="history-item__price" data-type="price">700 ₽</div>
                        <div class="history-item__date" data-type="date"></div>
                        <div class="history-item__download" data-type="download">
                            <button class="download"><i class="icon icon--folder"></i></button>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'account',
});
</script>


<style scoped lang="scss">
@import "assets/css/account/history";
</style>