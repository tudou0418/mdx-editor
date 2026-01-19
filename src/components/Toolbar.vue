<script setup>
import { Bold, Italic, List, Code, Smile, Download } from 'lucide-vue-next';

const props = defineProps({
  insertSnippet: Function
});

const emojis = ['😀', '🚀', '🔥', '✨', '📝', '💡', '🎨', '✔️', '❌', '⭐', '📌', '📅', '🎉', '🌈', '💻', '🔍'];
</script>

<template>
  <div class="w-full flex-none p-3 border-b border-gray-800 bg-[#161b22] z-40 shadow-xl overflow-visible">
    <div class="flex items-center gap-4 flex-wrap">
      <div class="flex items-center gap-1 pr-4 border-r border-gray-800">
        <button @click="insertSnippet('**', '**')" class="p-2 hover:bg-gray-700 rounded text-gray-400 transition-colors" title="加粗"><Bold :size="16" /></button>
        <button @click="insertSnippet('*', '*')" class="p-2 hover:bg-gray-700 rounded text-gray-400 transition-colors" title="斜体"><Italic :size="16" /></button>
        <button @click="insertSnippet('\n- ', '')" class="p-2 hover:bg-gray-700 rounded text-gray-400 transition-colors" title="无序列表"><List :size="16" /></button>
        <button @click="insertSnippet('\n```javascript\n', '\n```\n')" class="p-2 hover:bg-gray-700 rounded text-gray-400 transition-colors" title="代码块"><Code :size="16" /></button>
      </div>
      
      <div class="flex items-center gap-2 pr-4 border-r border-gray-800">
        <button v-for="c in ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b']" :key="c"
        @click="insertSnippet('<Color value=&quot;' + c + '&quot;>', '</Color>')"
        class="w-4 h-4 rounded border border-white/20 hover:scale-125 transition-transform"
        :style="{ backgroundColor: c }"></button>
      </div>

      <div class="flex items-center gap-2 pr-4 border-r border-gray-800">
        <button @click="insertSnippet('\n<Callout type=&quot;info&quot;>\n  ', '\n</Callout>\n')" class="toolbar-btn text-blue-400 border-blue-800/40 bg-blue-900/10">提示框</button>
        <button @click="insertSnippet('\n<Step level=&quot;1&quot; number=&quot;1&quot; title=&quot;标题&quot;>\n  ', '\n</Step>\n')" class="toolbar-btn text-purple-400 border-purple-800/40 bg-purple-900/10">步骤条</button>
        <button @click="insertSnippet('\n<ImageCarousel images=&quot;url1, url2&quot; caption=&quot;图集&quot; />\n')" class="toolbar-btn text-orange-400 border-orange-800/40 bg-orange-900/10">轮播图</button>
        <button @click="insertSnippet('\n<Tabs labels=&quot;标签1, 标签2&quot;>\n  内容1\n  ---\n  内容2\n</Tabs>\n')" class="toolbar-comp-btn text-gray-300 border-gray-700 bg-gray-800/40">选项卡</button>
        <button @click="insertSnippet('\n<Checklist>\n  <CheckItem checked=&quot;true&quot;>已完成</CheckItem>\n  <CheckItem checked=&quot;false&quot;>待办</CheckItem>\n</Checklist>\n')" class="toolbar-comp-btn text-emerald-400 border-emerald-800/40 bg-emerald-900/10">任务列表</button>
      </div>

      <div class="relative group/emoji">
        <button class="p-2 hover:bg-gray-700 rounded text-gray-400"><Smile :size="18" /></button>
        <div class="emoji-picker-dropdown">
          <button v-for="e in emojis" :key="e" @click="insertSnippet(e)" class="p-1 hover:bg-gray-700 rounded text-lg">{{e}}</button>
        </div>
      </div>

      <div class="ml-auto">
        <button class="export-btn"><Download :size="14" /> 导出 MDX</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toolbar-btn {
  @apply px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all active:scale-95;
}
.toolbar-comp-btn {
  @apply px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all active:scale-95;
}
.export-btn {
  @apply flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-black shadow-lg shadow-blue-500/20 active:translate-y-0.5 transition-all;
}
.emoji-picker-dropdown {
  @apply absolute right-0 top-full mt-2 grid grid-cols-4 gap-1 p-2 bg-[#1c2128] border border-gray-700 rounded-lg shadow-2xl z-[60] w-40 opacity-0 group-hover/emoji:opacity-100 transition-opacity pointer-events-none group-hover/emoji:pointer-events-auto;
}
</style>
