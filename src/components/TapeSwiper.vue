<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperType } from 'swiper'

/** В рантайме есть `initialized`, в публичных .d.ts Swiper его не объявляет */
type SwiperInstance = SwiperType & { initialized?: boolean }
import { Pagination, Mousewheel, Keyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Define props
const props = defineProps<{
  items: any[]
  uniqueKey?: string
  buttonClassPrefix?: string
  swiperClass?: string
  /** Слайдов в ряд от 768px (по умолчанию 2). Дробное значение допустимо (например 4.5). */
  slidesPerViewDesktop?: number
  /** Центрировать ленту (активная группа по центру), напр. для блога */
  centerSlidesDesktop?: boolean
}>()

const desktopSlidesPerView = computed(() => {
  const v = props.slidesPerViewDesktop
  if (v == null || Number.isNaN(Number(v))) return 2
  return Math.min(6, Math.max(1, Number(v)))
})

/** Для loop и буфера Swiper внутри использует ceil(spv) */
const desktopSpvCeil = computed(() => Math.ceil(desktopSlidesPerView.value))

const centerTape = computed(() => props.centerSlidesDesktop === true)

// Swiper modules (Navigation не подключаем — избегаем двойных click-listeners и бага slidePrev+loop по snapGrid)
const swiperModules = [Pagination, Mousewheel, Keyboard]

const swiperRef = ref<SwiperType | null>(null)

const itemCount = computed(() => (props.items ?? []).length)

/** Swiper: loop требует n >= slidesPerView + loopedSlides; буфер от ceil(spv). */
const loopAdditionalSlides = computed(() => {
  const n = itemCount.value
  const spv = desktopSpvCeil.value
  if (n <= spv + 1) return 0
  return Math.min(2, n - spv - 2)
})

const canLoop = computed(() => itemCount.value >= desktopSpvCeil.value + 1)
/** Если loop нельзя включить при текущем n и spv — листание с края через rewind */
const useRewind = computed(() => {
  const n = itemCount.value
  if (n <= 1) return false
  return !canLoop.value
})

const swiperBreakpoints = computed(() => ({
  768: {
    slidesPerView: desktopSlidesPerView.value,
    slidesPerGroup: 1,
    spaceBetween: centerTape.value ? 12 : 16,
    loopAdditionalSlides: loopAdditionalSlides.value,
    centeredSlides: centerTape.value,
    centerInsufficientSlides: centerTape.value,
  },
}))

/** Смена набора слайдов (фильтр и т.д.): пересоздаём loop, иначе бесконечная прокрутка ломается */
const itemsLoopKey = computed(() =>
  (props.items ?? [])
    .map((item: any, index: number) =>
      props.uniqueKey ? item[props.uniqueKey] : item.id ?? index
    )
    .join('|')
)

/**
 * Назад: slidePrev + loop + snap даёт пропуск — шаг через slideToLoop по realIndex.
 * Вперёд: при slidesPerView>1 активен часто не «последний» realIndex, а slideToLoop(next) даёт дёрганье на стыке loop;
 * нативный slideNext (loopFix + slideTo по activeIndex) стабильнее. Навигация своя — двойных listener нет.
 */
function attachLoopStepNavigation(swiper: SwiperType) {
  const origPrev = swiper.slidePrev.bind(swiper)
  const origNext = swiper.slideNext.bind(swiper)
  // Сигнатуры как в swiper-class.d.ts: slidePrev/Next(speed?, runCallbacks?); slideToLoop — без 4-го аргумента
  swiper.slidePrev = (speed?: number, runCallbacks?: boolean) => {
    if (!swiper.params.loop) return origPrev(speed, runCallbacks)
    const len = props.items?.length ?? 0
    if (len < 1) return origPrev(speed, runCallbacks)
    const sp = speed === undefined ? swiper.params.speed : speed
    swiper.allowSlideNext = true
    swiper.allowSlidePrev = true
    swiper.slideToLoop((swiper.realIndex - 1 + len) % len, sp, runCallbacks)
    return true
  }
  swiper.slideNext = (speed?: number, runCallbacks?: boolean) => {
    if (!swiper.params.loop) return origNext(speed, runCallbacks)
    if ((props.items?.length ?? 0) < 1) return origNext(speed, runCallbacks)
    const sp = speed === undefined ? swiper.params.speed : speed
    swiper.allowSlideNext = true
    swiper.allowSlidePrev = true
    return origNext(sp, runCallbacks)
  }
}

function reinitLoop(preserveRealIndex: boolean) {
  const swiper = swiperRef.value as SwiperInstance | null
  if (!swiper || swiper.destroyed || !swiper.initialized || !swiper.params.loop) return
  const len = props.items?.length ?? 0
  if (!len) return
  const ri = preserveRealIndex
    ? Math.min(Math.max(swiper.realIndex, 0), len - 1)
    : 0
  swiper.loopDestroy()
  swiper.loopCreate()
  swiper.update()
  nextTick(() => {
    swiper.slideToLoop(ri, 0, false)
  })
}

watch(
  itemsLoopKey,
  () => {
    nextTick(() => reinitLoop(true))
  },
  { flush: 'post' }
)

const onTapeNavPrev = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  swiperRef.value?.slidePrev()
}

const onTapeNavNext = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  swiperRef.value?.slideNext()
}

const onSwiper = (swiper: SwiperType) => {
  swiperRef.value = swiper
  attachLoopStepNavigation(swiper)
  nextTick(() => {
    swiper.update()
    if (itemCount.value > 0) {
      if (swiper.params.loop) {
        swiper.slideToLoop(0, 0, false)
      } else {
        swiper.slideTo(0, 0, false)
      }
    }
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
      :key="`tape-${itemsLoopKey}-${itemCount}-spv${desktopSlidesPerView}-c${centerTape ? 1 : 0}-${canLoop ? 1 : 0}-${useRewind ? 1 : 0}`"
      :modules="swiperModules"
      :initial-slide="0"
      @swiper="onSwiper"
      :loop="canLoop"
      :rewind="useRewind"
      :loop-additional-slides="loopAdditionalSlides"
      :loop-prevents-sliding="false"
      :watch-overflow="false"
      :observer="true"
      :observe-slide-children="true"
      :watch-slides-progress="true"
      :slides-per-view="1"
      :slides-per-group="1"
      :round-lengths="true"
      :centered-slides="centerTape"
      :center-insufficient-slides="centerTape"
      :space-between="12"
      :breakpoints="swiperBreakpoints"
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

    <!-- Кастомные кнопки: один обработчик на кнопку (без Swiper Navigation — там возможен двойной init) -->
    <div
      :class="`${buttonClassPrefix || 'tape'}-swiper-button-prev tape-nav-button`"
      role="button"
      tabindex="0"
      @click="onTapeNavPrev"
      @keydown.enter.prevent="onTapeNavPrev"
      @keydown.space.prevent="onTapeNavPrev"
    />
    <div
      :class="`${buttonClassPrefix || 'tape'}-swiper-button-next tape-nav-button`"
      role="button"
      tabindex="0"
      @click="onTapeNavNext"
      @keydown.enter.prevent="onTapeNavNext"
      @keydown.space.prevent="onTapeNavNext"
    />
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
  /* Симметричные отступы: компактнее снизу, чтобы секция помещалась в один экран */
  padding: 0 32px 10px 32px;
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
  /* Не анимируем transform вместе с Swiper — иначе на стыке loop визуально «двойной» сдвиг */
  transition: opacity 0.32s ease, filter 0.32s ease;
  will-change: transform;
  transform: translateZ(0);
}

/* Базовые стили для всех слайдов */
.tape-slide {
  transition: opacity 0.32s ease, filter 0.32s ease;
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

/* Кастомные кнопки: вертикальный центр всей высоты ленты (карточка = превью + подпись). top: 37% визуально совпадал только с центром картинки */
.tape-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
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
    padding: 0 0 6px 0;
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
  bottom: 0;
}

.tape-swiper :deep(.swiper-pagination-bullet-active) {
  background-color: var(--color-accent, #f97316);
}

.tape-swiper :deep(.swiper-pagination-bullet) {
  background-color: rgba(255, 255, 255, 0.5);
  width: 8px;
  height: 8px;
}

</style>
