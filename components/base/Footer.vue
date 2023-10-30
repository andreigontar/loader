<template>
    <footer class="page__footer footer">
        <div class="footer__container container">
            <div class="footer__col">
                <NuxtLink class="footer__logo logo" to="/">
                    <img src="@/assets/img/logo/logo__footer.svg" alt="">
                </NuxtLink>
                <div class="footer__copyright">{{ new Date().getFullYear() }} / Все права защищены &copy; ShutterstockSale</div>
            </div>
            <div class="footer__col">
                <nav class="footer__links">
                    <li class="footer__link-item vk"><a href="https://vk.com/topic-191665932_40500960" target="_blank">Отзывы вконтакте<img src="@/assets/img/social/vk_like.png" alt=""></a></li>
                </nav>
            </div>
        </div>
    </footer>
</template>


<style scoped lang="scss">
@import "assets/css/elems/logo";
@import "assets/css/common/footer";
</style>