<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string
  splitBy?: 'word' | 'char'
  tag?: string
}>(), {
  splitBy: 'word',
  tag: 'span',
})

const parts = computed(() => {
  if (props.splitBy === 'char') {
    return props.text.split('').map((char, i) => ({
      content: char === ' ' ? '\u00A0' : char,
      key: `${char}-${i}`,
    }))
  }
  return props.text.split(' ').map((word, i) => ({
    content: word,
    key: `${word}-${i}`,
  }))
})
</script>

<template>
  <component :is="props.tag" class="split-text" aria-label="text">
    <span
      v-for="part in parts"
      :key="part.key"
      class="word"
      :class="{ 'inline-block': splitBy === 'char' }"
    >
      {{ part.content }}{{ splitBy === 'word' ? ' ' : '' }}
    </span>
  </component>
</template>

<style scoped>
.split-text {
  display: inline;
}

.word {
  display: inline-block;
  will-change: transform, opacity;
}
</style>
