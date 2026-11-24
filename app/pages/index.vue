<script setup lang="ts">
import { useRouteIndex } from '~/composables/useRouteIndex'

definePageMeta({
  standalone: true,
})

useSeoMeta({
  title: 'Index',
  robots: 'noindex',
})

const { entries, groups } = useRouteIndex()
const RouteLink = resolveComponent('NuxtLink')
</script>

<template>
  <main id="main" class="route-index">
    <div class="route-index__inner">
      <header class="route-index__header">
        <p class="route-index__small">
          Sheet index · app/pages
        </p>
        <h1 class="route-index__title">
          Index
        </h1>
        <p class="route-index__small">
          {{ entries.length }} routes, read from the router on every load
        </p>
      </header>

      <section
        v-for="group in groups"
        :key="group.key"
        class="route-index__group"
        :aria-labelledby="`group-${group.key}`"
      >
        <h2 :id="`group-${group.key}`" class="route-index__group-label">
          <span>{{ group.label }}</span>
          <span class="route-index__count">{{ String(group.entries.length).padStart(2, '0') }}</span>
        </h2>

        <ul class="route-index__list">
          <li v-for="entry in group.entries" :key="entry.path">
            <component
              :is="entry.isDynamic ? 'span' : RouteLink"
              :to="entry.isDynamic ? undefined : entry.path"
              class="route-index__row"
              :class="{ 'route-index__row--inert': entry.isDynamic }"
            >
              <span class="route-index__count">{{ entry.sheet }}</span>
              <span class="route-index__name">{{ entry.title }}</span>
              <code class="route-index__path">{{ entry.displayPath }}</code>
              <span class="route-index__end" :aria-hidden="!entry.isDynamic">
                {{ entry.isDynamic ? 'Needs param' : '→' }}
              </span>
            </component>
          </li>
        </ul>
      </section>
    </div>
  </main>
</template>

<style scoped>
.route-index {
  --index-ink: var(--text-primary);
  --index-muted: var(--text-muted);
  --index-rule: rgba(255, 255, 255, 0.12);
  --index-focus: var(--accent-light);
  --index-ease: cubic-bezier(0.16, 1, 0.3, 1);

  position: fixed;
  inset: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--index-rule) transparent;
  background: var(--void);
  color: var(--index-ink);
  font-family: var(--font-interface);
}

.route-index__inner {
  max-width: 68rem;
  margin-inline: auto;
  padding-block: var(--space-8) var(--space-9);
  padding-inline: var(--page-margin);
}

.route-index__header {
  display: grid;
  gap: var(--space-3);
}

.route-index__small {
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: var(--index-muted);
}

.route-index__title {
  font-weight: 500;
  font-size: clamp(3.5rem, 7vw, 6rem);
  line-height: 1;
  letter-spacing: -0.025em;
}

.route-index__group {
  margin-block-start: var(--space-7);
}

.route-index__group-label {
  display: flex;
  justify-content: space-between;
  padding-block-end: var(--space-3);
  border-block-end: 1px solid var(--index-rule);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.route-index__list {
  list-style: none;
}

.route-index__row {
  display: grid;
  grid-template-columns: 3ch minmax(0, 1fr) auto auto;
  align-items: baseline;
  column-gap: var(--space-5);
  min-height: 3.5rem;
  padding: var(--space-4);
  border-block-end: 1px solid var(--border-subtle);
  text-decoration: none;
  transition: background-color var(--duration-fast) var(--index-ease);
}

.route-index__row:not(.route-index__row--inert):hover {
  background: var(--surface-1);
}

.route-index__row:focus-visible {
  outline: 2px solid var(--index-focus);
  outline-offset: -2px;
}

.route-index__row--inert {
  cursor: default;
}

.route-index__count {
  font-weight: 500;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  color: var(--index-muted);
}

.route-index__name {
  font-weight: 500;
  font-size: 1.125rem;
  line-height: 1.3;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
}

.route-index__path,
.route-index__end {
  font-family: var(--font-interface);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.4;
  letter-spacing: 0;
  font-variant-numeric: tabular-nums;
  color: var(--index-muted);
  overflow-wrap: anywhere;
}

.route-index__end {
  justify-self: end;
  transition:
    transform var(--duration-fast) var(--index-ease),
    color var(--duration-fast) var(--index-ease);
}

.route-index__row:not(.route-index__row--inert):is(:hover, :focus-visible) :is(.route-index__path, .route-index__end) {
  color: var(--index-ink);
}

.route-index__row:not(.route-index__row--inert):is(:hover, :focus-visible) .route-index__end {
  transform: translateX(0.25rem);
}

@media (max-width: 47.99rem) {
  .route-index__row {
    grid-template-columns: 3ch minmax(0, 1fr) auto;
    row-gap: var(--space-1);
  }

  .route-index__path {
    grid-area: 2 / 2;
  }

  .route-index__end {
    grid-area: 1 / 3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .route-index__row,
  .route-index__end {
    transition: none;
  }

  .route-index__row:not(.route-index__row--inert):is(:hover, :focus-visible) .route-index__end {
    transform: none;
  }
}
</style>
