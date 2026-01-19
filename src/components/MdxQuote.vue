<script setup>
import { Quote as QuoteIcon } from 'lucide-vue-next';
</script>

<template>
  <div class="my-8 pl-6 border-l-4 border-blue-600 bg-blue-50/50 py-5 pr-5 rounded-r-2xl relative overflow-hidden">
    <QuoteIcon class="absolute -top-2 -left-1 w-12 h-12 text-blue-200 opacity-40 rotate-12" />
    <div class="relative z-10 italic text-blue-900 font-medium leading-relaxed tracking-wide"><slot /></div>
  </div>
</template>
