# 线程与进程

## 简介

本文介绍进程与线程的基本概念以及它们之间的关系和区别，不同操作系统对线程的实现方式以及 Java 线程模型的特点，上下文切换、并发与并行。

## 进程

存储在硬盘的静态文件（源代码），通过编译后生成二进制可执行文件，当运行这个可执行文件后，它会被加载到内存中，接着 CPU 会执行程序中的每一条指令，即运行中的程序，就被称为进程（Process）。

```d2
direction: right

硬盘 {
  源代码: 源代码文件
}

二进制文件: 可执行文件

内存 {
  进程: 运行中的程序
}

CPU

# 流程
硬盘.源代码 -> 二进制文件: 1.编译:{
  style.stroke-dash: 3
  style.animated: true
}

二进制文件 -> 内存.进程: 2.加载:{
  style.stroke-dash: 3
  style.animated: true
}

内存.进程 -> CPU: 3.执行:{
  style.stroke-dash: 3
  style.animated: true
}
```

## 线程

线程（Thread）是进程内的执行单元，是 CPU 调度的基本单位。每个进程至少包含一个线程（主线程），也可以创建多个线程来执行不同的任务。

## 进程与线程区别

| 特性 | 进程 | 线程 |
|------|------|------|
| 定义 | 运行中的程序的实例，是系统进行资源分配和调度的基本单位 | 进程中的执行单元，是 CPU 调度的基本单位 |
| 资源占用 | 拥有独立的内存空间、文件描述符等系统资源 | 共享所属进程的内存空间和资源 |
| 通信方式 | 进程间通信（IPC）：管道、消息队列、共享内存、信号量、套接字等 | 线程间可直接通过共享变量通信 |
| 切换开销 | 切换开销大，涉及到虚拟内存、页表等切换 | 切换开销小，只需保存和恢复少量寄存器内容 |
| 创建销毁开销 | 创建和销毁开销大 | 创建和销毁开销小 |
| 并发性 | 多进程并发 | 多线程并发 |
| 健壮性 | 一个进程崩溃不会影响其他进程 | 一个线程崩溃会导致整个进程崩溃 |

```d2
direction: down

# 定义节点
OS: 操作系统
P1: 进程1
P2: 进程2
T1: 线程1-1
T2: 线程1-2
T3: 线程2-1

# 定义连接
OS -> P1
OS -> P2
P1 -> T1
P1 -> T2
P2 -> T3
```

## 线程实现

不同操作系统对线程的实现方式有所不同，主要可以分为三种实现模型：用户级线程模型、内核级线程模型和混合线程模型。

### 1. 用户级线程模型（User-Level Threads）

用户级线程是完全建立在用户空间的线程库上，系统内核不能感知用户级线程的存在。

**特点：**

1. 线程管理在用户空间完成，不需要内核支持

2. 线程切换无需切换到内核态，开销小

3. 可以实现特定的调度算法

4. 可以支持大规模的线程数量

**缺点：**

1. 一个阻塞型系统调用会导致整个进程阻塞

2. 无法利用多处理器的并行能力

```d2
direction: down

# 定义节点
os: 操作系统
process: 进程 {
  uthread1: 用户线程1
  uthread2: 用户线程2
  uthread3: 用户线程3
  thread_lib: 线程库
}

# 定义关系
os -> process: 感知进程
process.thread_lib -> process.uthread1: 管理
process.thread_lib -> process.uthread2: 管理
process.thread_lib -> process.uthread3: 管理
```

### 2. 内核级线程模型（Kernel-Level Threads）

内核级线程（KLT）是由操作系统内核支持的线程，系统内核负责线程的创建、调度和管理。

**特点：**

1. 内核直接支持和管理线程

2. 一个线程阻塞不会导致整个进程阻塞

3. 可以充分利用多处理器的并行能力

**缺点：**

1. 线程创建和切换的开销较大

2. 线程数量受系统资源限制

```d2
direction: down

# 定义节点
os: 操作系统内核 {
  kthread1: 内核线程1
  kthread2: 内核线程2
  kthread3: 内核线程3
}
process: 进程 {
  uthread1: 用户线程1
  uthread2: 用户线程2
  uthread3: 用户线程3
}

# 定义关系
os.kthread1 -> process.uthread1: 1:1映射
os.kthread2 -> process.uthread2: 1:1映射
os.kthread3 -> process.uthread3: 1:1映射
```

### 3. 混合线程模型（Hybrid Threading Model）

混合模型结合了用户级线程和内核级线程的优点，实现了多对多的线程映射关系。

**特点：**

1. 结合了用户级和内核级线程的优点

2. 可以同时支持大量线程和多处理器并行

3. 灵活性更高

**实现方式：**

1. **多对一模型（M:1）**：多个用户线程映射到一个内核线程，即上述的用户级线程模型

2. **一对一模型（1:1）**：每个用户线程映射到一个内核线程，即上述的内核级线程模型

3. **多对多模型（M:N）**：M 个用户线程映射到 N 个内核线程，综合了前两种模型的优点

```d2
direction: down

# 定义节点
os: 操作系统内核 {
  kthread1: 内核线程1
  kthread2: 内核线程2
}
process: 进程 {
  uthread1: 用户线程1
  uthread2: 用户线程2
  uthread3: 用户线程3
  uthread4: 用户线程4
  thread_lib: 线程库
}

# 定义关系
process.thread_lib -> process.uthread1: 管理
process.thread_lib -> process.uthread2: 管理
process.thread_lib -> process.uthread3: 管理
process.thread_lib -> process.uthread4: 管理

os.kthread1 -> process.uthread1: 调度执行
os.kthread1 -> process.uthread2: 调度执行
os.kthread2 -> process.uthread3: 调度执行
os.kthread2 -> process.uthread4: 调度执行
```

不同编程语言对线程的实现采用了不同的模型：

| 语言/平台 | 线程模型 | 特点 |
|----------|---------|------|
| Java (传统线程) | 1:1 模型 | 每个 Java 线程映射到一个操作系统线程，重量级 |
| Java (Virtual Threads, Java 21+) | M:N 模型 | 大量虚拟线程映射到少量操作系统线程，轻量级 |
| Go (goroutine) | M:N 模型 | 轻量级协程，可以创建数十万个 |
| Python (CPython) | 用户级线程 | 受全局解释器锁 (GIL) 限制，无法真正并行 |
| Node.js | 事件循环 + 线程池 | 主线程处理事件循环，线程池处理阻塞操作 |
| C/C++ (POSIX threads) | 1:1 模型 | 直接映射到操作系统线程 |

## Java 线程模型

Java 采用基于操作系统原生线程的一对一线程模型，具有以下特点：

1. **Java 线程与操作系统线程直接映射**：每个 Java 线程对应一个操作系统线程

2. **线程调度依赖操作系统**：线程的调度由操作系统完成，JVM 不负责线程调度

3. **线程优先级映射**：Java 线程的优先级会映射到操作系统线程的优先级，但具体映射关系依赖于操作系统

4. **轻量级进程（LWP）**：在某些系统上，Java 线程实际上是基于轻量级进程实现的

```d2
direction: down

# 定义节点
JVM: Java 虚拟机
JT1: Java 线程 1
JT2: Java 线程 2
NT1: 操作系统线程 1
NT2: 操作系统线程 2

# 定义连接
JVM -> JT1
JVM -> JT2
JT1 -> NT1
JT2 -> NT2
```

> [!warning]注意
> 与 Go 语言的协程（goroutine）不同，Java 的线程是重量级资源，创建和销毁成本较高。Java 21 引入的虚拟线程是对此问题的解决方案。

## 上下文切换

上下文切换（Context Switch）是指 CPU 从一个线程或进程切换到另一个线程或进程的过程。在这个过程中，需要保存当前线程的状态（上下文），并加载另一个线程的状态。

### 什么是线程上下文

线程上下文包括：

1. **寄存器状态**：包括程序计数器（PC）、堆栈指针等

2. **线程特有数据**：如在 Java 中的 ThreadLocal 变量

3. **内存映射信息**：线程当前访问的内存区域

4. **资源句柄**：线程打开的文件描述符等

5. **调度信息**：优先级、状态等

### 上下文切换的过程

一次完整的上下文切换主要包括以下步骤：

1. **保存当前线程上下文**：将当前线程的寄存器值、程序计数器等保存到内存中

2. **选择下一个要运行的线程**：调度器根据调度算法选择下一个线程

3. **恢复下一个线程的上下文**：从内存中加载目标线程的寄存器值、程序计数器等

4. **切换到新线程执行**：CPU 开始执行新线程的指令

```d2
direction: right

# 定义节点
thread1: 线程 A (运行中)
context_save: 保存上下文
scheduler: 调度器选择新线程
context_load: 加载上下文
thread2: 线程 B (运行中)

# 定义关系
thread1 -> context_save: 1.保存状态
context_save -> scheduler: 2.进入调度
scheduler -> context_load: 3.选择线程B
context_load -> thread2: 4.恢复状态
```

## 并发与并行

并发和并行是多线程编程中两个核心概念，二者有本质区别，理解这些差异有助于设计高效的多线程应用。

### 并发（Concurrency）

并发是指在同一时间段内，多个任务交替执行。从宏观上看，这些任务似乎是同时进行的，但从微观上看，在单核处理器上，任意时刻只有一个任务在执行。

**特点**：

- 多个任务交替执行，轮流使用 CPU

- 适用于 I/O 密集型任务

- 通过时间片轮转实现

- 目标是提高资源利用率和响应性

```d2
:::config
layout: DAGRE
:::

direction: right

concurrency: 并发{
  cpu: {
    shape: rectangle
    label: "单 CPU 核心"
    width: 100
    height: 40
  }

  # 任务状态表示
  t1a: {
    shape: rectangle
    label: "任务 1"
    width: 100
    height: 40
  }
  t2a: {
    shape: rectangle
    label: "任务 2"
    width: 100
    height: 40
  }
  t1b: {
    shape: rectangle
    label: "任务 1"
    width: 100
    height: 40
  }
  t2b: {
    shape: rectangle
    label: "任务 2"
    width: 100
    height: 40
  }
  t1c: {
    shape: rectangle
    label: "任务 1"
    width: 100
    height: 40
  }

  time: {
    shape: text
    label: "时间轴"
  }

  t1a -> t2a -> t1b -> t2b -> t1c: {
    style.stroke-dash: 3
    style.animated: true
  }
}
```

### 并行（Parallelism）

并行是指在同一时刻，多个任务真正同时执行。这要求系统具有多核处理器或多处理器架构，每个核心同时处理不同的任务。

**特点**：

- 多个任务同时执行

- 需要多核/多处理器环境

- 适用于计算密集型任务

- 目标是提高吞吐量和计算速度

```d2
:::config
layout: DAGRE
:::

direction: right

parallelism: 并行{
  cpu1: {
    shape: rectangle
    label: "CPU 核心 1"
    width: 100
    height: 40
  }

  cpu2: {
    shape: rectangle
    label: "CPU 核心 2"
    width: 100
    height: 40
  }

  cpu3: {
    shape: rectangle
    label: "CPU 核心 3"
    width: 100
    height: 40
  }

  cpu4: {
    shape: rectangle
    label: "CPU 核心 4"
    width: 100
    height: 40
  }

  # 任务表示
  t1: {
    shape: rectangle
    label: "任务 1"
    width: 100
    height: 40
  }
  
  t2: {
    shape: rectangle
    label: "任务 2"
    width: 100
    height: 40
  }

  t3: {
    shape: rectangle
    label: "任务 3"
    width: 100
    height: 40
  }

  t4: {
    shape: rectangle
    label: "任务 4"
    width: 100
    height: 40
  }

  # 连接 CPU 核心和任务
  cpu1 -> t1:{
    style.stroke-dash: 3
    style.animated: true
  }
  cpu2 -> t2:{
    style.stroke-dash: 3
    style.animated: true
  }

  cpu3 -> t3:{
    style.stroke-dash: 3
    style.animated: true
  }

  cpu4 -> t4:{
    style.stroke-dash: 3
    style.animated: true
  }

  time: {
    shape: text
    label: "时间轴"
  }
}
```

### 并发与并行的比较

下表详细比较了并发和并行的主要特性：

| 特性 | 并发 | 并行 |
|------|------|------|
| 定义 | 多个任务交替执行 | 多个任务同时执行 |
| 执行方式 | 时间片轮转 | 真正的同时执行 |
| 硬件要求 | 单核即可 | 需要多核/多处理器 |
| 资源竞争 | 存在竞争，需要同步 | 各自独立执行，潜在竞争少 |
| 复杂度 | 通常更复杂（需处理竞态条件） | 相对简单（数据隔离时） |
| 适用场景 | I/O 密集型、交互型应用 | 计算密集型、数据处理 |
| 设计重点 | 资源共享和同步 | 任务分解和负载均衡 |
| 可扩展性 | 受单核性能限制 | 可随核心数增加而线性扩展 |

## 参考资料

- [Java 虚拟机规范](https://docs.oracle.com/javase/specs/jvms/se17/html/index.html)

- [Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/)

- [深入理解 Java 虚拟机（第 3 版）](https://book.douban.com/subject/34907497/)

- [操作系统概念（第 10 版）](https://www.os-book.com/OS10/)

- [Linux 性能优化实战](https://book.douban.com/subject/30416462/)

- [Java 并发编程实战](https://book.douban.com/subject/10484692/)

- [Java Concurrency in Practice](https://jcip.net/)

- [Seven Concurrency Models in Seven Weeks](https://pragprog.com/titles/pb7con/seven-concurrency-models-in-seven-weeks/)
