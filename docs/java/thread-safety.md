# Java 线程与进程 - 线程安全篇

## 简介
本文档介绍 Java 中的线程安全问题、Java 内存模型以及相关的解决方案。适合已经掌握 Java 线程基础知识的开发者阅读。

## 线程安全问题

### 原子性问题

**场景描述**：
当多个线程同时访问共享数据时，可能出现数据不一致的情况。例如，多个线程同时对同一个计数器进行自增操作。

**问题示例**：
```java
public class AtomicityExample {
    private static int count = 0;
    
    public static void main(String[] args) throws InterruptedException {
        Thread[] threads = new Thread[10];
        
        for (int i = 0; i < 10; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    count++; // 非原子操作，包含读取、修改、写入三步
                }
            });
            threads[i].start();
        }
        
        for (Thread thread : threads) {
            thread.join();
        }
        
        System.out.println("预期结果：10000");
        System.out.println("实际结果：" + count); // 可能小于 10000
    }
}
```

**解决方案**：
1. 使用原子类
```java
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicSolution {
    private static AtomicInteger count = new AtomicInteger(0);
    
    public static void main(String[] args) throws InterruptedException {
        Thread[] threads = new Thread[10];
        
        for (int i = 0; i < 10; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    count.incrementAndGet(); // 原子操作
                }
            });
            threads[i].start();
        }
        
        for (Thread thread : threads) {
            thread.join();
        }
        
        System.out.println("预期结果：10000");
        System.out.println("实际结果：" + count.get()); // 一定是 10000
    }
}
```

2. 使用 synchronized 关键字
```java
public class SynchronizedSolution {
    private static int count = 0;
    private static final Object lock = new Object();
    
    public static void main(String[] args) throws InterruptedException {
        Thread[] threads = new Thread[10];
        
        for (int i = 0; i < 10; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    synchronized (lock) {
                        count++;
                    }
                }
            });
            threads[i].start();
        }
        
        for (Thread thread : threads) {
            thread.join();
        }
        
        System.out.println("预期结果：10000");
        System.out.println("实际结果：" + count); // 一定是 10000
    }
}
```

### 可见性问题

**场景描述**：
当一个线程修改了共享变量的值，其他线程可能无法立即看到最新的值。这是由于 CPU 缓存和指令重排等原因导致的。

**问题示例**：
```java
public class VisibilityExample {
    private static boolean flag = false;
    
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            while (!flag) {
                // 执行循环，等待 flag 变为 true
                // 由于没有 volatile 修饰，可能永远看不到 main 线程修改的 flag 值
            }
            System.out.println("线程结束");
        });
        thread.start();
        
        Thread.sleep(1000);
        flag = true; // 主线程修改 flag
        System.out.println("已将 flag 设置为 true");
    }
}
```

**解决方案**：
1. 使用 volatile 关键字
```java
public class VolatileSolution {
    private static volatile boolean flag = false;
    
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            while (!flag) {
                // 空循环
            }
            System.out.println("线程结束");
        });
        thread.start();
        
        Thread.sleep(1000);
        flag = true; // 主线程修改 flag，其他线程立即可见
        System.out.println("已将 flag 设置为 true");
    }
}
```

2. 使用 synchronized 关键字
```java
public class SynchronizedSolution {
    private static boolean flag = false;
    private static final Object lock = new Object();
    
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            while (true) {
                synchronized (lock) {
                    if (flag) {
                        break;
                    }
                }
            }
            System.out.println("线程结束");
        });
        thread.start();
        
        Thread.sleep(1000);
        synchronized (lock) {
            flag = true;
        }
        System.out.println("已将 flag 设置为 true");
    }
}
```

### 有序性问题

**场景描述**：
JVM 为了优化性能，可能会对指令进行重排序，导致程序实际执行顺序与代码顺序不一致。

**问题示例**：
```java
public class OrderingExample {
    private static int a = 0, b = 0;
    private static int x = 0, y = 0;
    
    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> {
            a = 1; // 步骤 1
            x = b; // 步骤 2
        });
        
        Thread t2 = new Thread(() -> {
            b = 1; // 步骤 3
            y = a; // 步骤 4
        });
        
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        
        // 由于指令重排，可能出现 x=0, y=0 的情况
        System.out.println("x=" + x + ", y=" + y);
    }
}
```

**解决方案**：
1. 使用 volatile 关键字
2. 使用 synchronized 关键字
3. 使用 Lock 接口
4. 使用 final 关键字

## Java 内存模型

### 内存模型基本结构

```mermaid
graph TD
    subgraph "Java 内存模型"
    Main[主内存/堆]
    subgraph "线程 1"
    WM1[工作内存/线程栈]
    end
    subgraph "线程 2"
    WM2[工作内存/线程栈]
    end
    Main -- 复制 --> WM1
    Main -- 复制 --> WM2
    WM1 -- 更新 --> Main
    WM2 -- 更新 --> Main
    end
```

### 内存交互操作

JMM 定义了 8 种原子操作来完成主内存和工作内存的交互：

1. **lock（锁定）**：作用于主内存变量，把变量标识为一条线程独占
2. **unlock（解锁）**：作用于主内存变量，将锁定的变量释放
3. **read（读取）**：作用于主内存变量，把变量值传输到工作内存
4. **load（载入）**：作用于工作内存变量，把 read 操作从主内存得到的值放入工作内存
5. **use（使用）**：作用于工作内存变量，把工作内存中的值传递给执行引擎
6. **assign（赋值）**：作用于工作内存变量，把执行引擎的值赋给工作内存变量
7. **store（存储）**：作用于工作内存变量，把变量值传送到主内存
8. **write（写入）**：作用于主内存变量，把 store 操作从工作内存得到的值放入主内存

### JMM 三大特性

1. **原子性**：一个操作不可中断，要么全部执行，要么全部不执行
   - synchronized 和 Lock 提供的原子性保证
   - CAS 操作和原子类

2. **可见性**：当一个线程修改了共享变量的值，其他线程能够立即得知这个修改
   - volatile 关键字
   - synchronized 和 Lock
   - final 关键字（一旦初始化完成，其他线程就能看到正确值）

3. **有序性**：程序执行的顺序按照代码的先后顺序执行
   - volatile 禁止重排序
   - synchronized 和 Lock 保证同一时刻只有一个线程执行同步代码，相当于是单线程，不存在重排序问题

### happens-before 规则

happens-before 是 JMM 的核心概念，它定义了操作之间的内存可见性。如果一个操作 happens-before 另一个操作，那么第一个操作的结果对第二个操作可见。

Java 中的 happens-before 规则包括：

1. **程序顺序规则**：一个线程内，按照代码顺序，前面的操作 happens-before 后面的操作
2. **监视器锁规则**：对一个锁的解锁 happens-before 随后对这个锁的加锁
3. **volatile 变量规则**：对一个 volatile 变量的写操作 happens-before 后面对这个变量的读操作
4. **线程启动规则**：Thread.start() 方法 happens-before 该线程的任何动作
5. **线程终止规则**：线程中的所有操作 happens-before 其他线程检测到该线程已经终止
6. **线程中断规则**：调用一个线程的 interrupt() 方法 happens-before 被中断线程检测到中断事件的发生
7. **对象终结规则**：一个对象的初始化完成 happens-before 它的 finalize() 方法开始
8. **传递性**：如果 A happens-before B，且 B happens-before C，那么 A happens-before C

## 最佳实践

1. **使用原子类**
   - 对于简单的原子操作，优先使用原子类
   - 原子类提供了比 synchronized 更轻量级的同步机制
   - 原子类支持 CAS 操作，性能更好

2. **合理使用 volatile**
   - 用于保证变量的可见性
   - 用于禁止指令重排序
   - 不保证原子性，不能替代 synchronized

3. **正确使用 synchronized**
   - 尽量减小同步代码块的范围
   - 避免在同步代码块中执行耗时操作
   - 注意锁的粒度，避免死锁

4. **使用线程安全集合**
   - 优先使用 ConcurrentHashMap 等线程安全集合
   - 避免使用 Collections.synchronizedXXX() 包装的集合
   - 注意集合的原子性操作

## 常见问题

1. **Q: volatile 和 synchronized 的区别是什么？**
   A: volatile 保证可见性和有序性，不保证原子性；synchronized 保证原子性、可见性和有序性。

2. **Q: 什么是 CAS 操作？**
   A: CAS（Compare And Swap）是一种无锁算法，通过比较内存中的值和期望值，如果相同则更新，否则不更新。

3. **Q: 如何避免死锁？**
   A: 1. 避免嵌套锁；2. 按固定顺序获取锁；3. 使用 tryLock() 设置超时时间；4. 使用死锁检测工具。

## 参考资料
1. 《Java 并发编程实战》
2. 《深入理解 Java 虚拟机》
3. [Oracle 官方文档 - Java Memory Model](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html#jls-17.4)
4. [Java 并发编程网](http://ifeve.com/) 