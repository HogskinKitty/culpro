# RabbitMQ 交换机与队列

RabbitMQ 的 **交换机（Exchange）** 和 **队列（Queue）** 是消息传递的核心组件。交换机负责路由消息，队列负责存储消息。以下是它们的详细说明。

## 交换机

交换机接收生产者发送的消息，并根据路由规则将消息分发到队列。

### 1. **直连交换机（Direct Exchange）**

- **功能**：根据 **路由键（Routing Key）** 精确匹配队列。
- **场景**：点对点消息传递，如任务分发。

```d2
:::config
layout: TALA
:::

direction: right

Producer: {
  style: {
    fill: "#2563EB"
  }
}
Exchange: {
  shape: diamond
  style: {
    fill: "#4B89DC"
  }
  label: "Direct\nExchange"
}
Queue1: {
  shape: queue
  style: {
    fill: "orange"
  }
}
Queue2: {
  shape: queue
  style: {
    fill: "#37BC9B"
  }
}

Consumer1: {
  style: {
    fill: "#7C3AED"
  }
}

Consumer2: {
  style: {
    fill: "#7C3AED"
  }
}

Producer -> Exchange: 消息 {
  style: {
    stroke-width: 2
    animated: true
  }
}
Exchange -> Queue1: orange {
  style: {
    stroke-width: 2
    animated: true
  }
}
Exchange .-> Queue2: green {
  style: {
    stroke-width: 2
    animated: true
  }
}

Queue1 -> Consumer1{
  style: {
    stroke-width: 2
    animated: true
  }
}

Queue2 -> Consumer2 {
  style: {
    stroke-width: 2
    animated: true
  }
}

*.style.border-radius: 10
```

### 2. **扇形交换机（Fanout Exchange）**

- **功能**：将消息广播到所有绑定的队列，忽略路由键。
- **场景**：广播消息，如日志收集。

```d2
:::config
layout: TALA
:::

direction: right

Producer: {
  style: {
    fill: "#2563EB"
  }
}
Exchange: {
  shape: diamond
  style: {
    fill: "#4B89DC"
  }
  label: "Fanout\nExchange"
}
Queue1: {
  shape: queue
  style: {
    fill: "#37BC9B"
  }
}
Queue2: {
  shape: queue
  style: {
    fill: "#37BC9B"
  }
}
Queue3: {
  shape: queue
  style: {
    fill: "#37BC9B"
  }
}

Consumer1: {
  style: {
    fill: "#7C3AED"
  }
}

Consumer2: {
  style: {
    fill: "#7C3AED"
  }
}

Consumer3: {
  style: {
    fill: "#7C3AED"
  }
}

Producer -> Exchange: 消息 {
  style: {
    stroke-width: 2
    animated: true
  }
}
Exchange -> Queue1: binding {
  style: {
    stroke-width: 2
    animated: true
  }
}
Exchange -> Queue2: binding {
  style: {
    stroke-width: 2
    animated: true
  }
}
Exchange -> Queue3: binding {
  style: {
    stroke-width: 2
    animated: true
  }
}

Queue1 -> Consumer1 {
  style: {
    stroke-width: 2
    animated: true
  }
}

Queue2 -> Consumer2 {
  style: {
    stroke-width: 2
    animated: true
  }
}

Queue3 -> Consumer3 {
  style: {
    stroke-width: 2
    animated: true
  }
}

*.style.border-radius: 10
```

### 3. **主题交换机（Topic Exchange）**

- **功能**：根据路由键的模式匹配队列，支持通配符。
  - `*` 匹配一个单词。
  - `#` 匹配零个或多个单词。

- **场景**：灵活的路由规则，如事件通知。

```d2
:::config
layout: TALA
:::

direction: right

Producer: {
  style: {
    fill: "#2563EB"
  }
}
Exchange: {
  shape: diamond
  style: {
    fill: "#4B89DC"
  }
  label: "Topic\nExchange"
}
Queue1: {
  shape: queue
  style: {
    fill: "red"
  }
}
Queue2: {
  shape: queue
  style: {
    fill: "yellow"
  }
}

Queue3: {
  shape: queue
  style: {
    fill: "#37BC9B"
  }
}

Consumer1: {
  style: {
    fill: "#7C3AED"
  }
}

Consumer2: {
  style: {
    fill: "#7C3AED"
  }
}

Consumer3: {
  style: {
    fill: "#7C3AED"
  }
}

Producer -> Exchange: 消息 {
  style: {
    stroke-width: 2
    animated: true
  }
}
Exchange -> Queue1: *.a.* {
  style: {
    stroke-width: 2
    animated: true
  }
}
Exchange -> Queue2: *.*.b {
  style: {
    stroke-width: 2
    animated: true
  }
}

Exchange -> Queue3: c.\# {
  style: {
    stroke-width: 2
    animated: true
  }
}

Queue1 -> Consumer1 {
  style: {
    stroke-width: 2
    animated: true
  }
}

Queue2 -> Consumer2 {
  style: {
    stroke-width: 2
    animated: true
  }
}

Queue3 -> Consumer3 {
  style: {
    stroke-width: 2
    animated: true
  }
}

*.style.border-radius: 10
```

### 4. **头交换机（Headers Exchange）**

- **功能**：根据消息头属性匹配队列，忽略路由键。
- **场景**：基于消息属性的复杂路由。
- **属性**：`x-match`，支持的 2 种取值：
  - `all`: 默认 headers 中的键值对和消息的键值对完全匹配，才可以实现转发
  - `any`: 只需要匹配任意一个，就可以实现消息的转发

```d2
:::config
layout: TALA
:::

direction: right

Producer: {
  style: {
    fill: "#2563EB"
  }
}
Exchange: {
  shape: diamond
  style: {
    fill: "#4B89DC"
  }
  label: "Headers\nExchange"
}
Queue1: {
  shape: queue
  style: {
    fill: "#37BC9B"
  }
  label: "Queue\n(type=error)"
}
Queue2: {
  shape: queue
  style: {
    fill: "#37BC9B"
  }
  label: "Queue\n(type=info)"
}

Consumer1: {
  style: {
    fill: "#7C3AED"
  }
}

Consumer2: {
  style: {
    fill: "#7C3AED"
  }
}

Producer -> Exchange: "消息" {
  style: {
    stroke-width: 2
    animated: true
  }
}
Exchange -> Queue1: 匹配 {
  style: {
    stroke-width: 2
    animated: true
  }
}
Exchange .-> Queue2: 不匹配 {
  style: {
    stroke-width: 2
    animated: true
  }
}

Queue1 -> Consumer1 {
  style: {
    stroke-width: 2
    animated: true
  }
}

Queue2 -> Consumer2 {
  style: {
    stroke-width: 2
    animated: true
  }
}

*.style.border-radius: 10
```

## 队列

队列用于存储消息，消费者从队列中获取消息进行处理。

## 绑定

队列通过 **绑定（Binding）** 与交换机关联，定义消息如何从交换机路由到队列。

- **绑定键**：用于匹配消息的路由键。
- **绑定参数**：额外配置，如头交换机的匹配条件。

## 常见问题

1. **消息未被路由到队列**：
    - 检查交换机和队列的绑定关系。
    - 确保路由键与绑定键匹配。

2. **队列消息堆积**：
    - 检查消费者是否正常运行。
    - 调整队列的 TTL 或死信队列配置。

3. **交换机或队列未持久化**：
    - 确保交换机和队列的 `durable` 属性设置为 `true`，以防止 RabbitMQ 重启后丢失。

4. **消息丢失问题**：
    - 生产者确认机制（Publisher Confirms）
    - 消费者确认机制（Consumer Acknowledgements）
    - 持久化配置（交换机、队列、消息都需要持久化）
