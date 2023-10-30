import client from '@/server/prisma'

export default defineEventHandler(async (event) => {
    const {links, userId} = await readBody(event)
    let clearLinks = []

    try {
        for (let link of links) {
            let data = await client.download.findFirst({
                where: {
                    userId,
                    stockType: link.stock,
                    fileType: link.type,
                    imageId: String(link.id)
                }
            })

            if (!data) {
                clearLinks.push(link)
            } else {
                if (data.purchaseId) {
                    console.log(`file already bought ${link.id}`)
                    // TODO выводить что "файл куплен уже" для человека
                } else {
                    console.log(`file already add ${link.id}`)
                }
            }
        }
    } catch (e) {
        console.log(e)
    }

    return clearLinks
})