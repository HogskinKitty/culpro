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
      text: '快速开始',
      items: [
        { text: 'RabbitMQ 简介', link: 'what-is-rabbitmq' },
        { text: '安装部署', link: 'install' },
        { text: '管理界面使用', link: 'management-ui' }
      ]
    },
    {
      text: '核心概念',
      items: [
        { text: '交换机与队列', link: 'basic-concepts' },
        { text: '消息路由', link: 'message-routing' },
        { text: '消息模型', link: 'message-model' }
      ]
    },
    {
      text: '可靠性投递',
      items: [
        { text: '发布确认', link: 'message-confirm' },
        { text: '消费确认', link: 'consumer-ack' },
        { text: '消息持久化', link: 'message-persist' }
      ]
    },
    {
      text: '高级特性',
      items: [
        { text: '死信队列', link: 'dead-letter' },
        { text: '延迟队列', link: 'delay-queue' },
        { text: '集群部署', link: 'mirror-queue' }
      ]
    },
    {
      text: '实战应用',
      items: [
        { text: 'Spring 集成', link: 'spring-amqp-integration' },
        { text: '最佳实践', link: 'best-practices' },
        { text: '运维监控', link: 'monitoring-alarm' }
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
