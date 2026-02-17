<script setup lang="ts">
const { scrollTo } = useSmoothScroll()

function backToTop() {
  scrollTo(0, { duration: 2 })
}
</script>

<template>
  <footer class="footer" aria-label="Footer">
    <div class="footer__gradient" aria-hidden="true" />

    <div class="footer__content page-max page-margin">
      <!-- Logo -->
      <div class="footer__logo">
        <span class="footer__logo-text">BM</span>
        <span class="footer__logo-dot" />
      </div>

      <!-- Tagline -->
      <p class="footer__tagline text-body">
        Transforming pixels into performance.
      </p>

      <!-- Back to top -->
      <UiMagneticButton class="footer__back-to-top" :strength="0.3" aria-label="Back to top" @click="backToTop">
        <span class="i-carbon-arrow-up" />
      </UiMagneticButton>

      <!-- Bottom bar -->
      <div class="footer__bottom">
        <p class="footer__credit text-small">
          Designed & Built by Billy Maulana
        </p>
        <p class="footer__copyright text-small">
          &copy; {{ new Date().getFullYear() }} All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  padding: 6rem 0 2rem;
  overflow: hidden;
}

.footer__gradient {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      180deg,
      var(--color-bg-primary) 0%,
      rgba(0, 71, 255, 0.03) 30%,
      rgba(139, 0, 255, 0.02) 60%,
      var(--color-bg-primary) 100%
    );
  animation: gradientShift 10s ease infinite;
  background-size: 100% 200%;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 0% 100%;
  }
}

.footer__content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.footer__logo {
  display: flex;
  align-items: center;
  gap: 4px;
}

.footer__logo-text {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.footer__logo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
}

.footer__tagline {
  color: var(--color-text-secondary);
  text-align: center;
}

.footer__back-to-top {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: none;
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.3s;
  margin: 1rem 0;
}

.footer__back-to-top:hover {
  border-color: var(--color-accent);
  background: rgba(0, 71, 255, 0.1);
}

.footer__bottom {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 2rem;
}

.footer__credit,
.footer__copyright {
  color: var(--color-text-tertiary);
}

@media (max-width: 640px) {
  .footer__bottom {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
