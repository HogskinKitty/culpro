# 深入理解 AQS 独占锁之 ReentrantLock 源码分析

## 简介

AbstractQueuedSynchronizer（简称 AQS）是 Java 并发包中最核心的基础组件，它为实现锁和同步器提供了一种框架，许多同步类如 ReentrantLock、Semaphore、CountDownLatch 等都是基于 AQS 实现的。本文将深入剖析 AQS 的独占锁实现原理，并以 ReentrantLock 为例详细分析其源码实现，深入理解 Java 高级并发控制的底层机制。

## 基本概念

### 什么是管程

管程指的是管理共享变量以及对共享变量的操作过程，让其支持并发。

管程的基本特性：
1. **互斥性**：任一时刻最多只有一个线程能够执行管程中的操作过程
2. **同步性**：通过条件变量和等待/通知机制实现线程间的同步
3. **封装性**：共享资源和对其操作的过程封装在管程内部

管程有多种实现模型，包括 Hoare 模型、Hansen 模型和 MESA 模型，Java 中采用的是 MESA 模型。

### MESA 模型

MESA 模型是 Java 并发实现采用的一种管程模型，由 Xerox PARC 在 20 世纪 80 年代开发。相比于 Hoare 模型和 Hansen 模型，MESA 模型具有更高的并发效率和实用性。

在并发编程领域，有两大核心问题：

- 一个是互斥，即同一时刻只允许一个线程访问共享资源
- 一个是同步，即线程之间如何通信、协作。

**管程解决互斥问题**

管程通过封装共享变量及其操作来解决互斥问题。以线程安全的阻塞队列为例，只需将非线程安全的队列及其操作方法（如入队、出队）封装起来，确保同一时刻只有一个线程能访问这些方法。

![MESA模型原理图](https://assets.culpro.cn/images/monitor-mesa-mutual-exclusion.svg)

管程 X 将共享变量 queue 以及线程不安全的队列和相关的操作，入队操作 enq()、出队操作 deq() 都封装起来；线程A和线程B如果想访问共享变量 queue，只能通过调用管程提供的 enq()、deq() 方法来实现；enq()、deq() 保证互斥性，只允许一个线程进入管程。

**管程解决同步问题**

通过条件变量和条件变量等待队列解决线程同步问题。

**MESA 管程模型的核心组件**

1. **入口等待队列**：想要进入管程的线程会在此排队
2. **条件变量等待队列**：调用 wait() 的线程会进入对应条件变量的等待队列
3. **共享变量**：被多个线程共享的数据
4. **条件变量**：用于线程间的通信和协作
5. **方法**：对共享变量的操作

![MESA模型原理图](https://assets.culpro.cn/images/monitor-mesa-model.svg)

**MESA 管程模型的工作流程**（<span style="color:red">**重点理解**</span>）

1. 线程要进入管程，首先要获取管程的互斥锁（AQS 中是使用 CAS + volatile + 自旋来实现）
2. 如果互斥锁被其他线程持有，则当前线程进入入口等待队列
3. 线程获取锁后，可以访问共享变量并执行管程中的代码
4. 如果线程需要等待某个条件（即条件变量不满足），调用条件变量的 wait() 方法
5. 调用 wait() 后，线程释放锁并进入该条件变量的等待队列
6. 其他线程调用 notify() 或 notifyAll() 唤醒等待队列中的线程
7. 被唤醒的线程不会立即执行，而是重新进入入口等待队列，等待再次获取锁（即重新和其他线程一起竞争锁）
8. 线程获取锁后继续执行 wait() 之后的代码

**MESA 模型的核心特点**

1. **信号发送后立即返回**：当一个线程发送信号（调用 notify/notifyAll）唤醒等待的线程时，不会立即释放锁，而是继续执行直到退出管程。

2. **唤醒线程需重新竞争锁**：被唤醒的线程不会立即获得锁，而是从阻塞状态切换到就绪状态，然后重新与其他线程一起竞争锁。

3. **条件等待队列**：每个条件变量都有一个独立的等待队列，线程通过等待特定条件变量进入相应的队列。

4. **虚假唤醒处理**：由于被唤醒的线程需要重新检查条件（可能因其他线程已修改条件而不满足），需要在循环中使用条件等待，防止虚假唤醒。

### AQS 核心原理

AQS（AbstractQueuedSynchronizer）是一个用于构建锁和同步器的框架，它使用一个 int 类型的状态变量来表示同步状态，并通过 FIFO 队列来完成资源获取线程的排队工作。

```java
public abstract class AbstractQueuedSynchronizer
    extends AbstractOwnableSynchronizer
    implements java.io.Serializable {
    
    // 同步状态
    private volatile int state;
    
    // 等待队列的头节点
    private transient volatile Node head;
    
    // 等待队列的尾节点
    private transient volatile Node tail;
    
    // 省略其他代码...
}
```

AQS 的设计基于模板方法模式，子类通过重写指定的方法来实现自己的同步逻辑：

- `tryAcquire(int)`：尝试获取独占锁
- `tryRelease(int)`：尝试释放独占锁
- `tryAcquireShared(int)`：尝试获取共享锁
- `tryReleaseShared(int)`：尝试释放共享锁
- `isHeldExclusively()`：判断是否被当前线程独占

### ReentrantLock 概述

ReentrantLock 是 Java 并发包中的可重入锁实现，它提供了与 synchronized 相同的互斥性和内存可见性，但具有更高的灵活性和扩展性。ReentrantLock 有两种模式：公平锁和非公平锁，默认为非公平锁。

```java
public class ReentrantLock implements Lock, java.io.Serializable {
    
    // 内部同步器
    private final Sync sync;
    
    // 默认构造器，创建非公平锁
    public ReentrantLock() {
        sync = new NonfairSync();
    }
    
    // 根据参数创建公平或非公平锁
    public ReentrantLock(boolean fair) {
        sync = fair ? new FairSync() : new NonfairSync();
    }
    
    // 省略其他代码...
}
```

## AQS 源码分析

### Node 节点

AQS 通过内部类 Node 构建一个 FIFO 的双向链表结构，称为同步队列，来管理同步状态的线程。

```java
static final class Node {
    // 共享模式
    static final Node SHARED = new Node();
    // 独占模式
    static final Node EXCLUSIVE = null;
    
    // 等待状态
    static final int CANCELLED =  1; // 线程已取消
    static final int SIGNAL    = -1; // 后继线程需要唤醒
    static final int CONDITION = -2; // 线程正在等待条件
    static final int PROPAGATE = -3; // 共享式同步状态的释放
    
    volatile int waitStatus;
    volatile Node prev;
    volatile Node next;
    volatile Thread thread;
    Node nextWaiter;
    
    // 省略其他代码...
}
```

### 独占锁获取流程

AQS 独占模式下获取锁的核心方法是 `acquire`：

```java
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        selfInterrupt();
}
```

这个方法包括三个步骤：
1. 调用 `tryAcquire` 尝试获取锁
2. 如果获取失败，调用 `addWaiter` 将当前线程加入等待队列
3. 调用 `acquireQueued` 使线程在队列中自旋等待获取锁

#### addWaiter 方法

```java
private Node addWaiter(Node mode) {
    Node node = new Node(Thread.currentThread(), mode);
    // 快速尝试添加尾节点
    Node pred = tail;
    if (pred != null) {
        node.prev = pred;
        if (compareAndSetTail(pred, node)) {
            pred.next = node;
            return node;
        }
    }
    // 快速添加失败后完整入队
    enq(node);
    return node;
}
```

#### acquireQueued 方法

```java
final boolean acquireQueued(final Node node, int arg) {
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            final Node p = node.predecessor();
            // 如果前驱是头节点，尝试获取锁
            if (p == head && tryAcquire(arg)) {
                setHead(node);
                p.next = null; // 帮助GC
                failed = false;
                return interrupted;
            }
            // 判断是否需要阻塞
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```

### 独占锁释放流程

AQS 释放独占锁的核心方法是 `release`：

```java
public final boolean release(int arg) {
    if (tryRelease(arg)) {
        Node h = head;
        if (h != null && h.waitStatus != 0)
            unparkSuccessor(h);
        return true;
    }
    return false;
}
```

该方法首先调用 `tryRelease` 尝试释放锁，成功后检查头节点，如果需要则唤醒后继节点。

#### unparkSuccessor 方法

```java
private void unparkSuccessor(Node node) {
    int ws = node.waitStatus;
    if (ws < 0)
        compareAndSetWaitStatus(node, ws, 0);
    
    Node s = node.next;
    // 如果后继节点为空或已取消，从尾部开始查找可唤醒的节点
    if (s == null || s.waitStatus > 0) {
        s = null;
        for (Node t = tail; t != null && t != node; t = t.prev)
            if (t.waitStatus <= 0)
                s = t;
    }
    // 唤醒后继节点
    if (s != null)
        LockSupport.unpark(s.thread);
}
```

## ReentrantLock 源码分析

ReentrantLock 通过内部类 Sync 继承 AQS 实现锁的功能，并且提供了公平锁（FairSync）和非公平锁（NonfairSync）两种实现。

### Sync 基类

```java
abstract static class Sync extends AbstractQueuedSynchronizer {
    // 尝试获取非公平锁
    final boolean nonfairTryAcquire(int acquires) {
        final Thread current = Thread.currentThread();
        int c = getState();
        if (c == 0) {
            if (compareAndSetState(0, acquires)) {
                setExclusiveOwnerThread(current);
                return true;
            }
        }
        // 如果当前线程已经持有锁，实现可重入
        else if (current == getExclusiveOwnerThread()) {
            int nextc = c + acquires;
            if (nextc < 0) // 溢出检查
                throw new Error("Maximum lock count exceeded");
            setState(nextc);
            return true;
        }
        return false;
    }
    
    // 尝试释放锁
    protected final boolean tryRelease(int releases) {
        int c = getState() - releases;
        // 只有锁的持有者才能释放锁
        if (Thread.currentThread() != getExclusiveOwnerThread())
            throw new IllegalMonitorStateException();
        boolean free = false;
        // 如果锁被完全释放，清空拥有者
        if (c == 0) {
            free = true;
            setExclusiveOwnerThread(null);
        }
        setState(c);
        return free;
    }
    
    // 其他方法...
}
```

### 非公平锁实现

```java
static final class NonfairSync extends Sync {
    // 获取锁
    final void lock() {
        // 首先直接尝试获取锁，这是非公平性的体现
        if (compareAndSetState(0, 1))
            setExclusiveOwnerThread(Thread.currentThread());
        else
            acquire(1); // 否则走正常的 acquire 流程
    }
    
    // 实现 AQS 的 tryAcquire 方法
    protected final boolean tryAcquire(int acquires) {
        return nonfairTryAcquire(acquires);
    }
}
```

### 公平锁实现

```java
static final class FairSync extends Sync {
    // 获取锁
    final void lock() {
        acquire(1); // 直接走 acquire 流程
    }
    
    // 实现 AQS 的 tryAcquire 方法
    protected final boolean tryAcquire(int acquires) {
        final Thread current = Thread.currentThread();
        int c = getState();
        if (c == 0) {
            // 公平性的体现：只有在没有等待更久的线程时才获取锁
            if (!hasQueuedPredecessors() &&
                compareAndSetState(0, acquires)) {
                setExclusiveOwnerThread(current);
                return true;
            }
        }
        else if (current == getExclusiveOwnerThread()) {
            int nextc = c + acquires;
            if (nextc < 0)
                throw new Error("Maximum lock count exceeded");
            setState(nextc);
            return true;
        }
        return false;
    }
}
```

### ReentrantLock 的核心方法实现

#### lock 方法

```java
public void lock() {
    sync.lock();
}
```

#### unlock 方法

```java
public void unlock() {
    sync.release(1);
}
```

#### tryLock 方法

```java
public boolean tryLock() {
    return sync.nonfairTryAcquire(1);
}
```

#### lockInterruptibly 方法

```java
public void lockInterruptibly() throws InterruptedException {
    sync.acquireInterruptibly(1);
}
```

## 源码分析深入

### 可重入性实现原理

ReentrantLock 的可重入性通过记录锁的持有者和获取次数来实现：

1. 当线程获取锁时，先判断锁是否被占用
2. 如果锁没有被占用（state == 0），尝试通过 CAS 操作获取锁
3. 如果锁已被占用，检查持有锁的线程是否为当前线程
4. 如果是当前线程，则增加重入计数（state 值）

```java
// 在 nonfairTryAcquire 和 tryAcquire 中的可重入实现
else if (current == getExclusiveOwnerThread()) {
    int nextc = c + acquires;
    if (nextc < 0)
        throw new Error("Maximum lock count exceeded");
    setState(nextc);
    return true;
}
```

### 公平锁与非公平锁的区别

公平锁和非公平锁的关键区别在于获取锁的顺序：

1. **非公平锁**：线程获取锁时，会直接尝试获取（不考虑等待队列），这可能导致等待中的线程饥饿

   ```java
   final void lock() {
       if (compareAndSetState(0, 1))
           setExclusiveOwnerThread(Thread.currentThread());
       else
           acquire(1);
   }
   ```

2. **公平锁**：线程获取锁时，会先检查等待队列，只有在自己是第一个等待的线程时才尝试获取

   ```java
   protected final boolean tryAcquire(int acquires) {
       // ... 省略部分代码
       if (c == 0) {
           if (!hasQueuedPredecessors() &&  // 检查是否有前驱节点
               compareAndSetState(0, acquires)) {
               // ... 省略部分代码
           }
       }
       // ... 省略部分代码
   }
   ```

这种设计使得非公平锁通常具有更高的吞吐量，而公平锁则确保等待时间最长的线程优先获取锁。

### Condition 实现原理

ReentrantLock 通过 newCondition() 方法创建一个与锁绑定的条件变量：

```java
public Condition newCondition() {
    return sync.newCondition();
}
```

在 Sync 中的实现：

```java
final ConditionObject newCondition() {
    return new ConditionObject();
}
```

ConditionObject 是 AQS 的内部类，它通过单独维护一个条件队列来实现等待/通知机制：

```java
public class ConditionObject implements Condition {
    // 条件队列的头节点
    private transient Node firstWaiter;
    // 条件队列的尾节点
    private transient Node lastWaiter;
    
    // 等待方法
    public final void await() throws InterruptedException {
        if (Thread.interrupted())
            throw new InterruptedException();
        // 添加到条件队列
        Node node = addConditionWaiter();
        // 完全释放锁
        int savedState = fullyRelease(node);
        int interruptMode = 0;
        // 循环检查节点是否已转移到同步队列
        while (!isOnSyncQueue(node)) {
            LockSupport.park(this);
            // 检查中断
            if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)
                break;
        }
        // 重新获取锁
        if (acquireQueued(node, savedState) && interruptMode != THROW_IE)
            interruptMode = REINTERRUPT;
        if (node.nextWaiter != null)
            unlinkCancelledWaiters();
        if (interruptMode != 0)
            reportInterruptAfterWait(interruptMode);
    }
    
    // 通知方法
    public final void signal() {
        if (!isHeldExclusively())
            throw new IllegalMonitorStateException();
        Node first = firstWaiter;
        if (first != null)
            doSignal(first);
    }
    
    // 省略其他方法...
}
```

## 高级特性解析

### 锁降级

锁降级指的是持有写锁的线程获取读锁，然后释放写锁的过程。ReentrantLock 本身不支持降级，但是 ReentrantReadWriteLock 支持。

### 锁优化

JVM 对 synchronized 进行了许多优化，如偏向锁、轻量级锁和自旋锁，这使得在低竞争环境下，synchronized 可能比 ReentrantLock 更具性能优势。但在高竞争、需要特殊功能（如超时、可中断等）的场景下，ReentrantLock 仍然是更好的选择。

### 性能考量

在选择 ReentrantLock 的公平与非公平模式时，需要考虑以下因素：

1. **吞吐量**：非公平锁通常具有更高的吞吐量
2. **响应时间**：公平锁能够减少线程的最大等待时间
3. **上下文切换**：非公平锁可能减少线程切换次数，节省系统资源
4. **业务需求**：如果业务要求严格按照请求顺序处理，应选择公平锁

## 实践应用案例

### 缓存系统中的并发控制

在高并发的缓存系统中，ReentrantLock 可以提供细粒度的加锁策略，减少锁竞争：

```java
public class ConcurrentCache<K, V> {
    private final Map<K, V> cache = new HashMap<>();
    private final Map<K, ReentrantLock> lockMap = new ConcurrentHashMap<>();
    
    public V get(K key) {
        return cache.get(key);
    }
    
    public V computeIfAbsent(K key, Function<K, V> mappingFunction) {
        V value = cache.get(key);
        if (value != null) {
            return value;
        }
        
        // 获取特定 key 的锁，不存在则创建
        ReentrantLock lock = lockMap.computeIfAbsent(key, k -> new ReentrantLock());
        lock.lock();
        try {
            // 双重检查
            value = cache.get(key);
            if (value == null) {
                value = mappingFunction.apply(key);
                cache.put(key, value);
            }
            return value;
        } finally {
            lock.unlock();
            // 移除不再需要的锁
            lockMap.remove(key);
        }
    }
}
```

### 读写分离的场景

在读多写少的场景中，可以使用 ReentrantReadWriteLock 实现更高效的并发控制：

```java
public class ConcurrentDataStore<K, V> {
    private final Map<K, V> store = new HashMap<>();
    private final ReadWriteLock rwLock = new ReentrantReadWriteLock();
    private final Lock readLock = rwLock.readLock();
    private final Lock writeLock = rwLock.writeLock();
    
    public V get(K key) {
        readLock.lock();
        try {
            return store.get(key);
        } finally {
            readLock.unlock();
        }
    }
    
    public void put(K key, V value) {
        writeLock.lock();
        try {
            store.put(key, value);
        } finally {
            writeLock.unlock();
        }
    }
    
    public V computeIfAbsent(K key, Function<K, V> mappingFunction) {
        // 先尝试读
        readLock.lock();
        try {
            if (store.containsKey(key)) {
                return store.get(key);
            }
        } finally {
            readLock.unlock();
        }
        
        // 没有找到，加写锁
        writeLock.lock();
        try {
            // 再次检查（可能在获取写锁的过程中已被其他线程写入）
            if (store.containsKey(key)) {
                return store.get(key);
            }
            
            V value = mappingFunction.apply(key);
            store.put(key, value);
            return value;
        } finally {
            writeLock.unlock();
        }
    }
}
```

## 常见问题

### 死锁问题及解决方案

使用 ReentrantLock 时可能遇到死锁问题，常见解决方案包括：

1. **超时获取锁**：使用 `tryLock(long timeout, TimeUnit unit)` 方法避免无限等待

   ```java
   public boolean transferMoney(Account from, Account to, double amount) {
       long timeout = 1000; // 1秒超时
       try {
           if (from.lock.tryLock(timeout, TimeUnit.MILLISECONDS)) {
               try {
                   if (to.lock.tryLock(timeout, TimeUnit.MILLISECONDS)) {
                       try {
                           if (from.balance < amount) {
                               return false;
                           }
                           from.balance -= amount;
                           to.balance += amount;
                           return true;
                       } finally {
                           to.lock.unlock();
                       }
                   }
               } finally {
                   from.lock.unlock();
               }
           }
       } catch (InterruptedException e) {
           Thread.currentThread().interrupt();
       }
       return false; // 获取锁失败
   }
   ```

2. **资源排序**：对资源进行排序，确保按照相同的顺序获取锁

   ```java
   public boolean transferMoney(Account from, Account to, double amount) {
       Account first = from.id < to.id ? from : to;
       Account second = from.id < to.id ? to : from;
       
       first.lock.lock();
       try {
           second.lock.lock();
           try {
               if (from.balance < amount) {
                   return false;
               }
               from.balance -= amount;
               to.balance += amount;
               return true;
           } finally {
               second.lock.unlock();
           }
       } finally {
           first.lock.unlock();
       }
   }
   ```

### 内存一致性问题

ReentrantLock 与 volatile 变量一样，遵循 Java 内存模型的 happens-before 原则，确保锁释放之前的写操作对获取锁之后的读操作可见。

## 最佳实践

### 选择合适的锁类型

1. **synchronized** 适用于：
   - 简单的同步需求
   - 锁区域代码执行时间短
   - 不需要高级特性（如尝试获取锁、中断等）

2. **ReentrantLock** 适用于：
   - 需要条件变量
   - 需要可中断的锁获取
   - 需要非阻塞的尝试获取锁
   - 需要公平队列
   - 需要锁的细粒度控制

### 使用技巧

1. **总是在 finally 块中释放锁**
   
   ```java
   Lock lock = new ReentrantLock();
   try {
       lock.lock();
       // 临界区代码
   } finally {
       lock.unlock();
   }
   ```

2. **使用 try-with-resources 和辅助类**
   
   ```java
   public class AutoClosableLock implements AutoCloseable {
       private final Lock lock;
       
       public AutoClosableLock(Lock lock) {
           this.lock = lock;
           this.lock.lock();
       }
       
       @Override
       public void close() {
           this.lock.unlock();
       }
   }
   
   // 使用例子
   Lock lock = new ReentrantLock();
   try (AutoClosableLock ignored = new AutoClosableLock(lock)) {
       // 临界区代码
   }
   ```

3. **锁分离技术**
   
   针对不同的业务操作使用不同的锁，减少锁竞争：
   
   ```java
   public class UserService {
       private final Lock userLock = new ReentrantLock();
       private final Lock orderLock = new ReentrantLock();
       
       public void updateUserInfo(User user) {
           userLock.lock();
           try {
               // 更新用户信息
           } finally {
               userLock.unlock();
           }
       }
       
       public void processOrder(Order order) {
           orderLock.lock();
           try {
               // 处理订单
           } finally {
               orderLock.unlock();
           }
       }
   }
   ```

## 参考资料

1. [Java Concurrency in Practice](https://jcip.net)
2. [The Art of Multiprocessor Programming](https://www.elsevier.com/books/the-art-of-multiprocessor-programming/herlihy/978-0-12-415950-1)
3. [Java 并发编程实战](https://time.geekbang.org/column/intro/100023901)
4. [JDK 源码](https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/concurrent/locks/AbstractQueuedSynchronizer.java) 
5. [Java 中的管程模型](https://segmentfault.com/a/1190000021557492)