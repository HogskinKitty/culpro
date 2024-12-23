import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  // 定义基础路径
  '/java/': { base: '/java/', items: sidebarJava() },
  '/ai-llm/': { base: '/ai-llm/', items: sidebarAiLLM() },
  '/middleware/redis/': { base: '/middleware/redis/', items: sidebarMiddlewareRedis() },
  '/middleware/rabbitmq/': { base: '/middleware/rabbitmq/', items: sidebarMiddlewareRabbitMQ() },
  '/middleware/kafka/': { base: '/middleware/kafka/', items: sidebarMiddlewareKafka() },
  '/middleware/elasticsearch/': { base: '/middleware/elasticsearch/', items: sidebarMiddlewareElasticsearch() },
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

// Middleware-Redis
function sidebarMiddlewareRedis(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Redis 简介',
      items: [
        { text: '什么是 Redis?', link: '/' }
      ]
    },
    {
      text: '安装 Redis',
      items: [
        { text: 'Mac', link: '/install/mac' },
        { text: 'Windows', link: '/install/windows' },
        { text: 'Linux', link: '/install/linux' },
        { text: 'Docker', link: '/install/docker' }
      ]
    },
    {
      text: '入门',
      items: [

      ]
    },
  ]
}

// Middleware-RabbitMQ
function sidebarMiddlewareRabbitMQ(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '简介',
      items: [
        { text: '什么是 RabbitMQ?', link: 'rabbitmq-introduce' },
        { text: '学习路线', link: 'learning-roadmap' },
        { text: '基础概念', link: 'basic-concepts' }
      ]
    },
    {
      text: '安装与配置',
      items: [
        { text: '各平台安装', link: 'install' },
        { text: '基础配置', link: 'basic-config' },
        { text: '管理界面使用', link: 'management-ui' },
        { text: '用户与权限管理', link: 'user-management' }
      ]
    },
    {
      text: '核心功能',
      items: [
        { text: '消息发布与消费', link: 'message-pub-sub' },
        { text: '消息确认机制', link: 'message-confirm' },
        { text: '消息持久化', link: 'message-persist' },
        { text: '死信队列', link: 'dead-letter-queue' },
        { text: '延迟队列', link: 'delay-queue' },
        { text: '优先级队列', link: 'priority-queue' }
      ]
    },
    {
      text: '高级特性',
      items: [
        { text: '集群搭建', link: 'cluster-setup' },
        { text: '镜像队列', link: 'mirror-queue' },
        { text: '负载均衡', link: 'load-balance' },
        { text: '消息追踪', link: 'message-trace' },
        { text: '插件系统', link: 'plugin-system' }
      ]
    },
    {
      text: '实战应用',
      items: [
        { text: 'Spring AMQP 整合', link: 'spring-amqp-integration' },
        { text: '常见应用场景', link: 'common-use-cases' },
        { text: '性能优化', link: 'performance-optimization' },
        { text: '监控告警', link: 'monitoring-alarm' },
        { text: '问题排查', link: 'problem-troubleshooting' }
      ]
    },
    {
      text: '运维管理',
      items: [
        { text: '日常运维', link: 'daily-operation' },
        { text: '备份恢复', link: 'backup-recovery' },
        { text: '版本升级', link: 'version-upgrade' },
        { text: '性能监控', link: 'performance-monitoring' },
        { text: '故障处理', link: 'fault-handling' }
      ]
    }

  ]
}

// Middleware-Kafka
function sidebarMiddlewareKafka(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Kafka 简介',
      items: [
        { text: '什么是 Kafka?', link: '/' }
      ]
    }
  ]
}

// Middleware-Elasticsearch
function sidebarMiddlewareElasticsearch(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'ElasticSearch 简介',
      items: [
        { text: '什么是 ElasticSearch?', link: '/elasticsearch/' }
      ]
    }
  ]
}
