# 线程基础

## 简介

本文介绍 Java 线程的基础操作，包括线程的创建、生命周期管理、线程的终止、线程的调度、线程安全和线程池。

## 线程的创建

Java 提供了多种创建线程的方式，每种方式适用于不同的场景。

### 1. 继承 Thread 类

**场景描述**：
当需要创建一个简单的线程，且不需要返回结果时，可以使用继承 Thread 类的方式。

**实现步骤**：

1. 继承 Thread 类

2. 重写 run() 方法

3. 创建线程实例

4. 调用 start() 方法启动线程

**代码实现**：

```java
public class MyThread extends Thread {
    
    @Override
    public void run() {
        System.out.println("线程运行中...");
    }
    
    public static void main(String[] args) {
        // 创建线程对象
        MyThread thread = new MyThread();
        // 启动线程
        thread.start();
    }
}
```

**关键点说明**：

- 必须调用 start() 方法而不是 run() 方法

- 一个线程实例只能启动一次

- 不建议使用继承 Thread 类的方式，因为 Java 不支持多继承

### 2. 实现 Runnable 接口

**场景描述**：
当需要创建一个线程，且希望保持类的继承关系时，推荐使用实现 Runnable 接口的方式。

**实现步骤**：

1. 实现 Runnable 接口

2. 实现 run() 方法

3. 创建 Thread 实例，传入 Runnable 对象

4. 调用 start() 方法启动线程

**代码实现**：

```java
public class MyRunnable implements Runnable {
    
    @Override
    public void run() {
        System.out.println("线程运行中...");
    }
    
    public static void main(String[] args) {
        // 创建 Runnable 实现类对象
        MyRunnable myRunnable = new MyRunnable();
        // 创建线程对象，传入 Runnable 实例
        Thread thread = new Thread(myRunnable);
        // 启动线程
        thread.start();
        
        // 使用 Lambda 表达式简化
        Thread thread2 = new Thread(() -> {
            System.out.println("Lambda 表达式创建的线程");
        });
        thread2.start();
    }
}
```

**关键点说明**：

- 推荐使用实现 Runnable 接口的方式

- 可以使用 Lambda 表达式简化代码

- 更好的面向对象设计，符合组合优于继承的原则

### 3. 实现 Callable 接口

**场景描述**：
当需要线程执行完成后返回结果时，可以使用实现 Callable 接口的方式。

**实现步骤**：

1. 实现 Callable 接口

2. 实现 call() 方法

3. 创建 FutureTask 包装 Callable 对象

4. 创建 Thread 实例，传入 FutureTask

5. 调用 start() 方法启动线程

6. 使用 FutureTask.get() 获取结果

**代码实现**：

```java
import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

public class MyCallable implements Callable<Integer> {
    
    @Override
    public Integer call() throws Exception {
        // 执行耗时操作
        Thread.sleep(1000);
        return 123; // 返回计算结果
    }
    
    public static void main(String[] args) throws Exception {
        // 创建 Callable 实现类对象
        MyCallable myCallable = new MyCallable();
        // 创建 FutureTask 包装 Callable 对象
        FutureTask<Integer> futureTask = new FutureTask<>(myCallable);
        // 创建线程对象
        Thread thread = new Thread(futureTask);
        // 启动线程
        thread.start();
        
        // 获取线程执行结果（会阻塞等待线程完成）
        Integer result = futureTask.get();
        System.out.println("线程执行结果: " + result);
    }
}
```

**关键点说明**：

- 可以获取线程执行的结果

- 可以抛出异常

- 支持泛型，可以返回任意类型的结果

- get() 方法会阻塞等待线程执行完成

## 线程的生命周期

Java 线程在运行过程中可能处于以下状态：

| 状态            | 说明                                   |
|---------------|--------------------------------------|
| NEW           | 线程已创建但尚未启动                           |
| RUNNABLE      | 线程正在 JVM 中运行，但可能在等待操作系统资源（如 CPU 时间片） |
| BLOCKED       | 线程被阻塞，等待获取监视器锁                       |
| WAITING       | 线程进入无限期等待状态，等待被其他线程显式唤醒              |
| TIMED_WAITING | 线程进入计时等待状态，等待超时或被唤醒                  |
| TERMINATED    | 线程已执行完成或因异常而终止                       |

![线程生命周期](https://assets.culpro.cn/images/java-thread-lifecycle.svg)

### 线程状态转换方法

下面的方法可以触发线程状态的转换：

#### 1. 线程启动 - start()

```java
Thread thread = new Thread(() -> {
    // 线程执行代码
});
thread.start(); // NEW -> RUNNABLE
```

#### 2. 线程休眠 - sleep()

```java
try{
    // 线程休眠 1000 毫秒
    Thread.sleep(1000); // RUNNABLE -> TIMED_WAITING
}catch(InterruptedException e){
    // 处理中断
}
```

#### 3. 线程等待 - wait()

```java
synchronized (lockObject){
    try{
        lockObject.wait(); // RUNNABLE -> WAITING
        // 或设置超时
        lockObject.wait(1000); // RUNNABLE -> TIMED_WAITING
    }catch(InterruptedException e){
        // 处理中断
    }
}
```

#### 4. 线程通知 - notify()/notifyAll()

```java
synchronized (lockObject){
    lockObject.notify(); // 唤醒一个等待线程 WAITING -> RUNNABLE
    // 或
    lockObject.notifyAll(); // 唤醒所有等待线程 WAITING -> RUNNABLE
}
```

#### 5. 线程让步 - yield()

```java
Thread.yield(); // 提示调度器可以切换到其他线程，但不会释放资源
```

#### 6. 线程等待结束 - join()

```java
Thread anotherThread = new Thread(() -> {
    // 耗时操作
});
anotherThread.start();

try{
    anotherThread.join(); // 等待 anotherThread 执行完成
    // 或设置超时
    anotherThread.join(1000); // 最多等待 1000 毫秒
}catch(InterruptedException e){
    // 处理中断
}
```

### 线程的中断

线程中断是一种协作机制，用于请求线程停止当前工作：

```java
Thread thread = new Thread(() -> {
    while (!Thread.currentThread().isInterrupted()) {
        // 线程正常工作
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            // 响应中断
            Thread.currentThread().interrupt(); // 重设中断标志
            break;
        }
    }
});
thread.start();

// 请求中断线程
thread.interrupt();
```

**中断最佳实践**

- 线程应当定期检查中断状态，并做出适当响应

- 抛出 InterruptedException 的方法会清除中断状态，应当重新设置

- 避免忽略中断异常

- 提供干净的取消机制

## 线程的终止

Java 中终止线程有多种方式，每种方式都有其适用场景和注意事项。

### 1. 线程自然终止

当线程执行完 `run()` 方法中的所有代码后，线程会自然终止。这是最理想的线程终止方式。

```java
Thread thread = new Thread(() -> {
    // 执行任务
    System.out.println("任务执行完毕，线程将自然终止");
});
thread.start();
```

### 2. 使用中断机制

中断是一种协作式的线程终止方式，它通过设置线程的中断标志位，请求线程在合适的时候停止执行。

```java
Thread thread = new Thread(() -> {
    while (!Thread.currentThread().isInterrupted()) {
        // 执行任务
        try {
            // 可能被中断的阻塞操作
            Thread.sleep(100);
        } catch (InterruptedException e) {
            // 处理中断
            Thread.currentThread().interrupt(); // 重新设置中断标志
            break; // 退出循环
        }
        
        // 检查中断状态
        if (Thread.currentThread().isInterrupted()) {
            // 执行清理操作
            System.out.println("线程被中断，正在清理资源...");
            break;
        }
    }
});

thread.start();

// 在其他线程中请求中断
thread.interrupt();
```

### 3. 使用标志位控制

通过共享变量作为终止标志，控制线程的执行。

```java
public class ControlledThread extends Thread {
    private volatile boolean running = true;
    
    public void terminate() {
        running = false;
    }
    
    @Override
    public void run() {
        while (running) {
            // 执行任务
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                // 中断处理
            }
        }
        
        // 线程结束前的清理工作
        System.out.println("线程正常退出");
    }
    
    public static void main(String[] args) throws InterruptedException {
        ControlledThread thread = new ControlledThread();
        thread.start();
        
        // 主线程工作
        Thread.sleep(1000);
        
        // 请求线程终止
        thread.terminate();
    }
}
```

### 不推荐的线程终止方法

以下方法不推荐使用：

1. **`Thread.stop()`**：已废弃，强制终止线程，可能导致数据不一致

2. **`Thread.destroy()`**：未实现的方法

3. **`System.exit(int)`**：退出整个 JVM，影响所有线程

4. **使用标志位控制**：因为 run 方法里有阻塞调用时会无法很快检测到终止标志，线程必须从阻塞调用返回后，才会检查这个终止标志

### 线程终止的最佳实践

1. **使用中断机制**：优先使用标准的中断机制

2. **及时响应中断**：设计线程时应当定期检查中断状态

3. **清理资源**：确保线程终止前释放所有资源

4. **捕获并正确处理 InterruptedException**：不要忽略中断异常

5. **避免使用已废弃的方法**：不使用 `stop()`、`suspend()` 等已废弃方法

**线程终止示例（完整版）**

```java
public class ThreadTerminationExample {
    public static void main(String[] args) throws InterruptedException {
        // 创建资源
        Resource resource = new Resource();
        
        // 创建并启动线程
        Thread workerThread = new Thread(() -> {
            try {
                while (!Thread.currentThread().isInterrupted()) {
                    // 模拟工作
                    resource.doWork();
                    
                    // 主动检查中断状态
                    if (Thread.currentThread().isInterrupted()) {
                        System.out.println("检测到中断请求，准备退出");
                        break;
                    }
                }
            } catch (InterruptedException e) {
                // 捕获中断异常
                System.out.println("线程在阻塞操作中被中断");
            } finally {
                // 确保资源被释放
                resource.close();
                System.out.println("线程已释放所有资源");
            }
            
            System.out.println("线程正常终止");
        });
        
        // 启动线程
        workerThread.start();
        
        // 等待一段时间
        Thread.sleep(2000);
        
        // 请求中断线程
        System.out.println("主线程请求中断工作线程");
        workerThread.interrupt();
        
        // 等待工作线程结束
        workerThread.join();
        System.out.println("工作线程已终止，主线程继续执行");
    }
    
    // 模拟资源类
    static class Resource {
        public void doWork() throws InterruptedException {
            System.out.println("正在处理资源...");
            Thread.sleep(200); // 模拟耗时操作
        }
        
        public void close() {
            System.out.println("正在关闭资源...");
            // 关闭资源的逻辑
        }
    }
}
```

## 守护线程

守护线程（Daemon Thread）是在后台提供服务的线程，当所有非守护线程结束时，JVM 会退出，不管守护线程是否仍在运行：

```java
Thread daemon = new Thread(() -> {
    while (true) {
        // 后台任务，如监控、日志等
    }
});
daemon.setDaemon(true); // 设置为守护线程
daemon.start();
```

## 线程的优先级

Java 线程优先级是一个整数值，用于确定线程调度的顺序。线程优先级越高，获得 CPU 时间片的机会就越多。

### 优先级范围

Java 线程优先级的范围是 1 到 10 之间的整数：

- **最低优先级**：`Thread.MIN_PRIORITY`（1）

- **中等优先级**：`Thread.NORM_PRIORITY`（5，默认值）

- **最高优先级**：`Thread.MAX_PRIORITY`（10）

### 设置和获取优先级

```java
// 设置线程优先级
Thread thread = new Thread(() -> {
    // 线程执行代码
});
thread.setPriority(Thread.MAX_PRIORITY); // 设置为最高优先级

// 获取线程优先级
int priority = thread.getPriority(); // 返回线程的优先级
```

### 优先级特性

1. **继承性**：子线程继承父线程的优先级

2. **相对性**：优先级仅表示线程获得执行机会的相对概率，不保证高优先级线程一定先执行

3. **平台相关性**：线程优先级的效果在不同操作系统上表现可能不同

   - Windows 系统支持的优先级较少，会对 Java 优先级进行映射

   - Linux 系统默认情况下会忽略优先级设置

### 优先级使用建议

1. **不要依赖优先级**：程序逻辑不应依赖于线程优先级，仅将其视为性能优化的提示

2. **谨慎使用最高优先级**：过多最高优先级线程可能导致低优先级线程饥饿

3. **避免频繁调整**：不要在运行时频繁调整线程优先级

**示例代码**：

```java
public class PriorityExample {
    public static void main(String[] args) {
        Thread lowPriorityThread = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("低优先级线程: " + i);
                Thread.yield(); // 提示让出 CPU
            }
        });
        
        Thread highPriorityThread = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("高优先级线程: " + i);
                Thread.yield(); // 提示让出 CPU
            }
        });
        
        // 设置优先级
        lowPriorityThread.setPriority(Thread.MIN_PRIORITY);
        highPriorityThread.setPriority(Thread.MAX_PRIORITY);
        
        // 启动线程
        lowPriorityThread.start();
        highPriorityThread.start();
    }
}
```

## 线程的调度

线程调度是指操作系统按照特定的调度算法为线程分配处理器使用权的过程。

### Java 线程调度模型

Java 线程调度模型依赖于底层操作系统的线程实现，通常采用以下调度模型：

1. **抢占式调度**（Preemptive Scheduling）
   - JVM 的默认调度方式

   - 高优先级线程可以抢占低优先级线程的 CPU

   - 系统会在一个线程执行一段时间后自动中断，让其他线程有机会执行

2. **协作式调度**（Cooperative Scheduling）

   - 线程主动让出 CPU 控制权

   - 通过显式调用 `Thread.yield()`、`Object.wait()` 或 `Thread.sleep()` 等方法实现

### 线程状态与调度

线程在各种状态之间的转换与调度密切相关：

1. **就绪状态**（Runnable）

   - 等待被调度器选中获取 CPU 时间

   - 调度器基于优先级和其他因素选择就绪线程执行

2. **运行状态**（Running）

   - 获得 CPU 时间片正在执行

   - 时间片耗尽或主动让出 CPU 后回到就绪状态

   - 调用阻塞方法后进入阻塞状态

3. **阻塞状态**（Blocked/Waiting/Timed_Waiting）

   - 不参与调度，直到条件满足

### 影响线程调度的因素

1. **线程优先级**：高优先级线程获得 CPU 的概率更大

2. **线程状态**：只有就绪状态的线程才能被调度执行

3. **时间片大小**：操作系统分配给线程的执行时间

4. **调度策略**：不同操作系统的线程调度策略可能不同

### 调度相关的方法

```java
// 1. 让出 CPU，但不保证一定让出
Thread.yield();

// 2. 使当前线程进入计时等待状态
Thread.sleep(1000); // 睡眠 1 秒

// 3. 等待其他线程完成
thread.join(); // 等待指定线程结束

// 4. 等待通知
synchronized (lockObject) {
    lockObject.wait(); // 等待被 notify 唤醒
}

// 5. 唤醒等待的线程
synchronized (lockObject) {
    lockObject.notify(); // 唤醒一个等待线程
    lockObject.notifyAll(); // 唤醒所有等待线程
}
```

### 线程调度示例

以下示例展示了线程状态切换和调度过程：

```java
public class SchedulingExample {
    public static void main(String[] args) throws InterruptedException {
        Object lock = new Object();
        
        Thread thread1 = new Thread(() -> {
            System.out.println("线程 1 开始执行");
            
            synchronized (lock) {
                try {
                    System.out.println("线程 1 等待通知");
                    lock.wait();
                    System.out.println("线程 1 收到通知，继续执行");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            
            System.out.println("线程 1 执行完毕");
        });
        
        Thread thread2 = new Thread(() -> {
            System.out.println("线程 2 开始执行");
            
            try {
                Thread.sleep(2000); // 睡眠 2 秒
                System.out.println("线程 2 睡眠结束");
                
                synchronized (lock) {
                    System.out.println("线程 2 唤醒等待的线程");
                    lock.notifyAll();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            
            System.out.println("线程 2 执行完毕");
        });
        
        thread1.start();
        Thread.sleep(500); // 确保线程 1 先执行
        thread2.start();
        
        // 等待两个线程结束
        thread1.join();
        thread2.join();
        
        System.out.println("主线程执行完毕");
    }
}
```

### JVM 线程调度与操作系统关系

1. **绿色线程**：早期 JVM 实现的用户级线程，与操作系统线程无关

2. **原生线程**：现代 JVM 实现，Java 线程直接映射到操作系统线程

   - Windows：一对一模型

   - Linux：一对一模型（NPTL 实现）

   - macOS：一对一模型

线程调度主要由操作系统完成，JVM 通过本地方法与操作系统交互，实现线程管理。

## 线程池

### 创建线程池

Java 提供了多种预配置的线程池：

```java
// 固定线程数的线程池
ExecutorService fixedPool = Executors.newFixedThreadPool(10);

// 单线程执行器
ExecutorService singleThreadExecutor = Executors.newSingleThreadExecutor();

// 可缓存的线程池（按需创建线程）
ExecutorService cachedPool = Executors.newCachedThreadPool();

// 定时任务线程池
ScheduledExecutorService scheduledPool = Executors.newScheduledThreadPool(4);

// 自定义线程池
ThreadPoolExecutor customPool = new ThreadPoolExecutor(5, // 核心线程数
    10, // 最大线程数
    60L, // 空闲线程存活时间
    TimeUnit.SECONDS, // 时间单位
    new ArrayBlockingQueue<>(100), // 工作队列
    new ThreadPoolExecutor.CallerRunsPolicy() // 拒绝策略
);
```

### 提交任务

```java
// 提交 Runnable 任务
executor.execute(() ->{
    System.out.println("执行任务");
});

// 提交 Callable 任务
Future<String> future = executor.submit(() -> {
    return "任务结果";
});

// 获取任务结果
try{
    String result = future.get();
}catch(Exception e){
    // 处理异常
}
```

### 关闭线程池

```java
// 平滑关闭（等待所有任务完成）
executor.shutdown();

// 立即关闭（尝试中断正在执行的任务）
List<Runnable> unfinishedTasks = executor.shutdownNow();

// 等待关闭完成
boolean terminated = executor.awaitTermination(60, TimeUnit.SECONDS);
```

## 常见问题

### Q1：线程方法对锁的影响?

下表总结了各种线程方法对锁的影响：

| 方法 | 是否释放锁 | 说明 |
|------|------------|------|
| `yield()` | 否 | 线程让出 CPU 执行权，但依然持有锁对象 |
| `sleep()` | 否 | 线程进入休眠状态，但依然持有锁对象 |
| `wait()` | 是 | 释放当前线程持有的锁，进入等待队列<br>被唤醒后需重新竞争锁才能继续执行 |
| `notify()/notifyAll()` | 否 | 只是唤醒等待队列中的线程<br>只有同步代码块执行完毕后才会释放锁 |

> [!warning]注意
> `notify()/notifyAll()` 通常应放在同步代码块的最后一行。

### Q2：为什么 wait 和 notify 必须在同步块中调用？

Java API 强制要求：`wait()`、`notify()`、`notifyAll()` 必须在持有对象监视器（即同步块或同步方法）时调用，否则会抛出 `IllegalMonitorStateException` 异常。

这是所有多线程环境的通用要求，保证线程间协作的正确性。

#### 示例说明

假设有一个生产者线程和一个消费者线程：

- 生产者负责 `count++` 并 `notify()`

- 消费者负责 `wait()` 并 `count--`

##### 错误用法（未加同步块）

```java
// 生产者线程
count++;      // 操作共享变量
notify();     // 唤醒等待的消费者线程 - 抛出 IllegalMonitorStateException

// 消费者线程
while(count <= 0)
    wait();   // 等待生产者 - 抛出 IllegalMonitorStateException
count--;      // 操作共享变量
```

##### 正确用法（加同步块）

```java
// 生产者线程
synchronized(lock) {
    count++;           // 操作共享变量
    lock.notify();     // 安全地唤醒等待的消费者线程
}

// 消费者线程
synchronized(lock) {
    while(count <= 0)  // 使用 while 循环检查条件（避免虚假唤醒）
        lock.wait();   // 安全地等待生产者通知
    count--;           // 操作共享变量
}
```

#### 关键点总结

- `wait()`、`notify()` 必须在同步块/同步方法中调用，且要持有对应对象的锁

- 生产者和消费者的典型实现步骤：

  | 角色 | 步骤 |
  |------|------|
  | 生产者 | 1. 获取锁 → 2. 更新共享变量 → 3. 通知等待线程 → 4. 释放锁 |
  | 消费者 | 1. 获取锁 → 2. 检查条件并等待 → 3. 处理共享变量 → 4. 释放锁 |

这样才能保证线程安全和协作的正确性。

## 参考资料

- [Java Concurrency in Practice](https://jcip.net/)

- [Java 并发编程实战](https://book.douban.com/subject/10484692/)

- [Java 多线程编程核心技术](https://book.douban.com/subject/26555197/)

- [Java官方文档 - 并发](https://docs.oracle.com/javase/tutorial/essential/concurrency/)