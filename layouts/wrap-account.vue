<template>
    <section class="page__account account">
        <div class="account__block">
            <AccountNavigate class="account__nav"/>
            <article class="account__content">
                <slot />
            </article>
        </div>
    </section>
</template>

<style scoped lang="scss">@import "assets/css/account/main";</style>