<template>
  <div ref="containerRef" class="flex h-screen w-screen bg-[#0d1117] text-gray-300 overflow-hidden font-sans relative">
    <SideNav />
    
    <div class="flex-1 flex flex-col overflow-hidden bg-[#0d1117]">
      <Toolbar :insert-snippet="insertSnippet" />
      
      <div class="flex-1 flex overflow-hidden relative">
        <EditorPanel ref="editorPanelRef" />
        <Splitter 
          :container-ref="containerRef" 
          :is-dragging="isDragging"
          @start-drag="startDragging"
          @handle-drag="handleDragging"
          @stop-drag="stopDragging"
        />
        <PreviewPanel />
      </div>

      <StatusBar />
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import SideNav from './components/SideNav.vue';
import Toolbar from './components/Toolbar.vue';
import EditorPanel from './components/EditorPanel.vue';
import PreviewPanel from './components/PreviewPanel.vue';
import Splitter from './components/Splitter.vue';
import StatusBar from './components/StatusBar.vue';
import { useEditorStore } from './store/editor';

const store = useEditorStore();
const containerRef = ref(null);
const editorPanelRef = ref(null);
const isDragging = ref(false);

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
  window.removeEventListener('mouseup', stopDragging);
};

const insertSnippet = (prefix, suffix = '') => {
  const el = editorPanelRef.value?.textareaRef;
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
</script>
