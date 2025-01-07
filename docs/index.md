---
layout: home

hero:
  name: "CULPRO"
  text: "耕耘更好的程序"
  tagline: Cultivate Better Programs and Better Oneself.
  image:
    src: https://cdn.culpro.cn/images/logo.png
    alt: CULPRO
  actions:
    - theme: brand
      text: 开始耕耘
      link: /java/basic
    - theme: alt
      text: 搭建初衷
      link: /about
    - theme: alt
      text: GitHub
      link: https://github.com/HogskinKitty

features:
  - icon: 💻
    title: 技术深耕
    details: 深入Java核心技术、JVM调优、并发编程，Spring全家桶源码分析与最佳实践
    link: /java/basic
    linkText: 开始学习
  - icon: 📚
    title: 实战经验
    details: 分享架构设计、性能优化、问题排查等实战案例，提供可落地的解决方案
    link: /experience
    linkText: 查看案例
  - icon: 🔧
    title: 效率工具
    details: 精选开发工具与方法，打造高效开发工作流，助力AI编程实践
    link: /tools
    linkText: 工具推荐
  - icon: 📖
    title: 进阶指南
    details: 提供清晰的技术成长路线，从开发者到架构师的进阶之路
    link: /guide
    linkText: 开始进阶
  - icon: 🌟
    title: 源码解析
    details: 深入分析主流框架源码，学习设计思想和实现原理
    link: /source-code
    linkText: 源码阅读
  - icon: 🎯
    title: 最佳实践
    details: 整理开发规范、设计模式和架构实践，提升代码质量
    link: /best-practices
    linkText: 实践指南
---

<script setup lang="ts">
import { NAV_DATA } from './index-nav-data'
</script>

<MNavLinks v-for="{title, items} in NAV_DATA" :title="title" :items="items"/>

<div class="acknowledgements">
  <h2>鸣谢</h2>
  <p class="description">感谢以下开源项目和工具对本站的支持:</p>

  <div class="tools-container">
    <div class="tool-item">
      <a href="https://vitepress.dev/" target="_blank" class="tool-link">
        <img src="https://vitepress.dev/vitepress-logo-large.webp" alt="VitePress" class="tool-icon">
        <div>VitePress</div>
      </a>
    </div>
    <div class="tool-item">
      <a href="https://cn.vuejs.org/" target="_blank" class="tool-link">
        <img src="https://cn.vuejs.org/logo.svg" alt="Vue" class="tool-icon">
        <div>Vue.js</div>
      </a>
    </div>
    <div class="tool-item">
      <a href="https://github.com/" target="_blank" class="tool-link">
        <img src="https://cdn.culpro.cn/images/github-v1.png" alt="GitHub" class="tool-icon">
        <div>GitHub</div>
      </a>
    </div>
    <div class="tool-item">
      <a href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral" target="_blank" class="tool-link">
        <img src="https://cdn.culpro.cn/images/upyun_logo1.png" alt="bugstack" class="tool-icon">
        <div>又拍云</div>
      </a>
    </div>
    <div class="tool-item">
      <a href="https://bugstack.cn/" target="_blank" class="tool-link">
        <img src="https://cdn.culpro.cn/images/xiaofuge-blog-logo.png" alt="bugstack" class="tool-icon">
        <div>小傅哥 bugstack 虫洞栈</div>
      </a>
    </div>
    <div class="tool-item">
      <a href="https://fe-mm.com/" target="_blank" class="tool-link">
        <img src="https://cdn.culpro.cn/images/maomao-logo.png" alt="bugstack" class="tool-icon">
        <div>茂神</div>
      </a>
    </div>
    <div class="tool-item">
      <a href="https://vitepress.yiov.top/" target="_blank" class="tool-link">
        <img src="https://vitepress.dev/vitepress-logo-large.webp" alt="bugstack" class="tool-icon">
        <div>VitePress 中文教程</div>
      </a>
    </div>
  </div>

  <div class="upyun-container">
    <span>
      <span class="upyun-text-before">本网站由</span>
      <a href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral" target="_blank" class="upyun-link">
        <img src="https://cdn.culpro.cn/images/upyun_logo2.png" alt="upyun" class="upyun-logo">
      </a>
      <span class="upyun-text-after">提供CDN加速/云存储服务</span>
    </span>
  </div>
</div>

<style>
.acknowledgements {
  h2 {
    text-align: center;
    margin-top: 48px;
  }

  .description {
    text-align: center;
    color: #666;
    margin: 16px 0;
  }

  .tools-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 24px;
    margin: 32px 0;
  }

  .tool-item {
    text-align: center;
  }

  .tool-link {
    color: #666;
    text-decoration: none;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tool-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 8px;
  }

  .upyun-container {
    text-align: center;
  }

  .upyun-logo {
    height: 30px;
    margin: 0 8px 2px 8px;
  }

  .upyun-link {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
  }
}
</style>
