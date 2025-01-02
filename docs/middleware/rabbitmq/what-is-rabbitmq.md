# 什么是 RabbitMQ？

RabbitMQ 是一个的开源消息代理软件，旨在实现消息的可靠传递和分发。它由 Pivotal 公司基于 Erlang 语言开发，支持
AMQP（Advanced Message Queuing Protocol）协议。

## 主要特性

![RabbitMQ 主要特性](https://raw.githubusercontent.com/HogskinKitty/assets-repository/master/culpro/rabbitmq-features.png)

1. **可靠性**  
   - 支持消息持久化（持久化队列和消息）。
   - 提供消息确认机制（ACK/NACK）。
   - 提供高可用性队列（HA queues）。

2. **灵活路由**  
   - 支持多种交换器类型，满足不同场景下的路由需求。

3. **支持多种协议**  
   - 默认支持 AMQP，还支持 MQTT、STOMP 等协议。

4. **易扩展性**  
   - 支持集群部署和分布式架构。

5. **多语言支持**  
   - 提供多种语言客户端库，如 Java、Python、Go、C# 等。

6. **监控与管理**  
   - 提供强大的管理界面和命令行工具，支持插件扩展。

## 核心组件

```d2
direction: right

# 定义核心组件
Producer: 生产者 {
  shape: rectangle
  style.fill: "#2563EB"
}

Exchange: 交换机 {
  shape: diamond
  style.fill: "#059669"
}

Queue: 队列 {
  shape: queue
  style.fill: "#EA580C"
}

Consumer: 消费者 {
  shape: rectangle
  style.fill: "#7C3AED"
}

# 设置布局
grid-rows: 1
grid-columns: 4
grid-gap: 50

# 设置全局样式
*.style.stroke: "#E5E7EB"
*.style.border-radius: 10
*.style.font-size: 14
```

1. **Producer（生产者）**
   - 负责发送消息到 RabbitMQ 的应用程序。生产者将消息发送到特定的交换机（Exchange）。

2. **Exchange（交换机）**
   - 接收来自生产者的消息，并根据一定的路由规则将消息转发到一个或多个队列。
   - RabbitMQ 支持多种类型的交换机，包括 Direct、Fanout、Topic 和 Headers。

3. **Queue（队列）**
   - 存储消息的地方，消费者从队列中获取消息进行处理。队列是 RabbitMQ 的核心组件之一，确保消息的可靠传递。

4. **Consumer（消费者）**
   - 从队列中接收和处理消息的应用程序。消费者可以是单个应用程序，也可以是多个应用程序的组合。

5. **Binding（绑定）**
   - 用于将交换机和队列连接起来的规则。绑定定义了消息如何从交换机路由到队列。

6. **Message（消息）**
   - 在 RabbitMQ 中传递的数据单元，包含了实际的数据内容和一些元数据。

7. **Routing Key（路由键）**
   - 消息从交换机路由到队列时使用的关键字。

8. **Virtual Host（虚拟主机）**
   - RabbitMQ 中的逻辑隔离单位，包含独立的交换机、队列和绑定。
   - 拥有独立的权限控制，不同虚拟主机之间完全隔离。
   - 默认为 "/"。

9. **Channel（信道）**
   - 一个 TCP 连接内的轻量级逻辑连接，供生产者或消费者使用。

## 工作流程

```d2
direction: right

Producer: {
  shape: rectangle
  style.fill: "#2563EB"
}

Broker: {
  Exchange: {
    shape: diamond
    style.fill: "#059669"
  }

  Queue: {
    shape: queue
    style.fill: "#EA580C"
  }
}

Consumer: {
  shape: rectangle
  style.fill: "#7C3AED"
}

Producer -> Broker.Exchange -> Broker.Queue -> Consumer: {
  style.animated: true
}

*.style.border-radius: 10
*.*.style.border-radius: 10
```

1. 生产者（Producer）发送消息到交换机（Exchange）

2. 交换机根据绑定关系（Binding）和路由规则（Routing）将消息分发给相应的队列（Queue）

3. 消息存储在队列中等待被消费

4. 消费者（Consumer）以下两种方式之一获取消息：
   - 推送模式：消息代理主动将消息推送给订阅的消费者
   - 拉取模式：消费者主动从队列中拉取消息

## 常见应用场景

1. **异步任务处理**  
   - 例如订单处理、邮件发送等需要解耦和非实时响应的场景。

2. **系统解耦**  
   - 将生产者和消费者分离，降低系统间的耦合度。

3. **流量削峰填谷**  
   - 在高并发情况下，缓冲请求流量，保护核心服务。

4. **日志聚合**  
   - 集中收集和处理分布式系统的日志。

5. **事件驱动架构**  
   - 用于实现微服务间的事件通知。
