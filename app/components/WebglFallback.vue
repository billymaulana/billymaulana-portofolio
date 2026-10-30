<template>
  <div class="webgl-fallback">
    <p class="webgl-fallback__tagline">
      <em class="webgl-fallback__voice">A Frontend Architect</em> crafting interfaces that move millions of people.
    </p>
    <h1 class="webgl-fallback__name">
      Billy Maulana
    </h1>
  </div>
</template>

<style scoped>
.webgl-fallback {
  --pad: clamp(1.25rem, 3.2vw, 3rem);
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  padding: var(--pad);
  overflow: hidden;
  color: #F2EFEA;
  pointer-events: none;
}

.webgl-fallback__tagline {
  max-width: 45rem;
  font-family: 'Suisse', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-size: clamp(1.0625rem, 1.9vw, 2.28rem);
  line-height: 1.3;
  letter-spacing: -0.02em;
  text-wrap: balance;
  font-feature-settings: 'kern' 1, 'liga' 1;
}

.webgl-fallback__voice {
  font-family: 'Apparel', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 1em;
}

.webgl-fallback__name {
  font-family: 'Bebas Neue', Impact, sans-serif;
  font-weight: 400;
  font-size: min(calc((100vw - 2 * var(--pad)) / 4.52), 42vh);
  line-height: 1;
  letter-spacing: -0.015em;
  text-transform: uppercase;
  white-space: nowrap;
}
</style>
