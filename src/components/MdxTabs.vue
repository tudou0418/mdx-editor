<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  labels: String,
  content: String
});

const activeTab = ref(0);
const tabLabels = computed(() => props.labels?.split(',').map(s => s.trim()) || []);
const tabSlices = computed(() => props.content?.split('---').map(s => s.trim()) || []);
</script>

<template>
  <div class="my-8 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md">
    <div class="flex border-b border-gray-100 bg-gray-50/80 px-3 pt-3 gap-1">
      <button v-for="(label, i) in tabLabels" :key="i" @click="activeTab = i"
        :class="['px-5 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all rounded-t-xl border-b-2', 
        activeTab === i ? 'bg-white border-blue-600 text-blue-600 shadow-sm' : 'border-transparent text-gray-400 hover:text-gray-600']">
        {{ label }}
      </button>
    </div>
    <div class="p-6 text-sm text-gray-600 leading-relaxed min-h-[60px] animate-in fade-in duration-300">
      {{ tabSlices[activeTab] || '暂无内容' }}
    </div>
  </div>
</template>
