import {defineStore} from 'pinia'

export const useWalletStore = defineStore('wallet', () => {
    const balance = ref(0)

    const getBalance = async (userId) => {
        // if (!userId) return false // todo
        // const user = await useSupabaseUser()  // todo тут почему то работает

        const {data} = await useFetch('/api/wallet/balance', {
            method: 'POST',
            body: {userId}
        })
        balance.value = data.value
    }

    const create = async (idUser) => {

        const {id} = await $fetch('/api/user/get', {
            method: 'POST',
            body: {
                id: idUser
            },
        })
        if (id) {
            await $fetch('/api/wallet/create', {
                method: 'POST',
                body: {id}
            })
        }
    }


    return {
        create,
        getBalance,
        balance
    }
})