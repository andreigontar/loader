<style lang="scss">
@import "assets/css/base/button/main";
@import "assets/css/base/button/tools";
@import "assets/css/download/main";
</style>

<template>
    <section class="page__download download">
<!--        TODO SVG спрайты!    -->
        <div class="title-block">
            <h2 class="title-block__title-m">Загрузка файлов</h2>
        </div>
        <div class="download__block">
            <div class="download__stages stages">

                <DownloadStocks />

                <div class="stages__stage stages__stage--2-3">
                    <DownloadCheckFile />
                    <DownloadTextarea />
                </div>

                <div class="stages__stage stages__stage--4">
                    <div class="cart">
                        <p class="stages__title">4. Корзина</p>

<!--                        <div class="cart__tools cart-tools">
                            <button class="cart-tools__check-all"><div class="check"></div>Выбрать все</button>
                            <button class="cart-tools__check-all"><i class="icon icon&#45;&#45;delete"></i>Удалить (3)</button>
                            <button class="cart-tools__check-all"><i class="icon icon&#45;&#45;favorite"></i>Отложить (3)</button>
                            <button class="cart-tools__to-mail"><div class="check check&#45;&#45;active"></div>Дублировать на почту</button>
                            <button class="cart-tools__download-check"><i class="icon icon&#45;&#45;folder"></i>Скачать выбранное (1)</button>
                            <button class="cart-tools__download-all"><i class="icon icon&#45;&#45;folder"></i>Скачать все</button>
                        </div>-->

                        <ul class="cart__titles cart-titles">
                            <li data-type="preview">Превью<img src="@/assets/img/input/tip.svg" class="tip" alt="tip"></li>
                            <li data-type="stock">Сток</li>
                            <li data-type="format">Формат</li>
                            <li data-type="id">id</li>
                            <li data-type="price">Цена</li>
                        </ul>

                        <DownloadCartList v-if="files" />
                        <p class="cart__notlist" v-else>Тут будет список ваших файлов</p>

                    </div>
                </div>
            </div>
            <DownloadOrder />
        </div>
    </section>
</template>

<script setup>
import {useDownloadStore} from "~/stores/download";
import {storeToRefs} from "pinia";
import {useAuthStore} from "~/stores/auth";
import {useFileStore} from "~/stores/file";
import {usePriceStore} from "~/stores/price";

const downloadStore = useDownloadStore()
const authStore = useAuthStore()
const fileStore = useFileStore()
const {userId, isLoggedIn} = storeToRefs(authStore)
const {files} = storeToRefs(fileStore)


// TODO проверить может стоит поставить await
watch(userId, () => {
    if(!isLoggedIn) return false
    fileStore.getFiles(userId.value)
}, {immediate: true})
</script>