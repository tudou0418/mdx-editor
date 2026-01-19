<script setup>
import { Monitor, FileText } from 'lucide-vue-next';
import { useEditorStore } from '../store/editor';

const store = useEditorStore();
</script>

<template>
  <footer class="h-8 flex-none px-4 bg-[#161b22] border-t border-gray-800 flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest z-50">
    <div class="flex gap-6">
      <span class="flex items-center gap-1.5 text-blue-500"><Monitor :size="12" /> 分栏比例: {{ Math.round(store.editorWidth) }}%</span>
      <span class="flex items-center gap-1.5 text-purple-500"><FileText :size="12" /> 总字数: {{ store.content.length }}</span>
    </div>
    <div class="flex items-center gap-2"><span class="text-emerald-500 opacity-80 uppercase tracking-tighter">Render Engine Active</span><div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div></div>
  </footer>
</template>
