# 什么是 RabbitMQ？

RabbitMQ 是一个开源的消息中间件(Message Broker)，由 Pivotal 公司基于 Erlang 语言开发。它实现了 AMQP（Advanced Message Queuing Protocol）协议，是当前最主流的消息中间件之一。

::: tip 核心定位
RabbitMQ 在分布式系统中主要用于：

- 异步消息处理
- 应用解耦
- 流量削峰填谷
- 消息分发
:::

## 核心特性

### 1. 可靠性保证

- **持久化机制**：支持消息和队列持久化到磁盘
- **消息确认**：ACK 机制确保消息处理的可靠性
- **发布确认**：Publisher Confirms 保证消息发送可靠性
- **高可用性**：支持镜像队列、主从架构、集群部署

### 2. 灵活的消息路由

- **多种交换机类型**
  - Direct Exchange：直接匹配
  - Topic Exchange：模式匹配
  - Fanout Exchange：广播模式
  - Headers Exchange：属性匹配
- **绑定(Binding)机制**：灵活的消息路由规则

### 3. 多协议支持

- AMQP（核心协议）
- MQTT（物联网场景）
- STOMP（简单文本协议）
- HTTP（REST API）
- WebSocket（Web 实时通信）

### 4. 管理与监控

- 可视化管理界面
- 完善的监控指标
- 丰富的管理 API
- 细粒度的权限控制

## 应用场景

### 1. 异步处理

RabbitMQ 作为成熟的企业级消息中间件,在众多领域都有广泛应用:

- 金融行业：订单处理、支付流程、风控系统
- 电商领域：订单系统、库存系统、物流系统
- 物联网：设备通信、数据采集、实时监控
- 社交应用：消息推送、通知系统
- 视频服务：视频转码、弹幕系统
