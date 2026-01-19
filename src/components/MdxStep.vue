<script setup>
const props = defineProps({
  number: String,
  title: String,
  level: String
});
</script>

<template>
  <div :class="['flex gap-5 my-10 group', level === '3' ? 'my-4 gap-3' : '']">
    <div :class="[
      'flex-none flex items-center justify-center font-black transition-all duration-300',
      level === '1' ? 'w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-xl shadow-lg shadow-blue-500/30' : 
      level === '2' ? 'w-9 h-9 rounded-xl bg-blue-100 text-blue-600 text-base' : 
      'w-6 h-6 rounded-md bg-gray-100 text-gray-500 text-[10px]'
    ]">
      {{ number }}
    </div>
    <div :class="[level === '3' ? 'pt-0.5' : 'pt-1']">
      <h4 :class="['font-black text-slate-900 tracking-tight', level === '1' ? 'text-2xl mb-2' : level === '2' ? 'text-lg mb-1' : 'text-base']">{{ title }}</h4>
      <div v-if="level !== '3'" class="text-slate-500 leading-relaxed text-[15px]"><slot /></div>
    </div>
  </div>
</template>
