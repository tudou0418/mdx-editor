<script setup>
import { Monitor, FileText } from 'lucide-vue-next';
import { useEditorStore } from '../store/editor';
import { useMDXParser } from '../composables/useMDXParser';
import MdxQuote from './MdxQuote.vue';
import MdxCarousel from './MdxCarousel.vue';
import MdxStep from './MdxStep.vue';
import MdxTabs from './MdxTabs.vue';
import MdxCallout from './MdxCallout.vue';
import MdxChecklist from './MdxChecklist.vue';

const store = useEditorStore();
const { parsedElements, renderInline } = useMDXParser(() => store.content);
</script>

<template>
  <div class="flex-1 min-w-0 bg-white flex flex-col overflow-hidden">
    <div class="flex-1 overflow-y-auto px-12 md:px-20 py-12 scroll-smooth bg-[#fafafa]">
      <article class="max-w-3xl mx-auto prose prose-slate">
        <div v-for="(el, idx) in parsedElements" :key="idx">
          <component :is="'h' + el.level" v-if="el.type === 'heading'" :class="[el.level === 1 ? 'text-4xl font-black mt-12 mb-10 text-slate-900 tracking-tight' : 'text-2xl font-black mt-10 mb-6 text-slate-800']">{{ el.content }}</component>
          <p v-else-if="el.type === 'p'" class="my-6 text-slate-700 leading-8" v-html="renderInline(el.content)"></p>
          <MdxQuote v-else-if="el.type === 'quote'">{{ el.content }}</MdxQuote>
          <MdxCallout v-else-if="el.type === 'callout'" :type="el.calloutType">{{ el.content }}</MdxCallout>
          <MdxStep v-else-if="el.type === 'step'" :number="el.num" :title="el.title" :level="el.level">{{ el.content }}</MdxStep>
          <MdxCarousel v-else-if="el.type === 'carousel'" :images="el.images" :caption="el.caption" />
          <MdxTabs v-else-if="el.type === 'tabs'" :labels="el.labels" :content="el.content" />
          <MdxChecklist v-else-if="el.type === 'checklist'" :items="el.items" />
          
          <div v-else-if="el.type === 'code'" class="code-block-container">
            <div class="code-header">{{ el.lang }} <span>SOURCE</span></div>
            <pre class="p-6 overflow-x-auto text-[13px] text-gray-300 font-mono leading-relaxed">{{ el.content }}</pre>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.code-block-container {
  @apply my-10 rounded-2xl overflow-hidden bg-[#0d1117] border border-gray-800 shadow-2xl;
}
.code-header {
  @apply px-5 py-3 bg-[#161b22] text-[10px] text-gray-500 font-mono font-bold border-b border-gray-800 flex justify-between items-center;
}
</style>
