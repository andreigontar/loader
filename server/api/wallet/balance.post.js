import client from '@/server/prisma'

export default defineEventHandler(async (event) => {
    const {userId} = await readBody(event)

    try {
        const {balance} = await client.wallet.findFirst({
            where: {
                userId
            },
            select: {
                balance: true
            },
            orderBy: {
                date: 'desc'
            }
        })

        return String(parseFloat(balance))
    } catch (e) {
        return 0
    }

})