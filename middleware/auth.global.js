import {useAuthStore} from '~/stores/auth'
export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    if(to.path.includes('registration')) {
        if (authStore.isLoggedIn) {
            return navigateTo('/');
        }
    }

    if (to.path.includes('account')) {
        if (!authStore.isLoggedIn) {
            return navigateTo('/');
        }
    }

});