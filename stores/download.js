import {defineStore, storeToRefs} from "pinia";
import {useFileStore} from "./file";
import {useLinkStore} from "./link";
import {useAuthStore} from "./auth";
import {usePriceStore} from "./price";

export const useDownloadStore = defineStore('download', () => {

    const linkStore = useLinkStore()
    const {links} = storeToRefs(linkStore)
    const authStore = useAuthStore()
    const {userId} = storeToRefs(authStore)

    const isDisabled = computed(() => {
        for (let elem in stock.value) {
            let typeFile = stock.value[elem].type

            for (let format in typeFile) {
                if (typeFile[format].text) return false
            }
        }
        return true
    })

    const isAdding = ref(false)

    const stock = ref({
        'SHUTTERSTOCK': {
            check: true,
            type: {
                'IMAGE': {
                    check: true,
                    name: 'Изображения / фото / вектор',
                    text: ref()
                },
                'SHUTTERSTOCK_HD': {
                    check: false,
                    name: 'Видео FULL HD',
                    text: ref('')
                },
                'SHUTTERSTOCK_4K': {
                    check: false,
                    name: 'Видео 4k',
                    text: ref('')
                },
                'SHUTTERSTOCK_HD_SELECT': {
                    check: false,
                    name: 'Видео HD SELECT',
                    text: ref('')
                },
                'SHUTTERSTOCK_4K_SELECT': {
                    check: false,
                    name: 'Видео 4k SELECT',
                    text: ref('')
                },
                'SHUTTERSTOCK_AUDIO': {
                    check: false,
                    name: 'Аудио',
                    text: ref('')
                }
            }
        },
        'DEPOSITPHOTOS': {
            check: false,
            type: {
                'IMAGE': {
                    check: true,
                    name: 'Изображения / фото / вектор',
                    text: ref('')
                }
            }
        },
        'ISTOCK': {
            check: false,
            type: {
                'IMAGE': {
                    check: true,
                    name: 'Изображения / фото / вектор',
                    text: ref('')
                },
                'ISTOCK_HD': {
                    check: false,
                    name: 'Видео FULL HD',
                    text: ref('')
                },
                'ISTOCK_4K': {
                    check: false,
                    name: 'Видео 4k',
                    text: ref('')
                }
            }
        },
        'ADOBESTOCK': {
            check: false,
            type: {
                'IMAGE': {
                    check: true,
                    name: 'Изображения / фото / вектор / шаблоны',
                    text: ref()
                },
                'ADOBESTOCK_HD': {
                    check: false,
                    name: 'Видео HD',
                    text: ref()
                },
                'ADOBESTOCK_4K': {
                    check: false,
                    name: 'Видео 4k',
                    text: ref()
                }
            }
        },
        // freepik, 123rf, dreamstime
    })

    const addToOrder = async (stocks) => {
        isAdding.value = true
        const priceStore = usePriceStore()
        const fileStore = useFileStore()

        linkStore.packageLinks(stocks)
        return
        linkStore.clearLinks()

        await checkExistInDownloadList()
        await checkFileOnStock()
        await getInfoImage()

        await checkChangeType()
        await setImageToDb()
        clearStock()

        await priceStore.setPrice()
        await fileStore.getFiles()
        isAdding.value = false
        // console.log(links.value)
    }

    const clearStock = () => {
        for (let item in stock.value) {
            let stockType = stock.value[item].type

            for (let type in stockType) {
                stockType[type].text = ''
            }
        }
    }

    const getInfoImage = async () => {
        let orders = links.value

        for (let i in orders) {
            let data = null,
                order = orders[i]

            if (order.has) continue

            switch (order.stock) {
                case 'SHUTTERSTOCK':
                    data = await $fetch(`/api/info/shutterstock`, {
                        method: 'POST',
                        body: order
                    })
                    break
                case 'DEPOSITPHOTOS':
                    data = await $fetch(`/api/info/depositphotos`, {
                        method: 'POST',
                        body: order
                    })
                    break
                case 'ADOBESTOCK':
                    data = await $fetch(`/api/info/adobestock`, {
                        method: 'POST',
                        body: order
                    })
                    break
                case 'ISTOCK':
                    data = await $fetch(`/api/info/istock`, {
                        method: 'POST',
                        body: order
                    })
                    break
            }

            if (data) {
                Object.assign(order, data)
            } else {
                orders.splice(i, 1)
            }
        }
    }

    const setImageToDb = async () => {

        await $fetch(`/api/download/create`, {
            method: 'POST',
            body: {
                links: links.value,
                userId: userId.value
            },
        })
    }

    const checkExistInDownloadList = async () => {
        // todo возвращать (какие файлы уже куплены клиентом и оповещать его)

        links.value = await $fetch(`/api/download/check-exist`, {
            method: 'POST',
            body: {
                links: links.value,
                userId: userId.value
            },
        })
    }

    const checkFileOnStock = async () => {

        links.value = await $fetch(`/api/download/check-on-stock`, {
            method: 'POST',
            body: {
                links: links.value
            },
        })
    }

    const checkChangeType = async () => {
        const authStore = useAuthStore()
        const {userId} = storeToRefs(authStore)

        for (const item of links.value) {
            if (item?.changeType) {
                await checkExistInDownloadList(userId)
                await checkFileOnStock(userId)
            }
        }
    }


    return {
        stock,
        addToOrder,
        clearStock,
        isDisabled,
        isAdding
    }
})