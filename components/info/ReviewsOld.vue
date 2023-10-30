<template>
    <section class="page__reviews reviews">
        <div class="title-block">
            <h2 class="title-block__title">Отзывы</h2>
            <h3 class="title-block__desc">
                Вы можете оставить свой отзыв, а также посмотреть другие в нашей <a class="link-inline link-inline--invert" href="#">группе ВКонтакте<img src="@/assets/img/form-elem/link.svg" alt=""></a>
            </h3>
        </div>
        <div class="reviews__block reviews-block">
            <swiper
                :slides-per-view="4"
                :space-between="26"
                :pagination="{el: '.swiper-pagination'}"
            >
                <swiper-slide class="reviews-block__item">
                    <div class="reviews-block__user">
                        <div class="reviews-block__user-img">
                            <img src="@/assets/img/reviews/avatar.png" alt="">
                        </div>
                        <div class="reviews-block__user-title">Alina Ermolaeva</div>
                    </div>
                    <p class="reviews-block__text">
                        Просто крутые ребята!) осталась довольна. Быстро, оперативно ещё и проблему помогли решить👍 не было иллюстратора, помогли вытащить картинку. Спасибо 🙏🏻
                    </p>
                    <time class="reviews-block__date" datetime="2020-03-02 17:08">2 мар 2020 в 17:08</time>
                </swiper-slide>
                <swiper-slide class="reviews-block__item">
                    <div class="reviews-block__user">
                        <div class="reviews-block__user-img">
                            <img src="@/assets/img/reviews/avatar.png" alt="">
                        </div>
                        <div class="reviews-block__user-title">Alina Ermolaeva</div>
                    </div>
                    <p class="reviews-block__text">
                        Отличный сервис, пользуюсь им уже очень давно. Вопросов не возникало работают быстро четко. Молодцы так держать!! 🤞🏻
                    </p>
                    <time class="reviews-block__date" datetime="2020-03-02 17:08">2 мар 2020 в 17:08</time>
                </swiper-slide>
                <swiper-slide class="reviews-block__item">
                    <div class="reviews-block__user">
                        <div class="reviews-block__user-img">
                            <img src="@/assets/img/reviews/avatar.png" alt="">
                        </div>
                        <div class="reviews-block__user-title">Alina Ermolaeva</div>
                    </div>
                    <p class="reviews-block__text">
                        Просто крутые ребята!) осталась довольна. Быстро, оперативно ещё и проблему помогли решить👍 не было иллюстратора, помогли вытащить картинку. Спасибо 🙏🏻
                    </p>
                    <time class="reviews-block__date" datetime="2020-03-02 17:08">2 мар 2020 в 17:08</time>
                </swiper-slide>
                <swiper-slide class="reviews-block__item">
                    <div class="reviews-block__user">
                        <div class="reviews-block__user-img">
                            <img src="@/assets/img/reviews/avatar.png" alt="">
                        </div>
                        <div class="reviews-block__user-title">Alina Ermolaeva</div>
                    </div>
                    <p class="reviews-block__text">
                        Впервые воспользовалась сие группой! Впечатления хорошие, я довольна. Время ответа - быстрое, нужный материал также присылают достаточно быстро. После оплаты сразу же получила необходимые изображения. Группа отличная! Могу многим порекомендовать!)🙈👍🏻
                    </p>
                    <time class="reviews-block__date" datetime="2020-03-02 17:08">2 мар 2020 в 17:08</time>
                </swiper-slide>
                <swiper-slide class="reviews-block__item">
                    <div class="reviews-block__user">
                        <div class="reviews-block__user-img">
                            <img src="@/assets/img/reviews/avatar.png" alt="">
                        </div>
                        <div class="reviews-block__user-title">Alina Ermolaeva</div>
                    </div>
                    <p class="reviews-block__text">
                        Просто крутые ребята!) осталась довольна. Быстро, оперативно ещё и проблему помогли решить👍 не было иллюстратора, помогли вытащить картинку. Спасибо 🙏🏻
                    </p>
                    <time class="reviews-block__date" datetime="2020-03-02 17:08">2 мар 2020 в 17:08</time>
                </swiper-slide>
                <swiper-slide class="reviews-block__item">
                    <div class="reviews-block__user">
                        <div class="reviews-block__user-img">
                            <img src="@/assets/img/reviews/avatar.png" alt="">
                        </div>
                        <div class="reviews-block__user-title">Alina Ermolaeva</div>
                    </div>
                    <p class="reviews-block__text">
                        Отличный сервис, пользуюсь им уже очень давно. Вопросов не возникало работают быстро четко. Молодцы так держать!! 🤞🏻
                    </p>
                    <time class="reviews-block__date" datetime="2020-03-02 17:08">2 мар 2020 в 17:08</time>
                </swiper-slide>
                <swiper-slide class="reviews-block__item">
                    <div class="reviews-block__user">
                        <div class="reviews-block__user-img">
                            <img src="@/assets/img/reviews/avatar.png" alt="">
                        </div>
                        <div class="reviews-block__user-title">Alina Ermolaeva</div>
                    </div>
                    <p class="reviews-block__text">
                        Просто крутые ребята!) осталась довольна. Быстро, оперативно ещё и проблему помогли решить👍 не было иллюстратора, помогли вытащить картинку. Спасибо 🙏🏻
                    </p>
                    <time class="reviews-block__date" datetime="2020-03-02 17:08">2 мар 2020 в 17:08</time>
                </swiper-slide>
                <swiper-slide class="reviews-block__item">
                    <div class="reviews-block__user">
                        <div class="reviews-block__user-img">
                            <img src="@/assets/img/reviews/avatar.png" alt="">
                        </div>
                        <div class="reviews-block__user-title">Alina Ermolaeva</div>
                    </div>
                    <p class="reviews-block__text">
                        Впервые воспользовалась сие группой! Впечатления хорошие, я довольна. Время ответа - быстрое, нужный материал также присылают достаточно быстро. После оплаты сразу же получила необходимые изображения. Группа отличная! Могу многим порекомендовать!)🙈👍🏻
                    </p>
                    <time class="reviews-block__date" datetime="2020-03-02 17:08">2 мар 2020 в 17:08</time>
                </swiper-slide>
            </swiper>
        </div>
    </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
</script>


<style scoped lang="scss">
@import "assets/css/elems/link-inline";
@import "assets/css/info/reviews-old";
</style>