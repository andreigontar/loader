<template>
    <template v-if="!isLoggedIn">
        <InfoPromo />
        <InfoPrice />
        <InfoImportant />
        <InfoInstruction />
        <InfoReviews />
    </template>
    <template v-else>
        <DownloadMain />
    </template>
<!--        <ActionFiles/>-->
<!--        <InfoOrderWork />-->
<!--        <InfoReviewsOld />-->
<!--        <InfoNotes />-->
    <InfoSocials/>
</template>


<script setup>
import {useAuthStore} from "@/stores/auth";
import {storeToRefs} from "pinia";

const route = useRoute()
const authStore = useAuthStore()
const {isLoggedIn} = storeToRefs(authStore)

/*========================== confirmed ==========================*/
onBeforeMount(async () => {
    await authStore.checkSignUpConfirm()
})
</script>