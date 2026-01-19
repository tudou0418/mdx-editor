<script setup>
import { ref, computed } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const props = defineProps({
  images: String,
  caption: String
});

const currentIndex = ref(0);
const imgList = computed(() => props.images?.split(',').map(s => s.trim()) || []);

const nextImg = () => { currentIndex.value = (currentIndex.value + 1) % imgList.value.length; };
const prevImg = () => { currentIndex.value = (currentIndex.value - 1 + imgList.value.length) % imgList.value.length; };
</script>

<template>
  <div class="my-8 group relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900 border border-gray-100">
    <div class="relative aspect-video flex items-center justify-center bg-black overflow-hidden">
      <transition name="fade" mode="out-in">
        <img :key="currentIndex" :src="imgList[currentIndex]" class="w-full h-full object-cover select-none pointer-events-none" />
      </transition>
      
      <div v-if="imgList.length > 1" class="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button @click="prevImg" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40"><ChevronLeft :size="20" /></button>
        <button @click="nextImg" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40"><ChevronRight :size="20" /></button>
      </div>
    </div>
    <div class="p-4 bg-white text-center text-[10px] text-gray-400 font-black uppercase tracking-widest border-t border-gray-100">
      {{ caption || '图集' }} ({{ currentIndex + 1 }} / {{ imgList.length }})
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
