import client from '@/server/prisma'

export default defineEventHandler(async (event) => {
    const {id} = await readBody(event)

    try {
        const wallet = await client.wallet.create({
            data: {
                userId: id,
                balance: 0,
            }
        })

        return wallet
    } catch (e) {
        console.log('wallet error', e)
        // todo ошибка создания кошелька в логи и оповещение в админку
    }
})
