import { io } from "socket.io-client"

const config = useRuntimeConfig().public.socket;
export const socketDownload = io(`${config.url}:${config.port}`, {
    autoConnect: true
})

