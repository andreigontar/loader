<template>
    <div class="stages__stage stages__stage--1">
        <p class="stages__title">1. Выберите сток</p>
        <div class="stock-items">
            <button class="stock-items__item" type="button"
                    v-for="(elem, key) in stock"
                    :data-type="key"
                    :key="key"
                    :class="[{'stock-items__item--active': elem.check}]"
                    @click="change"
            ></button>
        </div>
    </div>
</template>

<script setup>
import {useDownloadStore} from "~/stores/download";
import {storeToRefs} from "pinia";

const downloadStore = useDownloadStore()
const {stock} = storeToRefs(downloadStore)

const change = (event) => {
    let dataType = event.target.dataset.type
    for (let elem in stock.value) {
        stock.value[elem].check = elem == dataType;
    }
}
</script>