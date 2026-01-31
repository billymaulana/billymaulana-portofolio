<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <header class="border-b border-gray-200 dark:border-gray-800">
      <nav class="container flex items-center justify-between py-4">
        <NuxtLink to="/" class="text-xl font-semibold">
          Logo
        </NuxtLink>
        <div class="flex items-center gap-4">
          <slot name="nav" />
        </div>
      </nav>
    </header>

    <main>
      <slot />
    </main>

    <footer class="mt-auto border-t border-gray-200 dark:border-gray-800">
      <div class="container py-6 text-center text-sm text-gray-500">
        Built with Nuxt 3
      </div>
    </footer>
  </div>
</template>
