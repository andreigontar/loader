import client from '@/server/prisma'

export default defineEventHandler(async (event) => {
    const data = await readBody(event)

    try {
        let user = null
        if (data.email) {
            user = await client.user.findFirst({
                where: {
                    email: data.email
                },
            })
        } else if (data.id) {
            user = await client.user.findFirst({
                where: {
                    id: data.id
                },
            })
        }
        return user
        // TODO возвращать только необходимое
    } catch (e) {
        console.log(e)
    }
})