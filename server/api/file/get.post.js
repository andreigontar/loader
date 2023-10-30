import client from '@/server/prisma'

// обработку ошибок сделать
export default defineEventHandler(async (event) => {
    const {userId} = await readBody(event)

    try {
        const files = await client.$queryRaw`
            SELECT 
            stockType, fileType, fileFormat, size, imageId, cost,
            CASE 
                WHEN stockId <> FALSE THEN (SELECT link FROM Stock s WHERE s.id = d.stockId)
            END as link,
            CASE 
                WHEN stockId <> FALSE THEN (SELECT preview  FROM Stock s WHERE s.id = d.stockId)
                ELSE preview
            END as preview,
            IF (purchaseId, 'true', 'false') as isOrdered
            FROM Download d
            WHERE userId = ${userId}
            AND purchaseId is NULL
            OR
            userId = ${userId}
            AND
            purchaseId IN (SELECT purchaseId FROM Download WHERE clientSave = FALSE);`

        transformValue(files)

        return files
    } catch (e) {
        console.log(e)
    }
})


const transformValue = (files) => {
    files.map((file) => {
        let type = file.fileType
        switch (type) {
            case 'SHUTTERSTOCK_HD':
            case 'ADOBESTOCK_HD':
            case 'ISTOCK_HD':
                file.fileFormat = 'HD'
                break
            case 'SHUTTERSTOCK_HD_SELECT':
                file.fileFormat = 'HD SELECT'
                break
            case 'SHUTTERSTOCK_4K':
            case 'ADOBESTOCK_4K':
            case 'ISTOCK_4K':
                file.fileFormat = '4K'
                break
            case 'SHUTTERSTOCK_4K_SELECT':
                file.fileFormat = '4K SELECT'
                break
        }
        return file
    })
}