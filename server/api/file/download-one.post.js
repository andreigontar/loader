import client from '@/server/prisma'

export default defineEventHandler(async (event) => {
    const {userId, stock, type, id: imageId} = await readBody(event)

    try {
        let listToHide = false,
            isAll = false

        let {stockId, id: downloadId, purchaseId} = await client.download.findFirst({
            where: {
                userId,
                imageId,
                stockType: stock,
                fileType: type
            },
            select: {
                stockId: true,
                id: true,
                purchaseId: true
            }
        })

        if (!stockId) return false

        let {link} = await client.stock.findFirst({
            where: {
                id: stockId
            },
            select: {
                link: true
            }
        })

        await client.download.update({
            where: {
                id: downloadId
            },
            data: {
                clientSave: true
            }
        })

        isAll = await client.download.findFirst({
            where: {
                userId,
                purchaseId,
                clientSave: false
            }
        })

        if (!(!!isAll)) {
            listToHide = await client.download.findMany({
                where: {
                    userId,
                    purchaseId,
                },
                select: {
                    imageId: true,
                    stockType: true,
                    fileType: true
                }
            })
        }

        return {link, isAll: !(!!isAll), listToHide}

    } catch (e) {
        console.log(e)
    }
})