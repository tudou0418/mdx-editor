<script setup>
import { Check } from 'lucide-vue-next';

const props = defineProps({
  items: Array
});
</script>

<template>
  <div class="my-6 space-y-3 bg-emerald-50/20 p-6 rounded-2xl border border-emerald-100 shadow-inner">
    <div v-for="(item, k) in items" :key="k" class="flex items-start gap-4 py-1">
      <div :class="['mt-0.5 w-6 h-6 rounded-lg flex-none flex items-center justify-center border-2 transition-all', 
          item.checked === 'true' ? 'bg-emerald-500 border-emerald-500 text-white rotate-[360deg]' : 'bg-white border-gray-200']">
        <Check v-if="item.checked === 'true'" :size="14" :stroke-width="4" />
      </div>
      <span :class="['text-[15px] transition-all', item.checked === 'true' ? 'text-gray-400 line-through opacity-70' : 'text-gray-700 font-semibold']">
        {{ item.text }}
      </span>
    </div>
  </div>
</template>
