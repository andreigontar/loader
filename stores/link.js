import {defineStore} from "pinia";

export const useLinkStore = defineStore('link', () => {

    const links = ref([])

    const clearLinks = () => {
        const isNumeric = (str) => !isNaN(str) && !isNaN(parseFloat(str))

        links.value.forEach((elem, i) => {
            if (isNumeric(elem.id.trim())) return

            let num = elem.id.match(/\d+(\d+){4}?/g)
            if (!num) {
                links.value.splice(i, 1)
            } else {
                elem.id = num[0]
            }
        })

        links.value = checkSameLinks(links.value)
    }

    const checkSameLinks = (links) => {
        let uniq = []

        links.forEach((elem, i) => {
            if (uniq.indexOf(elem.id) != -1) {
                links.splice(i, 1)
            } else {
                uniq.push(elem.id)
            }
        })

        return links
    }

    const packageLinks = (stocks) => {
        // todo ошибку показывать после получения инфы о картинке, подсвечивать (пока только textarea) и не добавлять id
        let arrLinks = []

        for (let stock in stocks) {
            let types = stocks[stock].type
            for (let type in types) {
                let textarea = types[type].text
                let arrByNewLine = textarea.split('\n')
                arrByNewLine = arrByNewLine.map(elem => elem.trim())
                arrByNewLine.forEach((item) => {
                    let arrBySpace = item.split(' ')
                    if (arrBySpace) arrBySpace.forEach((el) => {
                        if (el) {
                            arrLinks.push({
                                stock,
                                type,
                                id: el
                            })
                        }
                    })
                })
            }
        }

        links.value = arrLinks
    }

    return {
        packageLinks,
        clearLinks,
        links
    }
})