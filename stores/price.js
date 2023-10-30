import {defineStore, storeToRefs} from "pinia";
import {useAuthStore} from "~/stores/auth";

export const usePriceStore = defineStore('price', () => {

    const setPrice = async () => {
        const authStore = useAuthStore()
        const {userId} = storeToRefs(authStore)

        await $fetch(`/api/price/set`, {
            method: 'POST',
            body: {
                userId: userId.value
            },
        })
    }

    return {
        setPrice
    }
})