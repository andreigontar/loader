import client from '@/server/prisma'

// обработку ошибок сделать
export default defineEventHandler(async (event) => {
    const {links, userId} = await readBody(event)

    for (let file in links) {

        let {id, preview, type, format, size, stock, has} = links[file]

        try {
            const download = await client.download.create({
                data: {
                    userId,
                    imageId: id,
                    fileType: type,
                    stockType: stock,
                    preview,
                    size,
                    purchaseId: null,
                    stockId: null,
                    fileFormat: format,
                    hasAlready: has
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    return true
})