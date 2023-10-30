import {Dropbox} from 'dropbox'

export const dropbox = new Dropbox({
    refreshToken: useRuntimeConfig().dropbox.refreshToken,
    clientSecret: useRuntimeConfig().dropbox.clientSecret,
    clientId: useRuntimeConfig().dropbox.clientId,
})