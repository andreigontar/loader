import client from '@/server/prisma'

export default defineEventHandler(async (event) => {
    const {userId, stock, type, id: imageId} = await readBody(event)

    try {
        let {id: downloadId} = await client.download.findFirst({
            where: {
                userId,
                imageId,
                stockType: stock,
                fileType: type
            },
            select: {
                id: true
            }
        }) || {}

        if (!downloadId) return false

        let remove = await client.download.delete({
            where: {
                id: downloadId
            },
        })

        return !!remove
    } catch (e) {
        console.log(e)
    }
})