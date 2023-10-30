<template>
    <div class="download__aside details-order">
        <p class="details-order__title">Подробности заказа:</p>
        <ul v-if="Object.keys(detailedInformation).length" class="details-order__list details-list">
            <template v-for="stock in detailedInformation">
                <li class="details-list__item" v-for="type in stock">
                    <div class="details-list__item-type">{{ type.title }}</div>
                    <div class="details-list__item-cnt">{{ type.desc }}</div>
                </li>
            </template>
        </ul>

        <div class="details-order__final">
            <button class="license-screen">
                <div class="check"></div>Cкриншоты лицензий<img src="@/assets/img/input/tip.svg" class="tip" alt="tip">
            </button>
            <div class="final-price">
                <p class="final-price__title">Итого:</p>
                <div class="final-price__value">{{ finalPrice }} ₽</div>
            </div>
            <button class="final-action" @click="order" :disabled="!(!!files?.length) || isAdding">Оплатить</button>
        </div>
    </div>
</template>

<script setup>
import {useFileStore} from "~/stores/file";
import {storeToRefs} from "pinia";
import {useOrderStore} from "~/stores/order";
import {useAuthStore} from "~/stores/auth";
import {useDownloadStore} from "~/stores/download";
const authStore = useAuthStore()
const {userId, isLoggedIn} = storeToRefs(authStore)


const fileStore = useFileStore()
const orderStore = useOrderStore()
const {files, detailedInformation, finalPrice} = storeToRefs(fileStore)

const downloadStore = useDownloadStore()
const {isAdding} = storeToRefs(downloadStore)


const order = async () => {
    if (isLoggedIn) await orderStore.order(userId)
}
</script>

<style scoped>

</style>