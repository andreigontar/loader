<template>
    <div class="textblock">
        <p class="stages__title">3. Вставьте в поле ссылки или id изображений через пробел или с новой строки<img src="@/assets/img/input/tip.svg" class="tip" alt="tip"></p>
        <div class="textblock__container">
            <template v-for="elem in stock">
                <template v-if="elem.check">
                    <template v-for="format in elem.type">
                        <button v-if="format.check" class="textblock__close"><img src="@/assets/img/input/close.svg" @click="format.text = ''"></button>
                        <textarea class="textblock__textarea"
                                  placeholder="Ссылка или id"
                                  v-if="format.check"
                                  v-model="format.text"
                        ></textarea>
                    </template>
                </template>
            </template>
        </div>
        <button class="textblock__action" :disabled="isDisabled || isAdding" @click="downloadStore.addToOrder(stock)">Добавить в заказ</button>
    </div>
</template>

<script setup>
import {useDownloadStore} from "~/stores/download";
import {storeToRefs} from "pinia";

const downloadStore = useDownloadStore()
const {stock, isDisabled, isAdding} = storeToRefs(downloadStore)
</script>