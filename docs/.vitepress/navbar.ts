import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '主页', link: '/' },
  {
    text: '后端技术',
    items: [
      {
        text: '编程语言',
        items: [
          { text: 'Java', link: '/java/basic' },
          { text: 'Python', link: '/python/basic' }
        ]
      },
      {
        text: '框架',
        items: [
          { text: 'Spring', link: '/java/spring' },
          { text: 'Spring Boot', link: '/java/springboot' },
          { text: 'Spring Cloud', link: '/java/springcloud' },
          { text: 'MyBatis', link: '/java/mybatis' }
        ]
      }
    ]
  },
  {
    text: '数据库',
    items: [
      {
        text: '关系型数据库',
        items: [
          { text: 'MySQL', link: '/database/mysql/' },
          { text: 'PostgreSQL', link: '/database/postgresql/' },
          { text: 'Oracle', link: '/database/oracle/' }
        ]
      },
      {
        text: '非关系型数据库',
        items: [
          { text: 'MongoDB', link: '/database/mongodb/' },
        ]
      }
    ]
  },
  {
    text: '中间件',
    items: [
      {
        text: '缓存中间件',
        items: [
          { text: 'Redis', link: '/middleware/redis/' },
          { text: 'Memcached', link: '/middleware/memcached/' }
        ]
      },
      {
        text: '消息中间件',
        items: [
          { text: 'RabbitMQ', link: '/middleware/rabbitmq/rabbitmq-introduce' },
          { text: 'Kafka', link: '/middleware/kafka/' },
          { text: 'RocketMQ', link: '/middleware/rocketmq/' }
        ]
      },
      {
        text: '搜索中间件',
        items: [
          { text: 'ElasticSearch', link: '/middleware/elasticsearch/' },
          { text: 'Solr', link: '/middleware/solr/' },
          { text: 'Lucene', link: '/middleware/lucene/' }
        ]
      }
    ],

  },
  {
    text: '前端技术',
    items: [
      {
        text: '基础',
        items: [
          { text: 'HTML', link: '/front/html/' },
          { text: 'CSS', link: '/front/css/' },
          { text: 'JavaScript', link: '/front/javascript/' }
        ]
      },
      {
        text: '框架',
        items: [
          { text: 'Vue', link: '/front/vue/' }
        ]
      }
    ]
  },
  {
    text: '系统设计',
    items: [
      { text: '系统架构', link: '/system-framework/' },
      { text: '第三方技术', link: '/third-party-technology/' }
    ]
  },
  {
    text: '计算机基础',
    items: [
      { text: '算法', link: '/algorithm/' },
      { text: '设计模式', link: '/design-pattern/' },
      { text: '操作系统', link: '/os-basics/' },
      { text: '计算机网络', link: '/computer-network/' },
      { text: '计算机组成', link: '/computer-architecture/' }
    ]
  },
  {
    text: '开发工具链',
    items: [
      { text: '开发工具', link: '/tools/' },
      { text: '运维部署', link: '/dev-ops/' },
      { text: '效率提升', link: '/efficiency/' }
    ]
  },
  {
    text: 'AI/LLM',
    items: [
      { text: 'AI 编程', link: '/ai-llm/cline-gpt' }
    ]
  }
]