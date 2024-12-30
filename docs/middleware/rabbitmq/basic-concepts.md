# 交换机与队列

## 什么是交换机（Exchange）

交换机是 RabbitMQ 中负责消息路由的核心组件。它接收来自生产者的消息，并根据路由规则将消息发送到一个或多个队列中。

## 交换机类型

- Direct Exchange（直连交换机）
- Topic Exchange（主题交换机）
- Fanout Exchange（扇出交换机）
- Headers Exchange（头交换机）

## 什么是队列（Queue）

队列是消息的存储容器，消费者从队列中获取消息。

## 绑定（Binding）

绑定是交换机和队列之间的关联关系，定义了消息的路由规则。

## 实践示例

```d2
direction: right
x -> y: hi {
  style.animated: true
}
```
