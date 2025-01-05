import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'
import { nav } from './navbar'
import mermaid from './theme/plugin/mermaid'
import d2 from "vitepress-plugin-d2"
import { Layout, Theme, FileType } from 'vitepress-plugin-d2/dist/config';

export default defineConfig({
  // 语言
  lang: 'zh-CN',

  // 标题
  title: "CULPRO",

  // 站点地图
  sitemap: {
    hostname: 'https://culpro.cn',
  },

  // 描述
  description: "A VitePress Site",

  // 头部
  head: [
    ['link', { rel: 'icon', href: 'https://cdn.culpro.cn/images/favicon.ico' }],
  ],

  // 最后更新时间
  lastUpdated: true,

  // markdown配置
  markdown: {
    image: {
      // 开启图片懒加载
      lazyLoading: true
    },
    config: (md) => {
      md.use(mermaid)

      // Use D2 diagram plugin with optional configuration
      md.use(d2, {
        forceAppendix: false,
        layout: Layout.ELK,
        theme: Theme.NEUTRAL_DEFAULT,
        darkTheme: Theme.DARK_MUAVE,
        padding: 100,
        animatedInterval: 0,
        timeout: 120,
        sketch: false,
        center: false,
        scale: -1,
        target: "*",
        fontItalic: null,
        fontBold: null,
        fontSemiBold: null,
        fileType: FileType.SVG,
        directory: "d2-diagrams",
      });
    },
  },

  // 清除 URL 中的 .html 后缀，生成简洁的 URL
  cleanUrls: true,

  // 忽略死链，当设置为 true 时，VitePress 不会因为死链而导致构建失败
  ignoreDeadLinks: true,

  // 主题配置
  themeConfig: {
    // logo
    logo: 'https://cdn.culpro.cn/images/logo.png',

    // 导航栏
    nav,

    // 侧边栏
    sidebar,

    outline: {
      label: '本页内容',
    },

    // 自定义上下页名
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short', // 可选值full、long、medium、short
        timeStyle: 'medium' // 可选值full、long、medium、short
      },
    },

    // 侧边栏文字更改(移动端)
    sidebarMenuLabel: '目录',

    // 返回顶部文字修改(移动端)
    returnToTopLabel: '返回顶部',

    // 页脚
    footer: {
      message: '<a style="color: #546ec5;" href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2025118127号</a>',
      copyright: 'Copyright © 2024-2025 HogskinKitty'
    },

    // 搜索
    search: {
      provider: 'algolia',
      options: {
        appId: '...',
        apiKey: '...',
        indexName: '...',

        placeholder: '搜索文档',
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            searchBox: {
              resetButtonTitle: '清除查询条件',
              resetButtonAriaLabel: '清除查询条件',
              cancelButtonText: '取消',
              cancelButtonAriaLabel: '取消'
            },
            startScreen: {
              recentSearchesTitle: '搜索历史',
              noRecentSearchesText: '没有搜索历史',
              saveRecentSearchButtonTitle: '保存至搜索历史',
              removeRecentSearchButtonTitle: '从搜索历史中移除',
              favoriteSearchesTitle: '收藏',
              removeFavoriteSearchButtonTitle: '从收藏中移除'
            },
            errorScreen: {
              titleText: '无法获取结果',
              helpText: '你可能需要检查你的网络连接'
            },
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
              searchByText: '搜索提供者'
            },
            noResultsScreen: {
              noResultsText: '无法找到相关结果',
              suggestedQueryText: '你可以尝试查询',
              reportMissingResultsText: '你认为该查询应该有结果？',
              reportMissingResultsLinkText: '点击反馈'
            }
          }
        }
      }
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/HogskinKitty' }
    ]
  }
})
