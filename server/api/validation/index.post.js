import {object, string, ref} from 'yup';

export default defineEventHandler(async (event) => {
    let {email, password, password_confirm, isLogin} = await readBody(event)
    email = email.trim()
    password = password.trim()

    if (!isLogin) password_confirm = password_confirm.trim();
    let authScheme = {};

    const loginScheme = {
        email:
                string('используется недопустимый формат')
                .required('введите ваш e-mail адрес')
                .email('неправильный e-mail адрес'),
        password:
                string('используется недопустимый формат')
                .required('введите ваш пароль')
                .min(6, 'пароль должен быть минимум 6 символов')
                .max(30, 'пароль должен быть максимум 30 символов')
                .matches(/[^a-zA-Z]/, 'используется недопустимый символ')
    }

    const registerScheme = {
        password_confirm:
                string('используется недопустимый формат')
                .required('подтвердите пароль')
                .oneOf([ref('password'), null], 'пароли не совпадают')
    }

    if (!isLogin) {
        authScheme = object(Object.assign(loginScheme, registerScheme))
    } else {
        authScheme = object(loginScheme)
    }

    try {
        if (!isLogin) {
            await authScheme.validate({email, password, password_confirm})
        } else {
            await authScheme.validate({email, password})
        }

        return {
            email: email.trim(),
            password: password.trim(),
            error: false,
            server: false
        }
    } catch (e) {
        return {
            input: e.path,
            message: e.errors[0],
            error: true,
            server: false
        }
    }
})
