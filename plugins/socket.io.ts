import { io } from "socket.io-client"

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig().public.socket;

    const socket = io(`${config.url}:${config.port}`, {
        autoConnect: false
    })

    nuxtApp.provide('io', socket)
})


// import { Manager } from "socket.io-client"
//
// export default defineNuxtPlugin((nuxtApp) => {
//     const config = useRuntimeConfig().public.socket;
//
//     const manager = new Manager(`${config.url}:${config.port}`, {
//         autoConnect: false
//     })
//
//     nuxtApp.provide('io', manager)
// })