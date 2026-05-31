<script setup lang="ts">
import photo1 from '~/assets/Frame59.png'
import photo2 from '~/assets/Frame60.png'
import photo3 from '~/assets/Frame61.png'
import casePhoto1 from '~/assets/Group 57.jpg'
import casePhoto2 from '~/assets/Group 58.jpg'
import casePhoto3 from '~/assets/Group 59.jpg'

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://resto.rassvet.click'
const ogImage = `${siteUrl.replace(/\/$/, '')}/og-cover.svg`

useHead({
  title: 'RestoPro — Ваш сайт для доставки и CRM система',
  titleTemplate: '%s',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      name: 'description',
      content:
        'Готовое решение для ресторанов: современный сайт доставки + мощная админ-панель с использованием современных технологий. SEO-оптимизировано, быстрое, адаптивное. Запустите за 3 дня!'
    },
    {
      name: 'keywords',
      content:
        'сайт для ресторана, доставка еды, админ панель ресторана, онлайн заказ еды, resto pro, rassvet'
    },
    { property: 'og:title', content: 'RestoPro — Сайт + Админка для Ресторана Доставки' },
    {
      property: 'og:description',
      content:
        'Готовое решение для ресторанов: современный сайт доставки + мощная админ-панель с использованием современных технологий'
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: 'https://restopro.dev/og-image.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'theme-color', content: '#FF6B35' }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍕</text></svg>'
    },
    { rel: 'canonical', href: 'https://resto.rassvet.dev' }
  ],
  htmlAttrs: { lang: 'ru' }
})

// useSchemaOrg([
//   defineWebSite({
//     name: 'RestoPro',
//     description: 'Готовое решение для ресторанов доставки на Nuxt 4'
//   }),
//   defineOrganization({
//     name: 'RestoPro',
//     logo: 'https://restopro.dev/logo.png'
//   }),
//   defineProduct({
//     name: 'RestoPro — Сайт + Админка для Ресторана',
//     description: 'Полное решение для запуска онлайн-доставки еды',
//     offers: {
//       price: '49000',
//       priceCurrency: 'RUB',
//       availability: 'https://schema.org/InStock'
//     }
//   })
// ])

const scrollY = ref(0)

if (process.client) {
  window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY
  })
}

const isMenuOpen = ref(false)
const activeFaq = ref<number | null>(null)

const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    isMenuOpen.value = false
  }
}

const features = [{ icon: photo1 }, { icon: photo2 }, { icon: photo3 }]

const pricing = [
  {
    name: 'Стартуем',
    price: '150 000 ₽',
    desc: 'Идеально для старта',
    features: [
      'Сайт доставки',
      'Оформление меню, баннеров\n' + '(50 позиций меню, +3 баннера)',
      'Админ панель',
      'Запуск сайта',
      'Бот для уведомления заказов'
    ],
    popular: true
  },
  {
    name: 'Сотрудничество',
    price: 'Обсуждается',
    desc: 'Разработка любого функционала\n' + 'для вашего сайта - CRM',
    popular: false
  }
]

const faqs = [
  {
    q: 'Сколько времени занимает запуск?',
    a: 'Стандартный запуск занимает 3-5 рабочих дней. Мы настраиваем дизайн под ваш бренд, загружаем меню и подключаем оплату.'
  },
  {
    q: 'Можно ли интегрировать с现有的 POS-системой?',
    a: 'Да, мы поддерживаем интеграцию с iiko, R-Keeper, FrontPad и другими популярными POS-системами через API.'
  },
  {
    q: 'Нужен ли отдельный хостинг?',
    a: 'Нет, мы предоставляем хостинг на первый год бесплатно. Далее — 2 000 ₽/мес. Можно разместить и на своём сервере.'
  },
  {
    q: 'Есть ли мобильное приложение?',
    a: 'В тарифе "Бизнес" и выше сайт превращается в PWA-приложение, которое клиенты могут установить на iPhone/Android.'
  },
  {
    q: 'Как происходит обучение персонала?',
    a: 'Проводим онлайн-обучение администраторов, предоставляем видео-инструкции и документацию.'
  }
]

const stats = [
  { value: '7 дня', label: 'до запуска' },
  { value: '100%', label: 'SEO-готовность' },
  { value: '50+', label: 'ресторанов' },
  { value: '4.9', label: 'рейтинг' }
]

const {
  name,
  phone,
  email,
  honeypot,
  isLoading,
  isSuccess: isSend,
  isError,
  submit: sendMessage
} = useContactForm()
</script>

<template>
  <div class="page">
    <!-- Navigation -->
    <nav class="nav" :class="{ 'nav--scrolled': scrollY > 50 }">
      <div class="container nav__inner">
        <a href="#" class="logo" @click.prevent="scrollToSection('hero')">
          <span class="logo__icon">🍕</span>
          <span class="logo__text">Resto<span class="logo__accent">Pro</span></span>
        </a>

        <button class="burger" @click="isMenuOpen = !isMenuOpen" aria-label="Меню">
          <span :class="{ 'burger__line--open': isMenuOpen }"></span>
          <span :class="{ 'burger__line--open': isMenuOpen }"></span>
          <span :class="{ 'burger__line--open': isMenuOpen }"></span>
        </button>

        <div class="nav__menu" :class="{ 'nav__menu--open': isMenuOpen }">
          <a @click.prevent="scrollToSection('features')" class="nav__link">Возможности</a>
          <a @click.prevent="scrollToSection('demo')" class="nav__link">Панель</a>
          <a @click.prevent="scrollToSection('pricing')" class="nav__link">Стоимость</a>
          <a @click.prevent="scrollToSection('case')" class="nav__link">Кейсы</a>
          <!--          <a @click.prevent="scrollToSection('faq')" class="nav__link">FAQ</a>-->
          <button class="btn btn--small" @click="scrollToSection('contact')">Заказать</button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="hero" class="hero">
      <div class="hero__bg">
        <div class="hero__gradient"></div>
        <div class="hero__pattern"></div>
      </div>
      <div class="container hero__content">
        <div class="hero__badge">🔥 Запуск за 7 дней</div>
        <h1 class="hero__title">
          Личный сайт + CRM система<br />
          <span class="hero__highlight">для ресторана</span>
        </h1>
        <p class="hero__subtitle">
          Запустите онлайн-продажи за 7 дня. Современный дизайн, мгновенная загрузка, полный
          контроль заказов в одной системе.
        </p>
        <div class="hero__actions">
          <button class="btn btn--primary btn--large" @click="scrollToSection('contact')">
            Связаться
            <span class="btn__arrow">→</span>
          </button>
          <button class="btn btn--outline btn--large" @click="scrollToSection('features')">
            Узнать больше
          </button>
        </div>
        <div class="hero__stats">
          <div v-for="stat in stats" :key="stat.label" class="stat">
            <div class="stat__value">{{ stat.value }}</div>
            <div class="stat__label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
      <div class="hero__scroll">
        <div class="scroll-indicator">
          <div class="scroll-indicator__mouse">
            <div class="scroll-indicator__wheel"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="section section--dark">
      <div class="container">
        <div class="section__header">
          <span class="section__badge">Возможности</span>
          <h2 class="section__title">
            Всё, что нужно для <span class="text-gradient">прибыльной доставки</span>
          </h2>
          <p class="section__subtitle">
            Полный набор инструментов для управления рестораном онлайн
          </p>
        </div>
        <div class="features-grid">
          <div
            v-for="(feature, i) in features"
            :key="i"
            class="feature-card"
            :style="{ '--delay': `${i * 0.1}s` }"
          >
            <img
              :src="feature.icon"
              alt=""
              style="width: 100%; height: 100%; object-fit: contain"
            />
          </div>
        </div>
      </div>
    </section>

    <section id="demo" class="section">
      <div class="container">
        <div class="demo">
          <div class="demo__content">
            <span class="section__badge">Интерфейс</span>
            <h2 class="section__title">Мощная админ-панель<br />в вашем браузере</h2>
            <p class="section__subtitle">
              Управляйте меню, заказами, акциями, промокодами сами, без ограничений
            </p>
            <ul class="demo__list">
              <li class="demo__item">
                <span class="demo__check">✓</span>
                <span>Управление меню с фото и модификаторами</span>
              </li>
              <li class="demo__item">
                <span class="demo__check">✓</span>
                <span>Страница заказов</span>
              </li>
              <li class="demo__item">
                <span class="demo__check">✓</span>
                <span>Управление спросом на нужные блюда</span>
              </li>
              <li class="demo__item">
                <span class="demo__check">✓</span>
                <span>Тестируйте промокоды, привлекайте новых клиентов</span>
              </li>
            </ul>
          </div>
          <div class="demo__visual">
            <div class="browser-mockup">
              <div class="browser-mockup__header">
                <div class="browser-mockup__dots"><span></span><span></span><span></span></div>
                <div class="browser-mockup__url">admin.restopro.dev</div>
              </div>
              <div class="browser-mockup__content">
                <div class="mockup-dashboard">
                  <div class="mockup-sidebar">
                    <div class="mockup-logo">🍕 RestoPro</div>
                    <div class="mockup-nav">
                      <div class="mockup-nav__item mockup-nav__item--active">📊 Дашборд</div>
                      <div class="mockup-nav__item">📝 Заказы</div>
                      <div class="mockup-nav__item">🍔 Меню</div>
                      <div class="mockup-nav__item">👥 Клиенты</div>
                      <div class="mockup-nav__item">⚙️ Настройки</div>
                    </div>
                  </div>
                  <div class="mockup-main">
                    <div class="mockup-header">
                      <div class="mockup-search">🔍 Поиск заказов...</div>
                      <div class="mockup-user">👤 Админ</div>
                    </div>
                    <div class="mockup-stats">
                      <div class="mockup-stat">
                        <div class="mockup-stat__label">Заказов сегодня</div>
                        <div class="mockup-stat__value">47</div>
                      </div>
                      <div class="mockup-stat">
                        <div class="mockup-stat__label">Выручка</div>
                        <div class="mockup-stat__value">128 500 ₽</div>
                      </div>
                      <div class="mockup-stat">
                        <div class="mockup-stat__label">Средний чек</div>
                        <div class="mockup-stat__value">2 734 ₽</div>
                      </div>
                    </div>
                    <div class="mockup-chart">
                      <div class="mockup-chart__bar" style="height: 40%"></div>
                      <div class="mockup-chart__bar" style="height: 65%"></div>
                      <div class="mockup-chart__bar" style="height: 45%"></div>
                      <div class="mockup-chart__bar" style="height: 80%"></div>
                      <div class="mockup-chart__bar" style="height: 55%"></div>
                      <div class="mockup-chart__bar" style="height: 90%"></div>
                      <div class="mockup-chart__bar" style="height: 70%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="pricing" class="section section--gradient">
      <div class="container">
        <div class="section__header">
          <span class="section__badge">Стоимость</span>
          <h2 class="section__title">
            Мы продаём вам личный, <span class="text-gradient">готовый продукт.</span>
          </h2>
          <p class="section__subtitle">
            Который можно гибко развивать далее с нами, или любыми другими подрядчиками
          </p>
        </div>
        <div class="pricing-grid">
          <div
            v-for="plan in pricing"
            :key="plan.name"
            class="pricing-card"
            :class="{ 'pricing-card--popular': plan.popular }"
          >
            <div v-if="plan.popular" class="pricing-card__badge">Газ</div>
            <h3 class="pricing-card__name">{{ plan.name }}</h3>
            <div class="pricing-card__price">{{ plan.price }}</div>
            <p class="pricing-card__desc">{{ plan.desc }}</p>
            <ul class="pricing-card__features">
              <li v-for="f in plan.features" :key="f" class="pricing-card__feature">
                <span class="pricing-card__check">✓</span>
                {{ f }}
              </li>
            </ul>
            <button
              class="btn"
              style="margin-top: auto"
              :class="plan.popular ? 'btn--primary' : 'btn--outline'"
              @click="scrollToSection('contact')"
            >
              Выбрать тариф
            </button>
          </div>
        </div>
      </div>
    </section>

    <section id="case" class="section section--dark">
      <div class="container">
        <span class="section__badge" style="margin-bottom: 0">Кейсы</span>

        <div class="case-flex">
          <div class="case-card case-card-text">
            <div class="section__title-da">
              Как будет выглядеть ваш сайт и <span class="text-gradient">CRM система</span>
            </div>

            <ul class="demo__list">
              <li class="demo__item">
                <span class="demo__check">✓</span>
                <span>
                  Отточенный на практике эффективный интерфейс, который клиенты любят и понимают.
                  Интуитивно понятная навигация и быстрый процесс оформления</span
                >
              </li>
              <li class="demo__item">
                <span class="demo__check">✓</span>
                <span> Управляйте баннерами и акциями </span>
              </li>
              <li class="demo__item">
                <span class="demo__check">✓</span>
                <span> Создавайте промокоды и тестируйте свои гипотезы </span>
              </li>
              <li class="demo__item">
                <span class="demo__check">✓</span>
                <span>Быстрая бесперебойная работа</span>
              </li>
            </ul>
          </div>
          <div class="case-card">
            <img :src="casePhoto1" alt="FreshBite" />
          </div>
          <div class="case-card">
            <img :src="casePhoto2" alt="FreshBite" />
          </div>
          <div class="case-card">
            <img :src="casePhoto3" alt="FreshBite" />
          </div>
        </div>

        <!--        <div class="case-flex">-->
        <!--          <div class="case-card">-->
        <!--            asd-->
        <!--          </div>-->
        <!--          <div class="case-card">-->
        <!--            asd-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </section>

    <section id="contact" class="section cta">
      <div class="container">
        <div class="cta__inner">
          <h2 class="cta__title">Готовы увеличить прибыль с доставки<br />на 40%-60% ?</h2>

          <form class="cta__form" @submit.prevent="sendMessage">
            <input
              v-model="honeypot"
              type="text"
              name="_gotcha"
              tabindex="-1"
              autocomplete="off"
              aria-hidden="true"
              style="position: absolute; left: -9999px; opacity: 0"
            />
            <input
              type="text"
              placeholder="Ваше имя"
              class="cta__input"
              required
              v-model="name"
              :disabled="isLoading"
            />
            <input
              type="tel"
              placeholder="Телефон"
              class="cta__input"
              required
              v-model="phone"
              :disabled="isLoading"
            />
            <input
              type="email"
              placeholder="Email"
              class="cta__input"
              required
              v-model="email"
              :disabled="isLoading"
            />
            <button
              type="submit"
              class="btn btn--primary btn--large btn--full"
              :disabled="isLoading"
            >
              Оставить заявку
              <span class="btn__arrow">→</span>
            </button>
          </form>
          <p class="cta__note">🔒 Ваши данные в безопасности.</p>

          <div v-if="isError" style="color: #ff5f57">Произошла ошибка попробуйте позже :(</div>
          <div v-if="isSend" style="color: #28c840">Ваша заявка успешно отправлена, ожидайте</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
.case-flex {
  display: grid;
  /* Будет создано 3 колонки */
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
@media (max-width: 960px) {
  .case-flex {
    grid-template-columns: 1fr;
  }
}
.case-card {
  margin-top: 20px;
  border-radius: 30px;
}
.case-card-text {
  padding: 30px;
  background: var(--color-bg);
}
.case-card img {
  width: 100%;
  height: 100%;
  border-radius: 30px;
}
.section__title-da {
  font-size: 30px;
  font-weight: bold;
}
.da-text {
  margin-top: 8px;
  font-size: 18px;
  color: var(--color-text);
}

/* ===== CSS VARIABLES ===== */
:root {
  --color-bg: #0a0a0f;
  --color-bg-elevated: #12121a;
  --color-bg-card: #1a1a25;
  --color-primary: #ff6b35;
  --color-primary-hover: #ff8555;
  --color-secondary: #6366f1;
  --color-text: #f1f1f4;
  --color-text-muted: #9ca3af;
  --color-border: rgba(255, 255, 255, 0.1);
  --gradient-hero: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #6366f1 100%);
  --gradient-card: linear-gradient(
    145deg,
    rgba(255, 107, 53, 0.1) 0%,
    rgba(99, 102, 241, 0.05) 100%
  );
  --shadow-glow: 0 0 40px rgba(255, 107, 53, 0.3);
  --radius: 16px;
  --radius-sm: 8px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --container-max: 1200px;
  --container-padding: 24px;
}

/* ===== RESET & BASE ===== */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* ===== UTILITIES ===== */
.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  width: 100%;
}

.text-gradient {
  background: var(--gradient-hero);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: 2px solid transparent;
  transition: var(--transition);
  text-decoration: none;
  background: transparent;
  color: var(--color-text);
}

.btn--primary {
  background: var(--color-primary);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
}

.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.btn--outline {
  border-color: var(--color-border);
  background: rgba(255, 255, 255, 0.05);
}

.btn--outline:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-primary);
}

.btn--small {
  padding: 8px 20px;
  font-size: 0.9rem;
}

.btn--large {
  padding: 16px 36px;
  font-size: 1.1rem;
}

.btn--full {
  width: 100%;
}

.btn__arrow {
  transition: transform 0.3s;
}

.btn:hover .btn__arrow {
  transform: translateX(4px);
}

/* ===== NAVIGATION ===== */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px 0;
  transition: var(--transition);
  background: transparent;
}

.nav--scrolled {
  background: rgba(10, 10, 15, 0.9);
  backdrop-filter: blur(20px);
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 800;
  font-size: 1.5rem;
}

.logo__icon {
  font-size: 1.8rem;
}

.logo__accent {
  background: var(--gradient-hero);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav__menu {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav__link {
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
  cursor: pointer;
}

.nav__link:hover {
  color: var(--color-text);
}

.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  z-index: 1001;
}

.burger span {
  display: block;
  width: 25px;
  height: 2px;
  background: var(--color-text);
  transition: var(--transition);
}

/* ===== HERO ===== */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 0 80px;
  overflow: hidden;
}

.hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255, 107, 53, 0.15), transparent),
    radial-gradient(ellipse 60% 40% at 80% 50%, rgba(99, 102, 241, 0.1), transparent);
}

.hero__pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent);
}

.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
}

.hero__badge {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(255, 107, 53, 0.15);
  border: 1px solid rgba(255, 107, 53, 0.3);
  border-radius: 100px;
  font-size: 0.9rem;
  color: var(--color-primary);
  margin-bottom: 24px;
  animation: fadeInUp 0.8s ease-out;
}

.hero__title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  animation: fadeInUp 0.8s ease-out 0.1s both;
}

.hero__highlight {
  background: var(--gradient-hero);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero__subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero__actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 60px;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.3s both;
}

.hero__stats {
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.stat {
  text-align: center;
}

.stat__value {
  font-size: 2rem;
  font-weight: 800;
  background: var(--gradient-hero);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat__label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.hero__scroll {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}

.scroll-indicator__mouse {
  width: 24px;
  height: 40px;
  border: 2px solid var(--color-text-muted);
  border-radius: 12px;
  position: relative;
}

.scroll-indicator__wheel {
  width: 4px;
  height: 8px;
  background: var(--color-primary);
  border-radius: 2px;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  animation: scrollWheel 2s infinite;
}

/* ===== SECTIONS ===== */
.section {
  padding: 100px 0;
  position: relative;
}

.section--dark {
  background: var(--color-bg-elevated);
}

.section--gradient {
  background: linear-gradient(
    180deg,
    var(--color-bg) 0%,
    var(--color-bg-elevated) 50%,
    var(--color-bg) 100%
  );
}

.section__header {
  text-align: center;
  margin-bottom: 64px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.section__badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 100px;
  font-size: 0.85rem;
  color: var(--color-primary);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section__title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.2;
}

.section__subtitle {
  font-size: 1.1rem;
  color: var(--color-text-muted);
}

/* ===== FEATURES ===== */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  //align-items:;
  gap: 24px;
}

.feature-card {
  margin: 0 auto;
  //background: var(--color-bg-card);
  //border: 1px solid var(--color-border);
  border-radius: 30px;
  //padding: 32px;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-hero);
  transform: scaleX(0);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 107, 53, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card__icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.feature-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.feature-card__desc {
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* ===== DEMO ===== */
.demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.demo__content {
  max-width: 500px;
}

.demo__list {
  list-style: none;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo__item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-text-muted);
}

.demo__check {
  width: 24px;
  height: 24px;
  background: rgba(255, 107, 53, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  font-size: 0.8rem;
  flex-shrink: 0;
}

/* Browser Mockup */
.browser-mockup {
  background: var(--color-bg-card);
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--color-border);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.browser-mockup__header {
  background: rgba(255, 255, 255, 0.05);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--color-border);
}

.browser-mockup__dots {
  display: flex;
  gap: 6px;
}

.browser-mockup__dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

.browser-mockup__dots span:first-child {
  background: #ff5f57;
}
.browser-mockup__dots span:nth-child(2) {
  background: #febc2e;
}
.browser-mockup__dots span:nth-child(3) {
  background: #28c840;
}

.browser-mockup__url {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-align: center;
}

.mockup-dashboard {
  display: grid;
  grid-template-columns: 180px 1fr;
  min-height: 300px;
}

.mockup-sidebar {
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-right: 1px solid var(--color-border);
}

.mockup-logo {
  font-weight: 700;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.mockup-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mockup-nav__item {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: var(--color-text-muted);
  transition: var(--transition);
}

.mockup-nav__item--active {
  background: rgba(255, 107, 53, 0.2);
  color: var(--color-primary);
}

.mockup-main {
  padding: 20px;
}

.mockup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.mockup-search {
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: var(--color-text-muted);
  flex: 1;
  margin-right: 16px;
}

.mockup-user {
  font-size: 0.85rem;
}

.mockup-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.mockup-stat {
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: var(--radius-sm);
}

.mockup-stat__label {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.mockup-stat__value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-primary);
}

.mockup-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 100px;
  padding-top: 20px;
}

.mockup-chart__bar {
  flex: 1;
  background: var(--gradient-hero);
  border-radius: 4px 4px 0 0;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.mockup-chart__bar:hover {
  opacity: 1;
}

/* ===== PRICING ===== */
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  align-items: start;
}

.pricing-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 40px 32px;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
}

.pricing-card:hover {
  transform: translateY(-8px);
}

.pricing-card--popular {
  border-color: var(--color-primary);
  background: linear-gradient(145deg, rgba(255, 107, 53, 0.1) 0%, var(--color-bg-card) 100%);
  transform: scale(1.05);
  z-index: 1;
}

.pricing-card--popular:hover {
  transform: scale(1.05) translateY(-8px);
}

.pricing-card__badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gradient-hero);
  color: white;
  padding: 6px 20px;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 700;
}

.pricing-card__name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.pricing-card__price {
  font-size: 2.5rem;
  font-weight: 900;
  background: var(--gradient-hero);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.pricing-card__desc {
  color: var(--color-text-muted);
  margin-bottom: 24px;
  font-size: 0.95rem;
}

.pricing-card__features {
  list-style: none;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pricing-card__feature {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text-muted);
}

.pricing-card__check {
  color: var(--color-primary);
  font-weight: 700;
}

/* ===== FAQ ===== */
.faq-list {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: var(--transition);
}

.faq-item--active {
  border-color: rgba(255, 107, 53, 0.3);
}

.faq-item__question {
  width: 100%;
  padding: 20px 24px;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1.05rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: var(--transition);
}

.faq-item__question:hover {
  color: var(--color-primary);
}

.faq-item__icon {
  font-size: 1.5rem;
  color: var(--color-primary);
  transition: transform 0.3s;
}

.faq-item__answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.faq-item__answer p {
  padding: 0 24px 20px;
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* ===== CTA ===== */
.cta {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
  position: relative;
  overflow: hidden;
}

.cta::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

.cta__inner {
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.cta__title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  margin-bottom: 16px;
}

.cta__subtitle {
  color: var(--color-text-muted);
  margin-bottom: 40px;
  font-size: 1.1rem;
}

.cta__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.cta__input {
  width: 100%;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: 1rem;
  transition: var(--transition);
}

.cta__input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.08);
}

.cta__input::placeholder {
  color: var(--color-text-muted);
}

.cta__note {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

/* ===== FOOTER ===== */
.footer {
  background: var(--color-bg-elevated);
  border-top: 1px solid var(--color-border);
  padding: 64px 0 32px;
}

.footer__grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
}

.footer__brand .logo {
  margin-bottom: 16px;
}

.footer__desc {
  color: var(--color-text-muted);
  line-height: 1.6;
  max-width: 300px;
}

.footer__links h4 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--color-text);
}

.footer__links a {
  display: block;
  color: var(--color-text-muted);
  text-decoration: none;
  margin-bottom: 12px;
  transition: var(--transition);
  cursor: pointer;
}

.footer__links a:hover {
  color: var(--color-primary);
}

.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.footer__social {
  display: flex;
  gap: 16px;
}

.footer__social a {
  font-size: 1.5rem;
  transition: transform 0.3s;
  text-decoration: none;
}

.footer__social a:hover {
  transform: translateY(-3px);
}

/* ===== ANIMATIONS ===== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scrollWheel {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(12px);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .demo {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .demo__visual {
    order: -1;
  }

  .mockup-dashboard {
    grid-template-columns: 140px 1fr;
  }
}

@media (max-width: 768px) {
  .feature-card {
    max-height: 300px;
    width: max-content;
  }
  :root {
    --container-padding: 16px;
  }

  .burger {
    display: flex;
  }

  .nav__menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    max-width: 300px;
    height: 100vh;
    background: var(--color-bg-elevated);
    flex-direction: column;
    padding: 80px 32px 32px;
    transition: right 0.3s ease;
    border-left: 1px solid var(--color-border);
  }

  .nav__menu--open {
    right: 0;
  }

  .hero__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .hero__stats {
    gap: 24px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .pricing-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }

  .pricing-card--popular {
    transform: scale(1);
    order: -1;
  }

  .pricing-card--popular:hover {
    transform: scale(1) translateY(-8px);
  }

  .footer__grid {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  .mockup-dashboard {
    grid-template-columns: 1fr;
  }

  .mockup-sidebar {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 100px 0 60px;
  }

  .hero__title {
    font-size: 2rem;
  }

  .section {
    padding: 60px 0;
  }

  .section__title {
    font-size: 1.75rem;
  }

  .footer__grid {
    grid-template-columns: 1fr;
  }

  .footer__bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}

/* Smooth scroll offset for fixed nav */
html {
  scroll-padding-top: 80px;
}
</style>
