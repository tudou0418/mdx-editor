<script setup>
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-vue-next';

const props = defineProps({
  type: String
});

const statusStyles = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  error: 'bg-red-50 border-red-200 text-red-800'
};

const statusIcons = {
  info: Info, success: CheckCircle, warning: AlertTriangle, error: XCircle
};
</script>

<template>
  <div :class="['my-6 p-5 rounded-2xl border-2 flex gap-4 items-start shadow-sm', statusStyles[type] || statusStyles.info]">
    <component :is="statusIcons[type] || Info" :size="20" class="opacity-80 mt-1 flex-none" />
    <div class="text-[14px] leading-relaxed font-bold"><slot /></div>
  </div>
</template>
