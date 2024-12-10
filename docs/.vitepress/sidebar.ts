import type {DefaultTheme} from 'vitepress'

export const sidebar: DefaultTheme.Config['sidebar'] = [
  {
    base: '/java/',
    text: 'Java 基础',
    items: [
      {
        base: '/java/',
        text: '示例内容',
        link: 'basic'
      },
    ],
  },
  {
    base: '/java/',
    text: 'JVM',
    items: [
      {
        text: '示例内容',
        link: 'jvm'
      },
    ],
  }
]