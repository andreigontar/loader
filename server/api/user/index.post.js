import client from '@/server/prisma'

export default defineEventHandler(async (event) => {
    try {
        const {id, email} = await readBody(event)

        const user = await client.user.create({
            data: {id, email}
        })

        return {error: false, server: true}
    } catch (e) {
        return {error: true, server: true}
    }
})
