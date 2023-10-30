// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    app: {
        head: {
            title: 'shutter',
            htmlAttrs: {
                lang: 'en'
            },
            meta: [
                { charset: 'utf-8' },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1'
                },
                {
                    name: 'description',
                    content: ''
                },
                {
                    name: 'format-detection',
                    content: 'telephone=no'
                }
            ],
            link: [
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: '/favicon.ico'
                }
            ],
            bodyAttrs: {
                class: 'page'
            }
        }
    },
    css: [
        '@/assets/css/support/reset.scss',
        '@/assets/css/support/main.scss'
    ],
    modules: [
        // 'nuxt-purgecss',
        '@pinia/nuxt',
        '@nuxtjs/supabase',
        '@formkit/nuxt'
    ],
    runtimeConfig: {
        vkGroup: process.env.VK_GROUP,
        telegramQ: process.env.TELEGRAM_Q,
        telegramGroup: process.env.TELEGRAM_GROUP,
        mail: process.env.MAIL,
        infoMail: process.env.MAIL_INFO,
        hcaptchaSiteKey: process.env.HCAPTCHA_SITE_KEY,
        public: {
            socket: {
                port: process.env.SOCKET_PORT,
                url: process.env.SOCKET_URL
            }
        },
        dropbox: {
            refreshToken: process.env.DROPBOX_REFRESH_TOKEN,
            clientSecret: process.env.DROPBOX_CLIENT_SECRET,
            clientId: process.env.DROPBOX_CLIENT_ID,
        },
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/assets/css/support/var.scss";',
                },
            },
        },
    },
    nitro: {
        plugins: [
            './plugins/socket.io.server.ts',
        ]
    },
})
