<script setup>
import { ref } from 'vue';
import { useEditorStore } from '../store/editor';

const store = useEditorStore();
const textareaRef = ref(null);

defineExpose({ textareaRef });
</script>

<template>
  <div :style="{ width: store.editorWidth + '%' }" class="min-w-0 flex flex-col bg-[#0d1117] border-r border-gray-800 relative z-10">
    <div class="flex-1 flex overflow-hidden editor-container">
      <div class="w-10 pt-6 flex flex-col items-center text-[9px] text-gray-700 font-mono select-none border-r border-gray-800/20">
        <div v-for="n in 60" :key="n" class="h-6">{{ n }}</div>
      </div>
      <textarea ref="textareaRef" v-model="store.content" class="editor-textarea" placeholder="在此输入 MDX 内容..."></textarea>
    </div>
  </div>
</template>

<style scoped>
.editor-textarea {
  @apply flex-1 bg-transparent p-6 text-gray-300 font-mono text-sm leading-6 outline-none resize-none;
}
</style>
