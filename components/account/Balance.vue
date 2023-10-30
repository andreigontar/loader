<template>
    <article class="account-balance">
        <div class="account-balance__info check-info">
            <div class="check-info__title account-balance-title">Счёт</div>
            <div class="check-info__balance-title">Баланс:</div>
            <div class="check-info__balance-num">89 8296 ₽</div>
        </div>
        <form class="account-balance__fill-balance fill-balance">
            <div class="fill-balance__title account-balance-title">Пополнение баланса</div>
            <div class="fill-balance__title-sum account-balance-sub-title">Сумма</div>
            <div class="fill-balance__tip account-balance-tip">Сумма поплнения баланса от 70 ₽</div>
            <div class="fill-balance__label account-balance-label">Введите жалаемую сумму:</div>
            <input class="fill-balance__field-sum account-balance-field" type="text" placeholder="70 ₽">
            <div class="fill-balance__type-pay account-balance-sub-title">Способ оплаты</div>
<!--            <img class="fill-balance__pay-methods-img" src="@/assets/img/account/pay-methods.png" alt="payment methods">-->
            <div class="fill-balance__tip-pay account-balance-tip">Оплата принимается любой банковской картой (MasterCard, VISA, МИР), ЮMoney и QIWI.<br> Оплата производится на физические счета ЮMoney и QIWI.</div>
            <div class="fill-balance__label account-balance-label">Выберите способ оплаты:</div>
            <fieldset class="fill-balance__check-pay-block">
                <div class="check-pay">
                    <input class="check-pay__input" type="radio" id="yoomoney" name="type-pay" value="yoomoney" checked>
                    <label class="check-pay__label" for="yoomoney">
                        <div class="check-pay__title-block">
                            <svg class="check-pay__icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="10" cy="10" r="9.5" stroke="none" />
                                <circle cx="10" cy="10" r="5" fill="none" stroke="none" />
                            </svg>
                            <div class="check-pay__text">На ЮMoney</div>
                        </div>
<!--                        <img class="check-pay__logo" src="@/assets/img/account/yoomoney.png" alt="">-->
                        <ul class="check-pay__desc-list">
                            <li class="check-pay__desc-item">Банковской картой</li>
                            <li class="check-pay__desc-item">Счет ЮMoney</li>
                        </ul>
                    </label>
                </div>
                <div class="check-pay">
                    <input class="check-pay__input" type="radio" id="qiwi" name="type-pay" value="qiwi">
                    <label class="check-pay__label" for="qiwi">
                        <div class="check-pay__title-block">
                            <svg class="check-pay__icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="10" cy="10" r="9.5" stroke="none" />
                                <circle cx="10" cy="10" r="5" fill="none" stroke="none" />
                            </svg>
                            <div class="check-pay__text">На QIWI</div>
                        </div>
<!--                        <img class="check-pay__logo" src="@/assets/img/account/qiwi.png" alt="">-->
                        <ul class="check-pay__desc-list">
                            <li class="check-pay__desc-item">Банковской картой</li>
                            <li class="check-pay__desc-item">Счет QIWI</li>
                        </ul>
                    </label>
                </div>
            </fieldset>
            <button class="fill-balance__action btn-main" disabled>Пополнить баланс</button>
        </form>
    </article>
</template>


<style scoped lang="scss">
//@import "assets/css/elems/radio";
//@import "assets/css/account/balance";
</style>