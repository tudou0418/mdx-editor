/**
 * 文件路径: src/composables/useMDXParser.js
 * 职责: 将 MDX 源码通过正则表达式拆分为可识别的结构化数据。
 */
import { computed } from 'vue';

export function useMDXParser(sourceGetter) {
  // 行内样式解析 (加粗、斜体、颜色等)
  const renderInline = (text) => {
    if (!text) return '';
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/&lt;Color value=['"](.*?)['"]&gt;(.*?)&lt;\/Color&gt;/g, '<span style="color: $1">$2</span>')
      .replace(/&lt;Badge&gt;(.*?)&lt;\/Badge&gt;/g, '<span class="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase mx-1 bg-blue-100 text-blue-700 border border-blue-200">$1</span>');
  };

  const parsedElements = computed(() => {
    const source = sourceGetter();
    if (!source) return [];
    const lines = source.split('\n');
    const results = [];
    let i = 0;

    while (i < lines.length) {
      const rawLine = lines[i];
      const line = rawLine.trim();
      // --- 增强 Tabs 匹配 ---
        if (line.startsWith('<Tabs')) { // 使用去除前导空格后的 line 匹配
            // 增加 'i' 忽略大小写，并支持 labels 属性前后的任意空格
            const labelsMatch = rawLine.match(/labels=['"]\s*([^'"]+)\s*['"]/i);
            const labels = labelsMatch ? labelsMatch[1] : '';
            
            let body = []; 
            i++; // 跳过当前 <Tabs 这一行
            
            // 循环直到找到闭合标签
            while (i < lines.length && !lines[i].trim().startsWith('</Tabs>')) {
                body.push(lines[i]);
                i++;
            }
            
            results.push({ 
                type: 'tabs', 
                labels, 
                content: body.join('\n') // 这里保留换行符，方便后续切片
            });
        }
      // 代码块解析
      else if (line.startsWith('```')) {
        const lang = line.slice(3) || 'text';
        let code = []; i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) { code.push(lines[i]); i++; }
        results.push({ type: 'code', lang, content: code.join('\n') });
      } 
      // 标题解析
      else if (line.startsWith('#')) {
        const level = (line.match(/^#+/) || ['#'])[0].length;
        results.push({ type: 'heading', level, content: line.replace(/^#+\s*/, '') });
      } 
      // 引用块解析
      else if (line.startsWith('<Quote>')) {
        let body = []; i++;
        while (i < lines.length && !lines[i].trim().startsWith('</Quote>')) { body.push(lines[i]); i++; }
        results.push({ type: 'quote', content: body.join(' ') });
      } 
      // 提示框解析
      else if (line.startsWith('<Callout')) {
        const type = (line.match(/type=['"]\s*(\w+)\s*['"]/) || [null, 'info'])[1];
        let body = []; i++;
        while (i < lines.length && !lines[i].trim().startsWith('</Callout>')) { body.push(lines[i]); i++; }
        results.push({ type: 'callout', calloutType: type, content: body.join(' ') });
      } 
      // 步骤条解析 (支持 level 属性)
      else if (line.startsWith('<Step')) {
        const title = (line.match(/title=['"]\s*([^'"]+)\s*['"]/) || [null, '步骤'])[1];
        const num = (line.match(/number=['"]\s*([^'"]+)\s*['"]/) || [null, '1'])[1];
        const level = (line.match(/level=['"]\s*([^'"]+)\s*['"]/) || [null, '1'])[1];
        let body = []; i++;
        while (i < lines.length && !lines[i].trim().startsWith('</Step>')) { body.push(lines[i]); i++; }
        results.push({ type: 'step', title, num, level, content: body.join(' ') });
      } 
      // 轮播图解析
      else if (line.startsWith('<ImageCarousel')) {
        const imgs = (line.match(/images=['"]\s*([^'"]+)\s*['"]/) || [null, ''])[1];
        const caption = (line.match(/caption=['"]\s*([^'"]+)\s*['"]/) || [null, ''])[1];
        results.push({ type: 'carousel', images: imgs, caption });
      }
      // 任务清单解析
      else if (line.startsWith('<Checklist>')) {
        let items = []; i++;
        while (i < lines.length && !lines[i].trim().startsWith('</Checklist>')) {
          let l = lines[i].trim();
          if (l.startsWith('<CheckItem')) {
            const checked = (l.match(/checked=['"]\s*(\w+)\s*['"]/) || [null, 'false'])[1];
            const text = l.replace(/<CheckItem.*?>|<\/CheckItem>/g, '');
            items.push({ checked, text });
          }
          i++;
        }
        results.push({ type: 'checklist', items });
      } 
      // 普通段落
      else if (line !== '') {
        results.push({ type: 'p', content: rawLine });
      }
      i++;
    }
    return results;
  });

  return { parsedElements, renderInline };
}