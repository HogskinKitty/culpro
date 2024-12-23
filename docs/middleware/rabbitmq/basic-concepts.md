# RabbitMQ 基础概念

## 什么是消息队列？

消息队列（Message Queue）是一种异步通信的中间件技术，用于在分布式系统中传递消息。

## AMQP 协议

AMQP（Advanced Message Queuing Protocol）是一个提供统一消息服务的应用层标准协议。

## RabbitMQ 的架构

RabbitMQ 的核心架构如下图所示：

```mermaid
flowchart LR
    subgraph Producer[生产者]
        direction LR
        P1((应用A))
        P2((应用B))
        P3((应用C))
    end

    subgraph RabbitMQ[RabbitMQ Broker]
        direction LR
        subgraph Exchange[交换机]
            direction LR
            E1[/Direct/]
            E2[/Fanout/]
            E3[/Topic/]
            E4[/Headers/]
        end

        subgraph Queues[队列]
            direction LR
            Q1[(Queue 1)]
            Q2[(Queue 2)]
            Q3[(Queue 3)]
        end
    end

    subgraph Consumer[消费者]
        direction LR
        C1((消费者1))
        C2((消费者2))
        C3((消费者3))
    end

    %% 连接关系
    P1 -.-> |发送消息| E1
    P2 -.-> |发送消息| E2
    P3 -.-> |发送消息| E3
    
    E1 -.-> |路由| Q1
    E2 -.-> |广播| Q1
    E2 -.-> |广播| Q2
    E3 -.-> |模式匹配| Q2
    E3 -.-> |模式匹配| Q3
    
    Q1 -.-> |消费| C1
    Q2 -.-> |消费| C2
    Q3 -.-> |消费| C3

    %% 样式定义
    classDef producer fill:#ff7875,stroke:#cf1322,stroke-width:2px,color:#fff,rx:10
    classDef exchange fill:#85a5ff,stroke:#1d39c4,stroke-width:2px,color:#fff,rx:5
    classDef queue fill:#95de64,stroke:#389e0d,stroke-width:2px,color:#fff,rx:5
    classDef consumer fill:#b37feb,stroke:#531dab,stroke-width:2px,color:#fff,rx:10
    classDef group fill:transparent,stroke:#666,stroke-width:2px,stroke-dasharray:5 5,rx:15,ry:15

    %% 应用样式
    class P1,P2,P3 producer;
    class E1,E2,E3,E4 exchange;
    class Q1,Q2,Q3 queue;
    class C1,C2,C3 consumer;
    class Producer,RabbitMQ,Exchange,Queues,Consumer group;

    %% 标题样式
    style Producer fill:#fff1f0,stroke:#666,color:#ff4d4f,rx:15,ry:15
    style Consumer fill:#f9f0ff,stroke:#666,color:#9254de,rx:15,ry:15
    style RabbitMQ fill:#f0f5ff,stroke:#666,color:#1890ff,rx:15,ry:15
    style Exchange fill:#f0f5ff,stroke:#666,color:#2f54eb,rx:15,ry:15
    style Queues fill:#f6ffed,stroke:#666,color:#52c41a,rx:15,ry:15
```

## RabbitMQ 核心概念

### 1. Producer（生产者）

生产者是发送消息的应用程序。在图中，我们展示了三个生产者应用（A、B、C），它们分别向不同类型的交换机发送消息。

### 2. Consumer（消费者）

消费者是接收消息的应用程序。图中的三个消费者分别从不同的队列中获取消息。

### 3. Exchange（交换机）

交换机负责接收生产者发送的消息，并根据路由规则将消息路由到一个或多个队列。图中展示了四种类型的交换机：
- Direct：根据精确的路由键匹配
- Fanout：广播到所有绑定的队列
- Topic：根据模式匹配的路由键分发
- Headers：根据消息属性进行匹配

### 4. Queue（队列）

队列是消息的存储载体，消息最终将会被投递到队列中，等待消费者取走。图中展示了三个队列，它们与不同的交换机建立了绑定关系。

### 5. Binding（绑定）

绑定是交换机和队列之间的关联关系。图中通过不同类型的连接线展示了绑定关系：
- Direct 交换机通过路由键与队列绑定
- Fanout 交换机广播消息到所有绑定的队列
- Topic 交换机通过模式匹配将消息路由到相应队列

### 6. Routing Key（路由键）

路由键是消息的路由规则，用于指定消息的路由到哪个队列。不同类型的交换机使用路由键的方式也不同。

### 7. Channel（信道）

Channel 是建立在 Connection 上的虚拟连接，是进行消息读写的通道。它可以复用 TCP 连接，提高网络利用率。

### 8. Virtual Host（虚拟主机）

Virtual Host 提供了逻辑隔离，最简单可以理解为命名空间。它允许在一个 RabbitMQ 服务器上创建多个隔离的消息服务环境。
