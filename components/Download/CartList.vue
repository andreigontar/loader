<template>
    <ul class="cart__list cart-list">
        <li class="cart-list__item cart-item" v-for="file in files" :key="file.imageId">
            <button class="cart-item__check">
                <div class="check"></div>
            </button>
            <div v-if="file.preview" class="cart-item__preview preview-image" :style="`background-image: url(${file.preview})`">
                <img :src="file.preview" :alt="file.imageId">
            </div>
            <div v-else class="cart-item__preview preview-image">
                <div class="preview-image__notimage">превью<br> картинки</div>
            </div>
            <div class="cart-item__stock">{{ file.stockType }}</div>
            <div class="cart-item__format">
                <div class="type">{{ file.fileFormat }}</div>
                <div class="size" v-if="file.size">{{ file.size }}</div>
            </div>
            <div class="cart-item__id">{{ file.imageId }}</div>
            <div class="cart-item__price">{{ file.cost }} ₽</div>
            <div class="cart-item__favorite">
                <button class="favorite"><i class="icon icon&#45;&#45;favorite"></i></button>
            </div>
            <div class="cart-item__download" v-if="file.link">
                <button class="download" @click="download({stock: file.stockType, type: file.fileType, id: file.imageId})"><i class="icon icon--folder"></i>Скачать</button>
            </div>
            <div class="cart-item__delete" v-if="!file.link">
                <button class="delete" @click="remove({stock: file.stockType, type: file.fileType, id: file.imageId})"><img src="@/assets/img/input/close.svg" alt="close"></button>
            </div>
        </li>

<!--        <li class="cart-list__item cart-item">
            <button class="cart-item__check">
                <div class="check"></div>
            </button>
            <div class="cart-item__preview">превью<br> картинки</div>
            <div class="cart-item__stock">Depositphotos</div>
            <div class="cart-item__format">
                <div class="type">JPEG</div>
                <div class="size">3280x4928</div>
            </div>
            <div class="cart-item__id">4815162342</div>
            <div class="cart-item__price">70 ₽</div>
            <div class="cart-item__favorite">
                <button class="favorite"><i class="icon icon&#45;&#45;favorite"></i></button>
            </div>
            <div class="cart-item__download">
                <button class="download"><i class="icon icon&#45;&#45;folder"></i>Скачать</button>
            </div>
            <div class="cart-item__delete">
                <button class="delete"><img src="@/assets/img/input/close.svg" alt="close"></button>
            </div>
        </li>
        <li class="cart-list__item cart-item cart-item&#45;&#45;active">
            <div class="cart-item__check">
                <button class="check check&#45;&#45;active"></button>
            </div>
            <div class="cart-item__preview">превью<br> картинки</div>
            <div class="cart-item__stock">Shutterstock</div>
            <div class="cart-item__format">
                <div class="type">HD select</div>
            </div>
            <div class="cart-item__id">4815162342</div>
            <div class="cart-item__price">100 ₽</div>
            <div class="cart-item__favorite">
                <button class="favorite"><i class="icon icon&#45;&#45;favorite"></i></button>
            </div>
            <div class="cart-item__download">
                <button class="download"><img class="icon" src="@/assets/img/account/folder.png" alt="folder">Скачать</button>
            </div>
            <div class="cart-item__delete">
                <button class="delete"><img src="@/assets/img/input/close.svg" alt="close"></button>
            </div>
        </li>
        <li class="cart-list__item cart-item cart-item&#45;&#45;active">
            <div class="cart-item__check">
                <button class="check check&#45;&#45;active"></button>
            </div>
            <div class="cart-item__preview">превью<br> картинки</div>
            <div class="cart-item__stock">Shutterstock</div>
            <div class="cart-item__format">
                <div class="type">HD select</div>
            </div>
            <div class="cart-item__id">4815162342</div>
            <div class="cart-item__price">100 ₽</div>
            <div class="cart-item__favorite">
                <button class="favorite"><i class="icon icon&#45;&#45;favorite"></i></button>
            </div>
            <div class="cart-item__download">
                <button class="download"><img class="icon" src="@/assets/img/account/folder.png" alt="folder">Скачать</button>
            </div>
            <div class="cart-item__delete">
                <button class="delete"><img src="@/assets/img/input/close.svg" alt="close"></button>
            </div>
        </li>-->
    </ul>
</template>

<script setup>
import {useFileStore} from "~/stores/file";
import {storeToRefs} from "pinia";
import {useAuthStore} from "~/stores/auth";

const authStore = useAuthStore()
const {userId} = storeToRefs(authStore)
const fileStore = useFileStore()
const {files} = storeToRefs(fileStore)
const {$io} = useNuxtApp()

const download = async (data) => {
    await fileStore.downloadOne(userId, data)
    $io.disconnect()
}
const remove = async (data) => {
    await fileStore.removeOne(userId, data)
}

onMounted(() => {

    $io.connect()

    $io.emit('refreshPage')

    $io.on('fileIsReady', (data) => {
        fileStore.addLink(data)
        $io.emit('fileIsDownload', data)
    })

    $io.on('updateOrder', () => {
        fileStore.getFiles(userId)
    })

    $io.on("disconnect", () => {
        $io.connect();
    });
})

</script>

<style>

</style>