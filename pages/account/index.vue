<template>
    <div class="profile">
        <h1 class="title-account">Настройки аккаунта</h1>
        <div class="profile__id-user id-user">
            <div class="id-user__title">id пользователя</div>
            <div class="id-user__number"><i class="icon-copy"></i>434534636w3rraw3534634737</div>
        </div>
<!--    TODO На Email тоже Formkit    -->
        <div class="profile__email email">
            <p class="email__title">E-mail</p>
            <p class="email__current">mail@mail.com</p>
            <button class="email__change">Изменить e-mail<i class="icon-edit"></i></button>
        </div>
        <div class="profile__change-password change-password">
            <p class="change-password__title">Изменить пароль</p>
<!--            <FormKit
                id="changepassword"
                type="form"
                #default="{ state: { valid } }"
                :actions="false"
                @submit="changepassword"
            >
                <FormKit
                    autocomplete
                    type="password"
                    name="password"
                    placeholder="Старый пароль"
                    suffix-icon="eyeClosed"
                    @suffix-icon-click="passwordEye"
                    v-model="password"
                    validation-visibility="dirty"
                    validation="required"
                    :validation-messages="{
                        required: 'введите ваш пароль',
                        length: 'пароль должен быть от 6 до 30 символов',
                        matches: 'используется недопустимый символ',
                    }"
                />

                <FormKit
                    type="password"
                    name="password_confirm"
                    placeholder="Новый пароль"
                    suffix-icon="eyeClosed"
                    @suffix-icon-click="passwordEye"
                    v-model="confirmPassword"
                    validation-visibility="dirty"
                    validation="required"
                    :validation-messages="{
                        required: 'подтвердите пароль',
                        confirm: 'пароли не совпадают',
                    }"
                />

                <div class="change-password__hcaptcha">
                    <vue-hcaptcha
                        :sitekey="sitekey"
                        @verify="verifyCaptcha"
                        @expired="expiredCaptcha"
                    />
                </div>

            </FormKit>-->
        </div>
    </div>
</template>


<script setup>
definePageMeta({
    layout: 'account',
});

import {setErrors, clearErrors, FormKitMessages} from '@formkit/vue'
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
</script>

<style scoped lang="scss">
@import "assets/css/account/profile";
</style>