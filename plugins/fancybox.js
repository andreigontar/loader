import {Fancybox} from '@fancyapps/ui'
import "@fancyapps/ui";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('fancybox', Fancybox)
})