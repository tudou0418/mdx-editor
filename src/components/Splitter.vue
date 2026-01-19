<script setup>
import { ref } from 'vue';

const props = defineProps({
  containerRef: Object,
  isDragging: Boolean
});

const emit = defineEmits(['start-drag', 'handle-drag', 'stop-drag']);
</script>

<template>
  <div @mousedown="emit('start-drag')" :class="['splitter', isDragging ? 'dragging' : '']"></div>
</template>

<style scoped>
.splitter {
  @apply w-1 bg-gray-800 z-40 relative cursor-col-resize hover:bg-blue-500 transition-colors;
}
.splitter.dragging { @apply bg-blue-500; }
</style>
