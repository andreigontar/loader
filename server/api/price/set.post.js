import client from '@/server/prisma'

export default defineEventHandler(async (event) => {
    const {userId} = await readBody(event)

    try {
        const files = await client.download.findMany({
            where: {
                userId,
                purchaseId: null
            },
            select: {
                imageId: true,
                fileType: true,
                stockType: true,
            }
        })

        let resFiles = setCount(files)
        resFiles = await setPriceFromTable(resFiles)
        await setPriceIntoDB(resFiles, userId)

    } catch (e) {
        console.log(e, "\n ошибка при проставлении цен в базу")
    }

    return true
})


const setCount = (files) => {
    let countFiles = {}

    files.forEach(elem => {
        if (!countFiles.hasOwnProperty(elem.stockType)) {
            countFiles[elem.stockType] = {}
            countFiles[elem.stockType][elem.fileType] = {'CNT': 1}
        } else {
            if (!countFiles[elem.stockType].hasOwnProperty(elem.fileType)) {
                countFiles[elem.stockType][elem.fileType] = {'CNT': 1}
            } else {
                countFiles[elem.stockType][elem.fileType]['CNT']++
            }
        }
    })

    return countFiles
}

const setPriceFromTable = async (files) => {
    for (let stock in files) {
        for (let type in files[stock]) {
            const table = await client.price.findFirst({
                where: {
                    stock,
                    type
                },
            })

            const cnt = files[stock][type]['CNT']
            const arrPrice = table.value.split('|')
            const arrCount = table.count.split('|')

            for (let i = 0; i < arrCount.length; i++){
                const item = arrCount[i]
                if (i != (arrCount.length - 1)) {
                    if (cnt <= item) {
                        files[stock][type]['PRICE'] = parseInt(arrPrice[i])
                        break
                    }
                } else {
                    files[stock][type]['PRICE'] = parseInt(arrPrice[i])
                    break
                }
            }
        }
    }

    return files
}

const setPriceIntoDB = async (files, userId) => {
    for (let stock in files) {
        for (let type in files[stock]) {
            try {
                await client.download.updateMany({
                    where: {
                        userId,
                        purchaseId: null,
                        stockType: stock,
                        fileType: type,
                    },
                    data: {
                        cost: files[stock][type]['PRICE']
                    }
                })
            } catch (e) {
                console.log(e, "\n ошибка при записи цен в базу")
            }
        }
    }
}


