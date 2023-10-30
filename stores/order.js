import {defineStore, storeToRefs} from "pinia";
import {useFileStore} from "~/stores/file";

// если была ошибка со скачкой у конкурента, пропустить и делать другие, сумму списать только за скаченное

// проверка необходимой суммы в кошельке
// здесь скачиваем у конкурентов, вычитаем сумму из кошелька, закачиваем на dropbox (сделать отдельно store) и отдаём ссылку + лицензии отдельный store
export const useOrderStore = defineStore('order', () => {
    // передавать сюда link и/или id на файл (так же записать это изначально в таблицу download)

    const order = async (userId) => {
        const fileStore = useFileStore()

        const data = await $fetch(`/api/order/main`, {
            method: 'POST',
            body: {userId: userId.value},
        })
        // todo тут выводить какую то инфу об ошибке
        // TODO пересчёт суммы если что то не скачалось

        return data
    }

    return {
        order
    }
})