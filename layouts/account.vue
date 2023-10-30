<template>
    <div class="flex-page">
        <BaseHeader />
        <main class="wrapper">
            <NuxtLayout name="wrap-account">
                <slot />
            </NuxtLayout>

            <InfoSocials />
        </main>
        <LazyBaseFooter />
    </div>
</template>