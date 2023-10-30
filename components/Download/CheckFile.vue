<template>
    <div class="checkfile">
        <p class="stages__title">2. Выбирите тип файла</p>
        <div class="checkfile__check check">
            <template v-for="elem in stock">
                <button v-if="elem.check"
                        v-for="(format, key) in elem.type"
                        class="check__btn"
                        :class="[{'check__btn--active': format.check}]"
                        :data-type="key"
                        :key="key"
                        @click="change">{{ format.name }}
                </button>
            </template>
        </div>

        <div class="checkfile__price price">
            <p class="price__title"><img src="@/assets/img/account/coin.png" alt="price">Цены:</p>
            <ul class="price__list">
                <li>До 4 шт. — 1000 ₽/шт</li>
                <li>От 5 - до 10 шт. — 200 ₽ скидка</li>
                <li>От 11 - до 15 шт. — 300 ₽ скидка</li>
                <li>Далее — 10% скидка</li>
            </ul>
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
        if (stock.value[elem].check) {

            let currentElem = stock.value[elem]
            for (let format in currentElem.type) {
                currentElem.type[format].check = format == dataType
            }
        }
    }
}
</script>