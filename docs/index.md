---
layout: home
# layoutClass: m-nav-layout

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
    title: 前端物语
    details: 整理前端常用知识点（面试八股文）如有异议按你的理解为主，不接受反驳
    link: /xxx
    linkText: 前端常用知识
  - icon: 📖
    title: 源码阅读
    details: 了解各种库的实现原理，学习其中的小技巧和冷知识
    link: /xxx
    linkText: 源码阅读
  - icon: 💡
    title: Workflow
    details: 在工作中学到的一切（常用库/工具/奇淫技巧等）配合 CV 大法来更好的摸鱼
    link: /xxx
    linkText: 常用工具库
  - icon: 💼
    title: 提效工具
    details: 工欲善其事，必先利其器。记录开发和日常使用中所用到的软件、插件、扩展等
    link: /xxx
    linkText: 提效工具
  - icon: 🐞
    title: 踩坑记录
    details: 那些年我们踩过的坑，总有一些让你意想不到的问题
    link: /xxx
    linkText: 踩坑记录
  - icon: 💯
    title: 吾志所向，一往无前。
    details: 一个想躺平的小开发
    link: /xxx
    linkText: 关于我
---

<!-- <br> -->

<script setup lang="ts">
import { NAV_DATA } from './index-data'
</script>

<!-- <RoadMap/> -->
<style src="/.vitepress/theme/style/nav.css"></style>
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
    <!-- <div class="tool-item">
      <a href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral" target="_blank" class="tool-link">
        <img src="https://cdn.culpro.cn/images/upyun_logo1.png" alt="bugstack" class="tool-icon">
        <div>又拍云</div>
      </a>
    </div> -->
    <div class="tool-item">
      <a href="https://bugstack.cn/" target="_blank" class="tool-link">
        <img src="https://cdn.culpro.cn/images/xiaofuge-blog-logo.png" alt="bugstack" class="tool-icon">
        <div>小傅哥 bugstack 虫洞栈</div>
      </a>
    </div>
  </div>

  <!-- <div class="upyun-container">
    <span>
      <span class="upyun-text-before">本网站由</span>
      <a href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral" target="_blank" class="upyun-link">
        <img src="https://cdn.culpro.cn/images/upyun_logo2.png" alt="upyun" class="upyun-logo">
      </a>
      <span class="upyun-text-after">提供CDN加速/云存储服务</span>
    </span>
  </div> -->
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

  /* .upyun-container {
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
  } */
}
</style>
