<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperType } from 'swiper'
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Define props
const props = defineProps<{
  items: any[]
  uniqueKey?: string
  buttonClassPrefix?: string
  swiperClass?: string
}>()

// Swiper modules
const swiperModules = [Navigation, Pagination, Mousewheel, Keyboard]

const onSwiper = (swiper: SwiperType) => {
  // Один раз при создании: пересчёт размеров и старт с первого слайда (без сброса при прокрутке)
  nextTick(() => {
    swiper.update()
    swiper.slideTo(0, 0)
  })
}

// Emit для обработки кликов
const emit = defineEmits<{
  (e: 'itemClick', item: any, index: number): void
}>()

const handleItemClick = (item: any, index: number) => {
  emit('itemClick', item, index)
}
</script>

<template>
  <div class="tape-swiper-wrapper">
    <Swiper
      :modules="swiperModules"
      :initial-slide="0"
      @swiper="onSwiper"
      :loop="true"
      :loop-additional-slides="4"
      :loop-prevents-sliding="false"
      :watch-slides-progress="true"
      :slides-per-view="1"
      :centered-slides="false"
      :space-between="16"
      :breakpoints="{
        768: {
          slidesPerView: 2.2,
          spaceBetween: 32,
          loopAdditionalSlides: 4,
          centeredSlides: false,
        },
      }"
      :navigation="{
        nextEl: `.${buttonClassPrefix || 'tape'}-swiper-button-next`,
        prevEl: `.${buttonClassPrefix || 'tape'}-swiper-button-prev`,
      }"
      :pagination="{ clickable: true }"
      :mousewheel="{ forceToAxis: true }"
      :keyboard="{ enabled: true }"
      :class="`tape-swiper w-full ${swiperClass || ''}`"
    >
      <SwiperSlide
        v-for="(item, index) in items"
        :key="uniqueKey ? item[uniqueKey] : item.id || index"
        class="tape-slide"
      >
        <div class="tape-slide-content" @click="handleItemClick(item, index)">
          <slot :item="item" :index="index" />
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- Кастомные кнопки навигации -->
    <div :class="`${buttonClassPrefix || 'tape'}-swiper-button-prev tape-nav-button`"></div>
    <div :class="`${buttonClassPrefix || 'tape'}-swiper-button-next tape-nav-button`"></div>
  </div>
</template>

<style scoped>
/* Обертка для свайпера и кнопок */
.tape-swiper-wrapper {
  position: relative;
  width: 100%;
}

/* Swiper styles для эффекта ленты */
.tape-swiper {
  /* Симметричные отступы: padding слева/справа адаптируем под десктоп/мобайл */
  padding: 0 60px 50px 60px;
  overflow: visible;
  position: relative;
}

/* Центрируем контейнер свайпера */
.tape-swiper :deep(.swiper-container) {
  margin: 0 auto;
  position: relative;
}

.tape-swiper :deep(.swiper-wrapper) {
  align-items: center;
  display: flex;
  /* Не задаём transform — им управляет Swiper для сдвига слайдов */
}

.tape-swiper :deep(.swiper-container) {
  overflow: visible;
}

.tape-swiper :deep(.swiper-slide) {
  visibility: visible !important;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  transform: translateZ(0);
}

/* Базовые стили для всех слайдов */
.tape-slide {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

/* Все слайды - затемненные по умолчанию */
.tape-slide {
  opacity: 0.3;
  transform: scale(0.8);
  filter: brightness(0.3) blur(2px);
  pointer-events: none;
}

/* Два центральных видимых слайда - активный и следующий (по классам Swiper: active и next) */
.tape-slide.swiper-slide-active,
.tape-slide.swiper-slide-next,
.tape-slide.swiper-slide-active + .tape-slide,
.tape-slide.swiper-slide-duplicate-active,
.tape-slide.swiper-slide-duplicate-next,
.tape-slide.swiper-slide-duplicate-active + .tape-slide {
  opacity: 1 !important;
  transform: scale(1) !important;
  filter: brightness(1) blur(0) !important;
  z-index: 2;
  pointer-events: auto;
}

/* Боковые затемненные слайды (предыдущий и следующий после двух видимых) */
.tape-slide.swiper-slide-prev,
.tape-slide.swiper-slide-active + .tape-slide + .tape-slide,
.tape-slide.swiper-slide-duplicate-prev,
.tape-slide.swiper-slide-duplicate-active + .tape-slide + .tape-slide {
  opacity: 0.3;
  transform: scale(0.8);
  filter: brightness(0.3) blur(2px);
  pointer-events: none;
}

/* Для loop режима - все дубликаты, которые не активны, должны быть затемнены */
.tape-slide.swiper-slide-duplicate:not(.swiper-slide-duplicate-active):not(
    .swiper-slide-duplicate-active + .tape-slide
  ) {
  opacity: 0.3;
  transform: scale(0.8);
  filter: brightness(0.3) blur(2px);
  pointer-events: none;
}

/* Убеждаемся, что частично видимые слайды слева тоже отображаются */
.tape-slide.swiper-slide-duplicate-prev,
.tape-slide.swiper-slide-prev:not(.swiper-slide-duplicate) {
  opacity: 0.3 !important;
  transform: scale(0.8) !important;
  filter: brightness(0.3) blur(2px) !important;
  pointer-events: none;
  visibility: visible !important;
}

.tape-slide-content {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

/* Кастомные кнопки навигации на затемненных частях */
.tape-nav-button {
  position: absolute;
  top: 37%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

[class*='-swiper-button-prev'] {
  left: 8px;
}

[class*='-swiper-button-next'] {
  right: 8px;
}

.tape-nav-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-50%) scale(1.15);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.tape-nav-button:active {
  transform: translateY(-50%) scale(1.05);
}

[class*='-swiper-button-prev']::after,
[class*='-swiper-button-next']::after {
  content: '';
  width: 14px;
  height: 14px;
  border-top: 3px solid rgba(255, 255, 255, 0.95);
  border-right: 3px solid rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;
}

[class*='-swiper-button-prev']::after {
  transform: rotate(-135deg);
  margin-left: 5px;
}

[class*='-swiper-button-next']::after {
  transform: rotate(45deg);
  margin-right: 5px;
}

.tape-nav-button:hover::after {
  border-color: rgba(255, 255, 255, 1);
}

/* Мобильная адаптация: один слайд, без боковых — обрезаем overflow (блог и портфолио) */
@media (max-width: 768px) {
  .tape-swiper-wrapper {
    overflow: hidden;
    width: 100%;
    max-width: 100%;
  }

  .tape-swiper {
    padding: 0 24px 40px 24px;
    overflow: hidden !important;
    width: 100%;
    max-width: 100%;
  }

  .tape-swiper :deep(.swiper),
  .tape-swiper :deep(.swiper-container) {
    overflow: hidden !important;
    max-width: 100%;
  }

  /* Контейнер слайдов не должен выходить за границы */
  .tape-swiper :deep(.swiper-slide) {
    max-width: 100%;
    box-sizing: border-box;
  }

  .tape-nav-button {
    display: none;
  }
}

/* Пагинация */
.tape-swiper :deep(.swiper-pagination) {
  bottom: 10px;
}

.tape-swiper :deep(.swiper-pagination-bullet-active) {
  background-color: var(--color-accent, #f97316);
}

.tape-swiper :deep(.swiper-pagination-bullet) {
  background-color: rgba(255, 255, 255, 0.5);
  width: 10px;
  height: 10px;
}

</style>
