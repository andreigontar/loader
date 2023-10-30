import client from "~/server/prisma";
import {socketDownload} from "~/server/utils/socket.io";
import {
    setPaymentIntoDB,
    createDirectoryOnServer,
} from '~/server/order/file-manager';

export const putInQueue = async (userId) => {
    const {id} = await client.queue.create({
        data: {
            userId
        }
    })

    return id
}

export const removeFromQueue = async (id) => {
    await client.queue.delete({
        where: {
            id
        }
    })

    const queue = await client.queue.findFirst({
        orderBy: [{
            id: 'asc',
        }],
    })

    if (queue) {
        socketDownload.emit('nextQueue', {next: queue.userId})
    } else {
        socketDownload.emit('nextQueue', {next: null})
    }
}

export const waitingInQueue = async ({userId, funds, files}) => {
    return await new Promise(async (resolve, reject) => {

        const queueId = await putInQueue(userId)

        const purchaseId = await setPaymentIntoDB(userId, funds)
        socketDownload.emit('updateOrder')

        let isCreated = await createDirectoryOnServer(purchaseId, files)
        if (!isCreated) return false

        const queue = await client.queue.findMany({
            orderBy: [{
                id: 'desc',
            }],
        })

        if (queue[0].userId == userId && queue.length == 1) {
            console.log(`Очереди нет для ${userId}`)
            resolve({queueId, purchaseId})
        } else {
            console.log(`Встал в очередь ${userId}`)

            socketDownload.on('serverNext', ({next}) => {
                if (next == userId) {
                    console.log(`Пришла очередь для ${next}`)
                    resolve({queueId, purchaseId})
                }
            })
        }
    })
}