/**
 * 文件路径: src/store/editor.js
 * 职责: 管理编辑器的内容状态、视图模式以及左右布局的宽度比例。
 */
import { defineStore } from 'pinia';

export const useEditorStore = defineStore('editor', {
  state: () => ({
    // 默认初始内容
    content: `# 🚀 本地项目创作中\n\n欢迎使用专业级 MDX 创作工具。\n\n<Quote>\n  这是一个完整的本地项目结构，您可以自由扩展组件库。\n</Quote>\n\n<Step level="1" number="1" title="开始创作">\n  点击上方工具栏插入组件，体验实时预览与拖拽布局。\n</Step>\n\n<ImageCarousel images="https://images.unsplash.com/photo-1498050108023-c5249f4df085, https://images.unsplash.com/photo-1461749280684-dccba630e2f6" caption="本地测试图片轮播" />`,
    view: 'editor',      // 视图模式: 'editor' (编辑) 或 'help' (帮助)
    editorWidth: 50,     // 编辑区所占百分比 (20-80)
    isCompiling: false   // 是否正在渲染中
  }),
  actions: {
    setContent(val) {
      this.content = val;
    },
    updateWidth(val) {
      this.editorWidth = Math.max(15, Math.min(85, val));
    }
  }
});