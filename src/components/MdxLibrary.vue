<!-- 
  文件路径: src/components/MdxLibrary.vue 
  职责: 渲染所有增强型 MDX 组件。
-->
<template>
  <!-- 引用块渲染 -->
  <div v-if="isQuote" class="my-8 pl-6 border-l-4 border-blue-600 bg-blue-50/50 py-5 pr-5 rounded-r-2xl relative overflow-hidden">
    <QuoteIcon class="absolute -top-2 -left-1 w-12 h-12 text-blue-200 opacity-40 rotate-12" />
    <div class="relative z-10 italic text-blue-900 font-medium leading-relaxed tracking-wide"><slot /></div>
  </div>

  <!-- 图片轮播渲染 -->
  <div v-else-if="isCarousel" class="my-8 group relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900 border border-gray-100">
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

  <!-- 步骤条渲染 -->
  <div v-else-if="isStep" :class="['flex gap-5 my-10 group', level === '3' ? 'my-4 gap-3' : '']">
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

  <!-- 选项卡渲染 -->
  <div v-else-if="isTabs" class="my-8 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md">
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

  <!-- 提示框渲染 -->
  <div v-else-if="type" :class="['my-6 p-5 rounded-2xl border-2 flex gap-4 items-start shadow-sm', statusStyles[type] || statusStyles.info]">
    <component :is="statusIcons[type] || Info" :size="20" class="opacity-80 mt-1 flex-none" />
    <div class="text-[14px] leading-relaxed font-bold"><slot /></div>
  </div>

  <!-- 任务清单渲染 -->
  <div v-else-if="isChecklist" class="my-6 space-y-3 bg-emerald-50/20 p-6 rounded-2xl border border-emerald-100 shadow-inner">
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

<script setup>
import { ref, computed } from 'vue';
import { 
  Info, CheckCircle, AlertTriangle, XCircle, 
  ChevronLeft, ChevronRight, Quote as QuoteIcon, Check 
} from 'lucide-vue-next';

const props = defineProps({
  type: String, 
  images: String, 
  caption: String, 
  number: String, 
  title: String, 
  level: String, 
  labels: String,
  content: String,
  items: Array,
  isQuote: Boolean,
  isCarousel: Boolean,
  isStep: Boolean,
  isTabs: Boolean,
  isChecklist: Boolean
});

// 轮播逻辑
const currentIndex = ref(0);
const imgList = computed(() => props.images?.split(',').map(s => s.trim()) || []);
const nextImg = () => { currentIndex.value = (currentIndex.value + 1) % imgList.value.length; };
const prevImg = () => { currentIndex.value = (currentIndex.value - 1 + imgList.value.length) % imgList.value.length; };

// 选项卡逻辑
const activeTab = ref(0);
const tabLabels = computed(() => props.labels?.split(',').map(s => s.trim()) || []);
const tabSlices = computed(() => props.content?.split('---').map(s => s.trim()) || []);

// 状态样式
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

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>