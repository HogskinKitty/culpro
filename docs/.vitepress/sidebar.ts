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
        { text: '基础语法', link: 'java-basics' },
        { text: '面向对象', link: 'java-oop' },
      ],
    },
    {
      text: '集合框架',
      items: [
        { text: '什么是集合框架', link: 'collection' },
        { text: 'ArrayList 源码分析', link: 'arraylist' },
        { text: 'LinkedList 源码分析', link: 'linkedlist' },
        { text: 'HashMap 源码分析', link: 'hashmap' },
        { text: 'ConcurrentHashMap 源码分析', link: 'concurrent-hashmap' },
      ],
    },
    {
      text: '并发编程',
      items: [
        { text: '线程与进程基础', link: 'thread-basics' },
        { text: '线程与进程安全', link: 'thread-safety' },
      ],
    },
    // {
    //   text: 'JVM',
    //   items: [
    //     { text: '示例内容', link: 'jvm' },
    //   ],
    // },
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
      ]
    },
    {
      text: '基础概念',
      items: [
        { text: '交换机与队列', link: 'exchanges-and-queues' },
        { text: '消息路由', link: 'message-routing' },
        { text: '消息模型', link: 'message-model' }
      ]
    },
    {
      text: '进阶特性',
      items: [
        { text: '发布确认机制', link: 'message-confirm' },
        { text: '消费确认机制', link: 'consumer-ack' },
        { text: '消息持久化', link: 'message-persist' },
        { text: '死信队列', link: 'dead-letter' },
        { text: '延迟队列', link: 'delay-queue' }
      ]
    },
    {
      text: '集群与运维',
      items: [
        { text: '集群架构', link: 'cluster-architecture' },
        { text: '集群部署', link: 'mirror-queue' },
        { text: '运维监控', link: 'monitoring-alarm' },
        { text: '常见问题排查', link: 'troubleshooting' }
      ]
    },
    {
      text: '实战应用',
      items: [
        { text: 'Spring AMQP 集成', link: 'spring-amqp-integration' },
        { text: '最佳实践', link: 'best-practices' },
        { text: '性能优化', link: 'performance-tuning' }
      ]
    },
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
