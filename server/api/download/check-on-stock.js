import client from '@/server/prisma'

export default defineEventHandler(async (event) => {
    const {links} = await readBody(event)

    let linksWithEx = []

    try {
        for (let link of links) {
            let data = await client.stock.findFirst({
                where: {
                    stockType: link.stock,
                    fileType: link.type,
                    imageId: String(link.id)
                },
                select: {
                    imageId: true,
                    fileFormat: true,
                    stockType: true,
                    fileType: true,
                    preview: true,
                    size: true
                }
            })

            if (data) {
                linksWithEx.push({
                    id: data.imageId,
                    format: data.fileFormat,
                    stock: data.stockType,
                    type: data.fileType,
                    preview: data.preview,
                    size: data.size,
                    has: true
                })
            } else {
                link.has = false
                linksWithEx.push(link)
            }
        }
    } catch (e) {
        console.log(e)
    }

    return linksWithEx
})