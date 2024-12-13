import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'
import { nav } from './navbar'


export default defineConfig({
  // 语言
  lang: 'zh-CN',

  // 标题
  title: "CULPRO",

  // 站点地图
  sitemap: {
    hostname: 'https://hogskinkitty.ftp.sh/',
  },

  // 描述
  description: "A VitePress Site",

  // 头部
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  // 最后更新时间
  lastUpdated: true,

  // markdown配置
  markdown: {
    image: {
      // 开启图片懒加载
      lazyLoading: true
    },
  },

  // 主题配置
  themeConfig: {
    // logo
    logo: '/logo.png',

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
      message: '',
      copyright: 'Copyright © 2024 HogskinKitty'
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
      { icon: 'github', link: 'https://github.com/HogskinKitty/culpro' }
    ]
  }
})
