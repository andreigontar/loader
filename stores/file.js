import {defineStore, storeToRefs} from "pinia";
import {usePriceStore} from "~/stores/price";
import {useAuthStore} from "~/stores/auth";

export const useFileStore = defineStore('file', () => {

    const files = ref(null)

    const getFiles = async () => {
        const authStore = useAuthStore()
        const {userId} = storeToRefs(authStore)

        const {data} = await useFetch('/api/file/get', {
            method: 'POST',
            body: {
                userId: userId.value
            },
        })

        setPreviewIfNull(data.value)
        files.value = data.value
    }


    const setPreviewIfNull = (files) => {
        files.map((file) => {
            let type = file.fileType
            if (!file.preview) {
                switch (type) {
                    case 'IMAGE':
                        file.preview = previewPath('image')
                        break
                    case 'SHUTTERSTOCK_AUDIO':
                        file.preview = previewPath('audio')
                        break
                    default:
                        file.preview = previewPath('video')
                }
                return file
            }
        })
    }

    const previewPath = (path) => {
        const assets = import.meta.glob('@/assets/img/preview/**/*', {
            eager: true,
            import: 'default',
        })
        return assets['/assets/img/preview/' + path + '.svg']
    }


    const downloadOne = async (userId, {stock, type, id}) => {
        const {link, isAll, listToHide} = await $fetch('/api/file/download-one', {
            method: 'POST',
            body: {
                userId: userId.value,
                stock, type, id
            },
        })

        if (!link) return false
        window.location.href = link

        if (isAll) {
            setTimeout(() => {
                listToHide.forEach(hideEl => {
                    files.value = files.value.filter(elem => {
                        let isRemove = elem.imageId != hideEl.imageId || elem.fileType != hideEl.fileType || elem.stockType != hideEl.stockType
                        return isRemove
                    })
                })
            }, 3500)
        }

        return true
    }

    const removeOne = async (userId, {stock, type, id}) => {
        const priceStore = usePriceStore()
        const fileStore = useFileStore()

        const data = await $fetch('/api/file/remove-one', {
            method: 'POST',
            body: {
                userId: userId.value,
                stock, type, id
            }
        })

        await priceStore.setPrice(userId)
        await fileStore.getFiles(userId)
    }

    const addLink = ({stock, type, id, link}) => {
        files.value.forEach(elem => {
            if (elem.imageId == id && elem.fileType == type && elem.stockType == stock) {
                elem.link = link
                return true
            }
        })
    }

    const detailedInformation = computed(() => {

        let infoFiles = {}

        if (!files.value) return infoFiles

        const setProperties = (item) => {
            if (!infoFiles[item.stockType].hasOwnProperty(item.fileType)) {
                infoFiles[item.stockType][item.fileType] = {}
                infoFiles[item.stockType][item.fileType].cost = item.cost
                infoFiles[item.stockType][item.fileType].count = 1
                infoFiles[item.stockType][item.fileType].title = ''
                infoFiles[item.stockType][item.fileType].desc = ''
            } else {
                infoFiles[item.stockType][item.fileType].count++
            }
        }

        files.value.forEach(item => {
            if (item.isOrdered === 'false') {
                if (!infoFiles.hasOwnProperty(item.stockType)) infoFiles[item.stockType] = {}
                setProperties(item)
            }
        })

        const tableFiles = {
            'SHUTTERSTOCK': {
                types: {
                    'IMAGE':                  'Shutterstock — изобр.',
                    'SHUTTERSTOCK_HD':        'Shutterstock — hd',
                    'SHUTTERSTOCK_4K':        'Shutterstock — 4k',
                    'SHUTTERSTOCK_HD_SELECT': 'Shutterstock — hd select',
                    'SHUTTERSTOCK_4K_SELECT': 'Shutterstock — 4k select',
                    'SHUTTERSTOCK_AUDIO':     'Shutterstock — аудио',
                }
            },
            'DEPOSITPHOTOS': {
                types: {
                    'IMAGE':         'Depositphotos — изобр.',
                }
            },
            'ISTOCK': {
                types: {
                    'IMAGE':         'Istock — изобр.',
                    'ISTOCK_HD':     'Istock — hd',
                    'ISTOCK_4K':     'Istock — 4k',
                }
            },
            'ADOBESTOCK': {
                types: {
                    'IMAGE':         'Adobe Stock — изобр.',
                    'ADOBESTOCK_HD': 'Adobe Stock — hd',
                    'ADOBESTOCK_4K': 'Adobe Stock — 4k',
                }
            },
        }

        for (let stock in infoFiles) {
            for (let type in infoFiles[stock]) {
                let count = infoFiles[stock][type].count
                let cost = infoFiles[stock][type].cost

                infoFiles[stock][type].title = tableFiles[stock].types[type]
                infoFiles[stock][type].desc = `${count} шт. - ${count * cost} ₽ (${cost}₽/шт)`
            }
        }

        return infoFiles
    })

    const finalPrice = computed(() => {
        let final = 0
        if (!files.value) return final
        files.value.forEach(item => {
            if (item.isOrdered === 'false') {
                final += item.cost
            }
        })
        return final
    })

    return {
        files,
        detailedInformation,
        finalPrice,
        getFiles,
        downloadOne,
        removeOne,
        addLink
    }
})