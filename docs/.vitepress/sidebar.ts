import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  // 定义基础路径
  '/java/': { base: '/java/', items: sidebarJava() },
  '/ai-llm/': { base: '/ai-llm/', items: sidebarAiLLM() },
}

// Java
function sidebarJava(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Java 基础',
      items: [
        { text: '示例内容', link: 'basic' },
      ],
    },
    {
      text: 'JVM',
      items: [
        { text: '示例内容', link: 'jvm' },
      ],
    },
  ]
}

// AI/LLM
function sidebarAiLLM(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'AI 编程',
      items: [
        { text: 'Cline + GPT-4o API + LiteLLM 实现 Cursor 免费平替', link: 'cline-gpt' },
      ],
    },
  ]
}


