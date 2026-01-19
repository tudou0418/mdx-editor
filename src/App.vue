<template>
  <div ref="containerRef" class="flex h-screen w-screen bg-[#0d1117] text-gray-300 overflow-hidden font-sans relative">
    <!-- 1. 侧边导航栏 -->
    <nav class="w-16 flex-none border-r border-gray-800 flex flex-col items-center py-6 gap-6 bg-[#161b22] z-50 shadow-2xl">
      <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg mb-4 hover:rotate-6 transition-transform cursor-pointer">
        <Sparkles :size="24" />
      </div>
      <button @click="store.view = 'editor'" :class="['p-3 rounded-xl transition-all', store.view === 'editor' ? 'bg-blue-600/20 text-blue-400 shadow-inner' : 'text-gray-500 hover:text-gray-300']"><PenTool :size="20" /></button>
      <button @click="store.view = 'help'" :class="['p-3 rounded-xl transition-all', store.view === 'help' ? 'bg-purple-600/20 text-purple-400 shadow-inner' : 'text-gray-500 hover:text-gray-300']"><BookOpen :size="20" /></button>
      <div class="mt-auto mb-4"><button class="text-gray-500 hover:text-gray-300"><Settings :size="20" /></button></div>
    </nav>

    <!-- 2. 主体容器 -->
    <div class="flex-1 flex flex-col overflow-hidden bg-[#0d1117]">
      <!-- 独立工具栏 -->
      <div class="w-full flex-none p-3 border-b border-gray-800 bg-[#161b22] z-40 shadow-xl overflow-visible">
        <div class="flex items-center gap-4 flex-wrap">
          <!-- 文本样式 -->
          <div class="flex items-center gap-1 pr-4 border-r border-gray-800">
            <button @click="insertSnippet('**', '**')" class="p-2 hover:bg-gray-700 rounded text-gray-400 transition-colors" title="加粗"><Bold :size="16" /></button>
            <button @click="insertSnippet('*', '*')" class="p-2 hover:bg-gray-700 rounded text-gray-400 transition-colors" title="斜体"><Italic :size="16" /></button>
            <button @click="insertSnippet('\n- ', '')" class="p-2 hover:bg-gray-700 rounded text-gray-400 transition-colors" title="无序列表"><List :size="16" /></button>
            <button @click="insertSnippet('\n```javascript\n', '\n```\n')" class="p-2 hover:bg-gray-700 rounded text-gray-400 transition-colors" title="代码块"><Code :size="16" /></button>
          </div>
          
          <!-- 颜色组 -->
          <div class="flex items-center gap-2 pr-4 border-r border-gray-800">
            <button v-for="c in ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b']" :key="c"
            @click="insertSnippet('<Color value=&quot;' + c + '&quot;>', '</Color>')"
            class="w-4 h-4 rounded border border-white/20 hover:scale-125 transition-transform"
            :style="{ backgroundColor: c }"></button>
          </div>

          <!-- 组件组 -->
          <div class="flex items-center gap-2 pr-4 border-r border-gray-800">
            <button @click="insertSnippet('\n<Callout type=&quot;info&quot;>\n  ', '\n</Callout>\n')" class="toolbar-btn text-blue-400 border-blue-800/40 bg-blue-900/10">提示框</button>
            <button @click="insertSnippet('\n<Step level=&quot;1&quot; number=&quot;1&quot; title=&quot;标题&quot;>\n  ', '\n</Step>\n')" class="toolbar-btn text-purple-400 border-purple-800/40 bg-purple-900/10">步骤条</button>
            <button @click="insertSnippet('\n<ImageCarousel images=&quot;url1, url2&quot; caption=&quot;图集&quot; />\n')" class="toolbar-btn text-orange-400 border-orange-800/40 bg-orange-900/10">轮播图</button>
            <button @click="insertSnippet('\n<Tabs labels=&quot;标签1, 标签2&quot;>\n  内容1\n  ---\n  内容2\n</Tabs>\n')" class="toolbar-comp-btn text-gray-300 border-gray-700 bg-gray-800/40">选项卡</button>
            <button @click="insertSnippet('\n<Checklist>\n  <CheckItem checked=&quot;true&quot;>已完成</CheckItem>\n  <CheckItem checked=&quot;false&quot;>待办</CheckItem>\n</Checklist>\n')" class="toolbar-comp-btn text-emerald-400 border-emerald-800/40 bg-emerald-900/10">任务列表</button>
          </div>

          <!-- 表情选择器 -->
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
      <div class="flex-1 flex overflow-hidden relative">
        <!-- 编辑器面板 -->
        <div :style="{ width: store.editorWidth + '%' }" class="min-w-0 flex flex-col bg-[#0d1117] border-r border-gray-800 relative z-10">
          <div class="flex-1 flex overflow-hidden editor-container">
            <div class="w-10 pt-6 flex flex-col items-center text-[9px] text-gray-700 font-mono select-none border-r border-gray-800/20">
              <div v-for="n in 60" :key="n" class="h-6">{{ n }}</div>
            </div>
            <textarea ref="textareaRef" v-model="store.content" class="editor-textarea" placeholder="在此输入 MDX 内容..."></textarea>
          </div>
        </div>

        <!-- 分割条 -->
        <div @mousedown="startDragging" :class="['splitter', isDragging ? 'dragging' : '']"></div>

        <!-- 预览面板 -->
        <div class="flex-1 min-w-0 bg-white flex flex-col overflow-hidden" :style="{ pointerEvents: isDragging ? 'none' : 'auto' }">
          <div class="flex-1 overflow-y-auto px-12 md:px-20 py-12 scroll-smooth bg-[#fafafa]">
            <article class="max-w-3xl mx-auto prose prose-slate">
              <div v-for="(el, idx) in parsedElements" :key="idx">
                <component :is="'h' + el.level" v-if="el.type === 'heading'" :class="[el.level === 1 ? 'text-4xl font-black mt-12 mb-10 text-slate-900 tracking-tight' : 'text-2xl font-black mt-10 mb-6 text-slate-800']">{{ el.content }}</component>
                <p v-else-if="el.type === 'p'" class="my-6 text-slate-700 leading-8" v-html="renderInline(el.content)"></p>
                <MdxLibrary v-else-if="el.type === 'quote'" is-quote>{{ el.content }}</MdxLibrary>
                <MdxLibrary v-else-if="el.type === 'callout'" :type="el.calloutType">{{ el.content }}</MdxLibrary>
                <MdxLibrary v-else-if="el.type === 'step'" is-step :number="el.num" :title="el.title" :level="el.level">{{ el.content }}</MdxLibrary>
                <MdxLibrary v-else-if="el.type === 'carousel'" is-carousel :images="el.images" :caption="el.caption" />
                <MdxLibrary v-else-if="el.type === 'tabs'" is-tabs :labels="el.labels" :content="el.content" />
                <MdxLibrary v-else-if="el.type === 'checklist'" is-checklist :items="el.items" />
                
                <div v-else-if="el.type === 'code'" class="code-block-container">
                  <div class="code-header">{{ el.lang }} <span>SOURCE</span></div>
                  <pre class="p-6 overflow-x-auto text-[13px] text-gray-300 font-mono leading-relaxed">{{ el.content }}</pre>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      <!-- 底部状态栏 -->
      <footer class="h-8 flex-none px-4 bg-[#161b22] border-t border-gray-800 flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest z-50">
        <div class="flex gap-6">
          <span class="flex items-center gap-1.5 text-blue-500"><Monitor :size="12" /> 分栏比例: {{ Math.round(store.editorWidth) }}%</span>
          <span class="flex items-center gap-1.5 text-purple-500"><FileText :size="12" /> 总字数: {{ store.content.length }}</span>
        </div>
        <div class="flex items-center gap-2"><span class="text-emerald-500 opacity-80 uppercase tracking-tighter">Render Engine Active</span><div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div></div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { 
  Sparkles, PenTool, BookOpen, Settings, Bold, Italic, List, 
  Code, Smile, Download, Monitor, FileText, ChevronLeft 
} from 'lucide-vue-next';
import { useEditorStore } from './store/editor';
import { useMDXParser } from './composables/useMDXParser';
import MdxLibrary from './components/MdxLibrary.vue';

const store = useEditorStore();
const textareaRef = ref(null);
const containerRef = ref(null);
const isDragging = ref(false);

const { parsedElements, renderInline } = useMDXParser(() => store.content);

// 拖拽逻辑
const startDragging = () => {
  isDragging.value = true;
  window.addEventListener('mousemove', handleDragging);
  window.addEventListener('mouseup', stopDragging);
};
const handleDragging = (e) => {
  if (!isDragging.value || !containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  const p = ((e.clientX - rect.left - 64) / (rect.width - 64)) * 100;
  store.updateWidth(p);
};
const stopDragging = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', handleDragging);
};

// 工具栏插入逻辑
const insertSnippet = (prefix, suffix = '') => {
  const el = textareaRef.value;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const selected = store.content.substring(start, end);
  const before = store.content.substring(0, start);
  const after = store.content.substring(end);
  store.setContent(before + prefix + selected + suffix + after);
  setTimeout(() => {
    el.focus();
    if (suffix) el.setSelectionRange(start + prefix.length, end + prefix.length);
    else el.setSelectionRange(start + prefix.length, start + prefix.length);
  }, 0);
};

const emojis = ['😀', '🚀', '🔥', '✨', '📝', '💡', '🎨', '✔️', '❌', '⭐', '📌', '📅', '🎉', '🌈', '💻', '🔍'];
</script>

<style scoped>
.toolbar-btn {
  @apply px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all active:scale-95;
}
.export-btn {
  @apply flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-black shadow-lg shadow-blue-500/20 active:translate-y-0.5 transition-all;
}
.editor-textarea {
  @apply flex-1 bg-transparent p-6 text-gray-300 font-mono text-sm leading-6 outline-none resize-none;
}
.splitter {
  @apply w-1 bg-gray-800 z-40 relative cursor-col-resize hover:bg-blue-500 transition-colors;
}
.splitter.dragging { @apply bg-blue-500; }
.code-block-container {
  @apply my-10 rounded-2xl overflow-hidden bg-[#0d1117] border border-gray-800 shadow-2xl;
}
.code-header {
  @apply px-5 py-3 bg-[#161b22] text-[10px] text-gray-500 font-mono font-bold border-b border-gray-800 flex justify-between items-center;
}
.emoji-picker-dropdown {
  @apply absolute right-0 top-full mt-2 grid grid-cols-4 gap-1 p-2 bg-[#1c2128] border border-gray-700 rounded-lg shadow-2xl z-[60] w-40 opacity-0 group-hover/emoji:opacity-100 transition-opacity pointer-events-none group-hover/emoji:pointer-events-auto;
}
</style>