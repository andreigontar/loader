import {Server} from 'socket.io'
import client from '@/server/prisma'
import {SocketEvent} from '@/server/utils/SocketEvent'

let linksToDownload: any = []

export default defineNitroPlugin((nitroApp) => {

    const socketServer = new Server(
        // @ts-ignore
        useRuntimeConfig().public.socket.port, {
        serveClient: false,
        // pingTimeout: 1000, // так значительно быстрее, но больше нагрузка + autoConnect: true
        cors: {
            origin: '*'
        }
    })

    socketServer.on('connection', (socket) => {
        // socket.emit(SocketEvent.new_count, count)
        //
        // socket.on(SocketEvent.up, (message: {value: number}) => {
        //     count = count + message.value
        //     socketServer.emit(SocketEvent.new_count, count)
        // })
        //
        // socket.on('frontendUp', (message) => {
        //     console.log(message)
        //     socketServer.emit('serverSend', 'test server send')
        // })

        // socket.on('disconnect', (reason) => {
        //     console.log('New websocket disconnected', reason);
        // });

        socket.on('fileIsDownload', (data) => {
            linksToDownload.forEach((elem: any) => {
                if (elem.stock == data.stock && elem.type == data.type && elem.id == data.id) {
                    elem.isDownload = true
                    // return
                }
            })
        })

        let interval: any = null

        socket.on('finalFiles', () => {
            if (interval) clearCheck()

            let cntFiles = linksToDownload.length

            interval = setInterval(() => {
                let cntFilesIsDownload = 0
                linksToDownload.forEach((elem: any, i: any) => {
                    if (elem.isDownload) {
                        cntFilesIsDownload++
                        if (cntFiles == cntFilesIsDownload) {
                            clearCheck()
                            linksToDownload = []
                        }
                    } else {
                        console.log(`finalrep= ${elem.id}`)
                        socketServer.emit('fileIsReady', elem)
                    }
                })
            }, 1000)

        })

        socket.on('fileIsReady', (data) => {
            data.isDownload = false
            linksToDownload.push(data)
            socketServer.emit('fileIsReady', data)
            if (!interval) intervalCheck()
        })

        let intervalCheck = () => {
            interval = setInterval(() => {
                linksToDownload.forEach((elem: any) => {
                    if (!elem.isDownload) {
                        console.log(`rep= ${elem.id}`)
                        socketServer.emit('fileIsReady', elem)
                    }
                })
            }, 1000)
        }

        let clearCheck = () => {
            clearInterval(interval)
            interval = null
        }

        socket.on('refreshPage', () => {
            linksToDownload.forEach((elem: any) => elem.isDownload = true)
            clearCheck()
        })



        socket.on('balanceUpdate', (data) => {
            socketServer.emit('balanceUpdate', data)
        })

        socket.on('updateOrder', () => {
            socketServer.emit('updateOrder')
        })



        socket.on('nextQueue', ({next}) => {
            socketServer.emit('serverNext', {next})
        })

    })
})