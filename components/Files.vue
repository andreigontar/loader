<template>
    <section class="page__files files">
        <div class="title-block">
            <h2 class="title-block__title">Загруженные файлы</h2>
        </div>
<!--        <div class="files__table files-empty">-->
<!--            <div class="files-empty__block">-->
<!--                <div class="files-empty__title">Тут будет список последних загруженных файлов</div>-->
<!--            </div>-->
<!--            <a class="files-table__files-all files-all" href="#">-->
<!--                Все мои загрузки-->
<!--                <svg class="files-all__icon" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--                    <path opacity="0.9" d="M3.3042 2.52094V0H14V10.7203H11.5035V4.38112L1.81119 14L0 12.2133L9.61888 2.52094H3.3042Z"/>-->
<!--                </svg>-->
<!--            </a>-->
<!--        </div>-->
        <div class="files__table files-table">
            <div class="files-table__title">
                <div class="files-table__title-item">Превью</div>
                <div class="files-table__title-item">Сток</div>
                <div class="files-table__title-item">Тип</div>
                <div class="files-table__title-item">id</div>
                <div class="files-table__title-item">Цена</div>
                <div class="files-table__title-item">Загрузка</div>
            </div>
            <div class="files-table__action-block files-actions">
                <div class="files-actions__choose-all check">
                    <input type="checkbox" id="choose-all"/>
                    <label for="choose-all">
                        <div class="check__icon"></div>
                        <div class="check__text">Выбрать все</div>
                    </label>
                </div>
                <button class="files-actions__download-all download-all">
                    <img class="download-all__icon" src="@/assets/img/form-elem/download.svg" alt="">
                    Скачать все (6)
                </button>
            </div>
            <div class="files-table__items-block">
                <div class="files-table__item files-item">
                    <div class="check files-item__check">
                        <input type="checkbox" id="item-1"/>
                        <label for="item-1">
                            <div class="check__icon"></div>
                        </label>
                    </div>
                    <img class="files-item__preview" src="@/assets/img/form-elem/preview-file.png" alt="">
                    <div class="files-item__stock">Shutterstock</div>
                    <div class="files-item__type">Изображение</div>
                    <div class="files-item__id">id 4815162342</div>
                    <div class="files-item__price">70 ₽</div>
                    <button class="files-item__download">
                        <svg class="files-item__icon" viewBox="0 0 42 45" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M10.3192 20.8127C11.0382 20.075 12.2186 20.0604 12.9556 20.7801L20.9998 28.6342L29.0441 20.7801C29.7811 20.0604 30.9615 20.075 31.6805 20.8127C32.3995 21.5503 32.3849 22.7317 31.6479 23.4513L22.3017 32.5766C21.5776 33.2837 20.4221 33.2837 19.6979 32.5766L10.3518 23.4513C9.61474 22.7317 9.60014 21.5503 10.3192 20.8127Z"/>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M20.8422 0C21.8887 0 22.737 0.847292 22.737 1.89248V31.2147C22.737 32.2599 21.8887 33.1072 20.8422 33.1072C19.7958 33.1072 18.9475 32.2599 18.9475 31.2147V1.89248C18.9475 0.847292 19.7958 0 20.8422 0Z"/>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M1.85086 28.9286C2.87307 28.9286 3.70173 29.7755 3.70173 30.8203V37.4136C3.70173 39.5238 5.35409 41.2129 7.41518 41.2166H34.5821C36.6455 41.2166 38.2983 39.5247 38.2983 37.4184V30.8203C38.2983 29.7755 39.1269 28.9286 40.1491 28.9286C41.1713 28.9286 42 29.7755 42 30.8203V37.4184C42 41.6122 38.6919 45 34.5821 45L7.4105 45C3.30799 44.9937 0 41.6127 0 37.4136V30.8203C0 29.7755 0.82866 28.9286 1.85086 28.9286Z"/>
                        </svg>
                        Скачать
                    </button>
                </div>
                <div class="files-table__item files-item">
                    <div class="check files-item__check">
                        <input type="checkbox" id="item-2"/>
                        <label for="item-2">
                            <div class="check__icon"></div>
                        </label>
                    </div>
                    <img class="files-item__preview" src="@/assets/img/form-elem/preview-file.png" alt="">
                    <div class="files-item__stock">Shutterstock</div>
                    <div class="files-item__type">Изображение</div>
                    <div class="files-item__id">id 4815162342</div>
                    <div class="files-item__price">70 ₽</div>
                    <button class="files-item__download">
                        <svg class="files-item__icon" viewBox="0 0 42 45" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M10.3192 20.8127C11.0382 20.075 12.2186 20.0604 12.9556 20.7801L20.9998 28.6342L29.0441 20.7801C29.7811 20.0604 30.9615 20.075 31.6805 20.8127C32.3995 21.5503 32.3849 22.7317 31.6479 23.4513L22.3017 32.5766C21.5776 33.2837 20.4221 33.2837 19.6979 32.5766L10.3518 23.4513C9.61474 22.7317 9.60014 21.5503 10.3192 20.8127Z"/>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M20.8422 0C21.8887 0 22.737 0.847292 22.737 1.89248V31.2147C22.737 32.2599 21.8887 33.1072 20.8422 33.1072C19.7958 33.1072 18.9475 32.2599 18.9475 31.2147V1.89248C18.9475 0.847292 19.7958 0 20.8422 0Z"/>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M1.85086 28.9286C2.87307 28.9286 3.70173 29.7755 3.70173 30.8203V37.4136C3.70173 39.5238 5.35409 41.2129 7.41518 41.2166H34.5821C36.6455 41.2166 38.2983 39.5247 38.2983 37.4184V30.8203C38.2983 29.7755 39.1269 28.9286 40.1491 28.9286C41.1713 28.9286 42 29.7755 42 30.8203V37.4184C42 41.6122 38.6919 45 34.5821 45L7.4105 45C3.30799 44.9937 0 41.6127 0 37.4136V30.8203C0 29.7755 0.82866 28.9286 1.85086 28.9286Z"/>
                        </svg>
                        Скачать
                    </button>
                </div>
                <div class="files-table__item files-item">
                    <div class="check files-item__check">
                        <input type="checkbox" id="item-3"/>
                        <label for="item-3">
                            <div class="check__icon"></div>
                        </label>
                    </div>
                    <img class="files-item__preview" src="@/assets/img/form-elem/preview-file.png" alt="">
                    <div class="files-item__stock">Shutterstock</div>
                    <div class="files-item__type">Изображение</div>
                    <div class="files-item__id">id 4815162342</div>
                    <div class="files-item__price">70 ₽</div>
                    <button class="files-item__download">
                        <svg class="files-item__icon" viewBox="0 0 42 45" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M10.3192 20.8127C11.0382 20.075 12.2186 20.0604 12.9556 20.7801L20.9998 28.6342L29.0441 20.7801C29.7811 20.0604 30.9615 20.075 31.6805 20.8127C32.3995 21.5503 32.3849 22.7317 31.6479 23.4513L22.3017 32.5766C21.5776 33.2837 20.4221 33.2837 19.6979 32.5766L10.3518 23.4513C9.61474 22.7317 9.60014 21.5503 10.3192 20.8127Z"/>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M20.8422 0C21.8887 0 22.737 0.847292 22.737 1.89248V31.2147C22.737 32.2599 21.8887 33.1072 20.8422 33.1072C19.7958 33.1072 18.9475 32.2599 18.9475 31.2147V1.89248C18.9475 0.847292 19.7958 0 20.8422 0Z"/>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M1.85086 28.9286C2.87307 28.9286 3.70173 29.7755 3.70173 30.8203V37.4136C3.70173 39.5238 5.35409 41.2129 7.41518 41.2166H34.5821C36.6455 41.2166 38.2983 39.5247 38.2983 37.4184V30.8203C38.2983 29.7755 39.1269 28.9286 40.1491 28.9286C41.1713 28.9286 42 29.7755 42 30.8203V37.4184C42 41.6122 38.6919 45 34.5821 45L7.4105 45C3.30799 44.9937 0 41.6127 0 37.4136V30.8203C0 29.7755 0.82866 28.9286 1.85086 28.9286Z"/>
                        </svg>
                        Скачать
                    </button>
                </div>
            </div>
            <NuxtLink class="files-table__files-all files-all" to="/">
                Все мои загрузки
                <svg class="files-all__icon" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.9"
                          d="M3.3042 2.52094V0H14V10.7203H11.5035V4.38112L1.81119 14L0 12.2133L9.61888 2.52094H3.3042Z"/>
                </svg>
            </NuxtLink>
        </div>
    </section>
</template>

<style scoped lang="scss">
@import "assets/css/elems/files-all";
@import "assets/css/elems/check";
@import "assets/css/files/files";
</style>