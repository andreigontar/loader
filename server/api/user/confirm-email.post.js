import client from '@/server/prisma'

// TODO найти пользователя сначала !
// TODO ошибку в лог записывать
export default defineEventHandler(async (event) => {
    try {
        const {id} = await readBody(event)

        await client.user.update({
            where: {id},
            data: {confirmed: true},
        })

        return {error: false, server: true}
    } catch (e) {
        return {error: true, server: true}
    }
})
