<script setup>
import { Sparkles, PenTool, BookOpen, Settings } from 'lucide-vue-next';
import { useEditorStore } from '../store/editor';

const store = useEditorStore();
</script>

<template>
  <nav class="w-16 flex-none border-r border-gray-800 flex flex-col items-center py-6 gap-6 bg-[#161b22] z-50 shadow-2xl">
    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg mb-4 hover:rotate-6 transition-transform cursor-pointer">
      <Sparkles :size="24" />
    </div>
    <button @click="store.view = 'editor'" :class="['p-3 rounded-xl transition-all', store.view === 'editor' ? 'bg-blue-600/20 text-blue-400 shadow-inner' : 'text-gray-500 hover:text-gray-300']"><PenTool :size="20" /></button>
    <button @click="store.view = 'help'" :class="['p-3 rounded-xl transition-all', store.view === 'help' ? 'bg-purple-600/20 text-purple-400 shadow-inner' : 'text-gray-500 hover:text-gray-300']"><BookOpen :size="20" /></button>
    <div class="mt-auto mb-4"><button class="text-gray-500 hover:text-gray-300"><Settings :size="20" /></button></div>
  </nav>
</template>
