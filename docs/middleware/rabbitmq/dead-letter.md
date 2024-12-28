# 死信队列

## 基础概念

- 什么是死信队列
- 死信交换机
- 死信的产生原因

## 死信场景

- 消息被拒绝（reject/nack）
- 消息过期（TTL）
- 队列达到最大长度

## 配置实现

### 1. 死信交换机配置

- 创建死信交换机
- 绑定死信队列
- 参数设置

### 2. 消息转发机制

- 转发流程
- 属性传递
- 处理策略

## 应用场景

- 延迟重试
- 消息失败处理
- 业务降级处理

## 最佳实践

- 监控和告警
- 处理策略
- 避免死循环