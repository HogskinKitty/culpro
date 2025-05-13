# 线程安全

## 简介

本文详细介绍 Java 中的线程安全问题、常见的线程安全隐患以及如何设计和实现线程安全的代码。线程安全是并发编程中的核心概念，对于构建可靠的多线程应用至关重要。

## 基本概念

### 什么是线程安全

**线程安全定义**：

当多个线程同时访问一个对象时，如果不用考虑这些线程在运行时环境下的调度和交替执行，也不需要进行额外的同步，或者在调用方进行任何其他的协调操作，调用这个对象的行为都可以获得正确的结果，那么这个对象是线程安全的。

**线程安全的本质**：

1. **原子性**：一个或者多个操作在 CPU 执行过程中不被中断的特性

2. **可见性**：一个线程对共享变量的修改，其他线程能够立即看到

3. **有序性**：程序执行的顺序按照代码的先后顺序执行

### 线程不安全的表现

**常见问题**：

1. **竞态条件**：多个线程以非预期的顺序访问共享资源

2. **数据不一致**：多个线程操作导致数据最终状态与预期不符

3. **死锁**：两个或多个线程互相等待对方释放资源，导致程序无法继续执行

4. **活锁**：线程不断重试失败的操作，消耗 CPU 资源但无法推进

5. **饥饿**：线程因无法获取所需资源而无法执行

**代码示例 - 线程不安全的计数器**：

```java
public class UnsafeCounter {
    private int count;
    
    public void increment() {
        count++; // 非原子操作
    }
    
    public int getCount() {
        return count;
    }
    
    public static void main(String[] args) throws InterruptedException {
        UnsafeCounter counter = new UnsafeCounter();
        Thread[] threads = new Thread[100];
        
        // 创建 100 个线程，每个线程对计数器增加 1000 次
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    counter.increment();
                }
            });
            threads[i].start();
        }
        
        // 等待所有线程执行完毕
        for (Thread thread : threads) {
            thread.join();
        }
        
        System.out.println("Expected: 100000, Actual: " + counter.getCount());
        // 输出通常小于 100000，因为 count++ 不是原子操作
    }
}
```

**问题分析**：

`count++` 看似是一个简单操作，实际上包含三个步骤：读取 count 的值，将值加 1，将结果写回 count。在多线程环境下，这三个步骤可能交错执行，导致计数不准确。

## 实现线程安全的方法

### 1. 使用 synchronized 关键字

`synchronized` 关键字是 Java 中最基本的同步机制，它可以用于方法或代码块。

**synchronized 方法**：

```java
public class SafeCounter {
    private int count;
    
    // 对整个方法加锁
    public synchronized void increment() {
        count++;
    }
    
    public synchronized int getCount() {
        return count;
    }
}
```

**synchronized 代码块**：

```java
public class SafeCounter {
    private int count;
    private final Object lock = new Object(); // 显式锁对象
    
    public void increment() {
        synchronized (lock) { // 对特定对象加锁
            count++;
        }
    }
    
    public int getCount() {
        synchronized (lock) {
            return count;
        }
    }
}
```

**关键点说明**：

- synchronized 方法使用 this 对象作为锁

- synchronized 代码块可以指定任意对象作为锁

- synchronized 保证了原子性和可见性

- 过度使用 synchronized 可能导致性能问题和死锁

### 2. 使用 volatile 关键字

`volatile` 关键字用于保证变量的可见性，但不保证原子性。

```java
public class VolatileExample {
    private volatile boolean flag = false;
    
    // 写线程
    public void toggle() {
        flag = !flag;
    }
    
    // 读线程
    public boolean getFlag() {
        return flag;
    }
}
```

**关键点说明**：

- volatile 保证变量的修改对其他线程立即可见

- volatile 变量的读写都不会被重排序到 volatile 操作之前

- volatile 不能保证复合操作的原子性

- 适用于一个线程写，多个线程读的场景

### 3. 使用 java.util.concurrent.atomic 包

Java 提供了原子类，如 AtomicInteger、AtomicLong、AtomicReference 等，可以保证原子性操作。

```java
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicCounter {
    private AtomicInteger count = new AtomicInteger(0);
    
    public void increment() {
        count.incrementAndGet(); // 原子操作
    }
    
    public int getCount() {
        return count.get();
    }
    
    public static void main(String[] args) throws InterruptedException {
        AtomicCounter counter = new AtomicCounter();
        Thread[] threads = new Thread[100];
        
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    counter.increment();
                }
            });
            threads[i].start();
        }
        
        for (Thread thread : threads) {
            thread.join();
        }
        
        System.out.println("Expected: 100000, Actual: " + counter.getCount());
        // 输出一定是 100000，因为使用了原子操作
    }
}
```

**关键点说明**：

- 原子类基于 CAS (Compare And Swap) 操作实现

- 性能通常优于 synchronized

- 只能保证单个变量的原子性，不能保证多个变量的原子性

### 4. 使用显式锁 Lock

Java 5 引入了 `java.util.concurrent.locks` 包，提供了 Lock 接口的实现类，如 ReentrantLock。

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class LockCounter {
    private int count;
    private final Lock lock = new ReentrantLock();
    
    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock(); // 确保锁被释放
        }
    }
    
    public int getCount() {
        lock.lock();
        try {
            return count;
        } finally {
            lock.unlock();
        }
    }
}
```

**关键点说明**：

- Lock 接口提供了比 synchronized 更灵活的锁操作

- 必须手动释放锁，通常在 finally 块中进行

- 支持尝试获取锁、可中断锁、公平锁等高级特性

- 可能引入更复杂的错误，如忘记释放锁

### 5. 使用线程安全集合类

Java 提供了线程安全的集合类，如 ConcurrentHashMap、CopyOnWriteArrayList、ConcurrentLinkedQueue 等。

```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

public class ThreadSafeCollectionExample {
    // 线程安全的 Map 实现
    private Map<String, Integer> safeMap = new ConcurrentHashMap<>();
    
    public void put(String key, Integer value) {
        safeMap.put(key, value);
    }
    
    public Integer get(String key) {
        return safeMap.get(key);
    }
}
```

**关键点说明**：

- 专为并发访问设计，性能优于同步包装器

- 提供了原子的复合操作

- 具体选择取决于使用场景和性能需求

## 线程安全设计模式

### 1. 不可变对象

不可变对象是指创建后其状态不能被修改的对象，天然线程安全。

```java
public final class ImmutableValue {
    private final int value;
    
    public ImmutableValue(int value) {
        this.value = value;
    }
    
    public int getValue() {
        return value;
    }
    
    // 不提供 setter 方法，而是返回新对象
    public ImmutableValue add(int valueToAdd) {
        return new ImmutableValue(this.value + valueToAdd);
    }
}
```

**关键点说明**：

- 所有字段都是 final 的

- 类通常被声明为 final，防止子类破坏不可变性

- 不提供修改状态的方法

- 确保所有可变组件的安全发布

### 2. 线程封闭

线程封闭是指将对象仅限于单个线程中使用，避免共享。

**栈封闭**：

```java
public void processRequest(String request) {
    // request 变量仅在方法内部使用，不会在线程间共享
    int requestHash = request.hashCode();
    // 处理请求...
}
```

**ThreadLocal**：

```java
public class ThreadLocalExample {
    // 每个线程都有自己的 SimpleDateFormat 实例
    private static final ThreadLocal<SimpleDateFormat> dateFormat = 
        ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
    
    public String formatDate(Date date) {
        return dateFormat.get().format(date);
    }
}
```

**关键点说明**：

- 最简单的实现线程安全的方式

- 避免了同步的开销

- 注意防止线程泄漏，特别是使用线程池时

### 3. 读写锁模式

读写锁允许多个线程同时读取共享资源，但只允许一个线程写入。

```java
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadWriteMap<K, V> {
    private final Map<K, V> map = new HashMap<>();
    private final ReadWriteLock lock = new ReentrantReadWriteLock();
    
    public V put(K key, V value) {
        lock.writeLock().lock(); // 写锁
        try {
            return map.put(key, value);
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    public V get(K key) {
        lock.readLock().lock(); // 读锁
        try {
            return map.get(key);
        } finally {
            lock.readLock().unlock();
        }
    }
}
```

**关键点说明**：

- 读操作共享，写操作互斥

- 适用于读多写少的场景

- 可以提高并发性能

## 线程安全分析与实践

### 1. 线程安全等级

**不可变**：

对象创建后状态不变，如 String、Integer 等。

**绝对线程安全**：

任何顺序的并发访问都不需要额外的同步，如 ConcurrentHashMap。

**相对线程安全**：

单个操作是线程安全的，但复合操作可能需要额外同步，如 Vector、HashTable。

**线程兼容**：

本身不是线程安全的，但可以通过同步机制使其在多线程环境下安全使用，如 ArrayList、HashMap。

**线程对立**：

即使使用同步机制也无法在多线程环境下安全使用，如 System.setOut()。

### 2. 安全发布对象

确保对象被安全地发布到其他线程：

1. **通过静态初始化器初始化**

2. **将引用存储到 volatile 字段或 AtomicReference**

3. **将引用存储到正确构造的对象的 final 字段**

4. **将引用存储到由锁保护的字段**

```java
// 安全发布示例
public class SafePublish {
    // 1. 静态初始化器
    private static final Resource resource = new Resource();
    
    // 2. volatile 引用
    private volatile Resource volatileResource;
    
    // 3. final 字段
    private final Resource finalResource;
    
    public SafePublish() {
        this.finalResource = new Resource();
    }
    
    // 4. 锁保护
    private Resource lockResource;
    private final Object lock = new Object();
    
    public Resource getLockResource() {
        synchronized (lock) {
            if (lockResource == null) {
                lockResource = new Resource();
            }
            return lockResource;
        }
    }
}

class Resource {
    // 资源类
}
```

### 3. 常见线程安全问题分析

**竞态条件**：

```java
// 检查再操作模式引发的竞态条件
public class LazyInitRace {
    private ExpensiveObject instance = null;
    
    // 存在竞态条件
    public ExpensiveObject getInstance() {
        if (instance == null) {
            instance = new ExpensiveObject(); // 可能被多个线程执行
        }
        return instance;
    }
}

// 解决方案：双重检查锁定 + volatile
public class SafeLazyInit {
    private volatile ExpensiveObject instance = null;
    
    public ExpensiveObject getInstance() {
        if (instance == null) { // 第一次检查
            synchronized (this) {
                if (instance == null) { // 第二次检查
                    instance = new ExpensiveObject();
                }
            }
        }
        return instance;
    }
}

class ExpensiveObject {
    // 昂贵的对象创建...
}
```

**死锁**：

```java
public class DeadlockExample {
    private final Object lock1 = new Object();
    private final Object lock2 = new Object();
    
    // 可能导致死锁
    public void method1() {
        synchronized (lock1) {
            System.out.println("持有 lock1，等待 lock2");
            synchronized (lock2) {
                System.out.println("同时持有 lock1 和 lock2");
            }
        }
    }
    
    public void method2() {
        synchronized (lock2) { // 锁获取顺序与 method1 相反
            System.out.println("持有 lock2，等待 lock1");
            synchronized (lock1) {
                System.out.println("同时持有 lock1 和 lock2");
            }
        }
    }
    
    // 解决方案：保持锁获取的一致顺序
    public void safeMethod1() {
        synchronized (lock1) {
            synchronized (lock2) {
                // 操作
            }
        }
    }
    
    public void safeMethod2() {
        synchronized (lock1) { // 与 safeMethod1 保持相同的锁获取顺序
            synchronized (lock2) {
                // 操作
            }
        }
    }
}
```

## 最佳实践

### 1. 设计原则

1. **尽量减少共享**：避免不必要的共享，减少线程安全问题的发生

2. **不可变优先**：优先使用不可变对象，不可变对象天然线程安全

3. **最小化锁范围**：锁的范围越小，并发性能越好

4. **使用现有的线程安全类**：优先使用 JDK 提供的线程安全类，避免自己实现

5. **避免过早优化**：先保证正确性，再考虑性能优化

### 2. 代码示例

**优化锁范围**：

```java
// 锁范围过大
public void processList(List<Item> items) {
    synchronized (this) {
        for (Item item : items) {
            // 处理每个 item...
            processItem(item);
        }
    }
}

// 优化锁范围
public void processList(List<Item> items) {
    // 在锁外进行非共享资源操作
    for (Item item : items) {
        // 仅对共享资源的操作加锁
        synchronized (this) {
            // 最小化锁定范围内的操作
            updateSharedState(item);
        }
        // 继续锁外操作
        continueProcessing(item);
    }
}
```

**合理使用线程安全工具**：

```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.LongAdder;
import java.util.Map;

// 高效的计数器实现
public class ConcurrentCounter {
    // 使用线程安全的 Map
    private final Map<String, LongAdder> counters = new ConcurrentHashMap<>();
    
    // 增加计数
    public void increment(String key) {
        // computeIfAbsent 是原子操作
        counters.computeIfAbsent(key, k -> new LongAdder()).increment();
    }
    
    // 获取计数
    public long getCount(String key) {
        LongAdder adder = counters.get(key);
        return adder == null ? 0 : adder.sum();
    }
}
```

### 3. 性能考量

1. **锁分段技术**：将一个大的锁拆分成多个小锁，提高并发度

2. **避免锁争用**：减少锁争用的方法包括减少锁的持有时间、降低锁的请求频率等

3. **读写分离**：读多写少的场景下，使用读写锁提高并发性能

4. **CAS 操作优于锁**：在简单的场景下，使用原子类的 CAS 操作比锁更高效

5. **慎用 volatile**：volatile 变量读操作的性能消耗比普通变量略高，但通常比锁低很多

## 常见问题

### Q1: synchronized 和 Lock 有什么区别？

**答**：主要区别在于：

1. **锁获取方式**：synchronized 是隐式获取和释放锁，Lock 是显式获取和释放

2. **尝试获取锁**：Lock 可以尝试获取锁，也可以设置超时时间

3. **公平性**：Lock 可以创建公平锁，synchronized 只能是非公平锁

4. **中断响应**：Lock 支持获取锁期间被中断，synchronized 不支持

5. **性能**：在 Java 6 之后，两者性能差异不大，但 Lock 更灵活

### Q2: 什么是 CAS，它如何保证线程安全？

**答**：CAS (Compare And Swap) 是一种无锁算法，主要通过处理器指令实现原子操作。它包含三个操作数：内存位置、期望值和新值。只有当内存位置的值等于期望值时，才会更新为新值，否则不做任何操作。

CAS 是 Java 原子类 (AtomicInteger 等) 的实现基础，它避免了传统锁的阻塞问题，提高了并发性能。但 CAS 也存在 ABA 问题、循环时间过长和只能保证单个变量原子性的缺点。

### Q3: ThreadLocal 是如何实现线程安全的？

**答**：ThreadLocal 通过为每个线程创建变量的独立副本来实现线程安全。每个线程都有一个 ThreadLocalMap，用于存储以 ThreadLocal 实例为键，线程本地变量为值的映射。

因为每个线程访问的都是自己的独立副本，不存在共享，所以无需同步即可保证线程安全。但需要注意内存泄漏问题，特别是在线程池环境下。

### Q4: 如何避免死锁？

**答**：避免死锁的常用方法包括：

1. **固定获取锁的顺序**：确保所有线程以相同的顺序获取锁

2. **超时机制**：使用 tryLock 方法设置获取锁的超时时间

3. **避免嵌套锁**：尽量避免在持有一个锁的情况下去获取另一个锁

4. **使用锁层次**：定义锁的层次结构，低层次的锁不能请求高层次的锁

5. **及时释放锁**：使用 try-finally 结构确保锁的释放

### Q5: volatile 能否保证复合操作的原子性？

**答**：不能。volatile 只能保证可见性和禁止指令重排序，不能保证复合操作的原子性。例如，`count++` 是一个复合操作，包含读取、递增和写入三个步骤，volatile 不能保证这三个步骤作为整体的原子性。如果需要复合操作的原子性，应该使用 synchronized 或者 java.util.concurrent.atomic 包中的原子类。

## 参考资料

1. [Java Concurrency in Practice](mdc:https://jcip.net)

2. [Java Documentation - Thread](mdc:https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Thread.html)

3. [Oracle Tutorial - Concurrency](mdc:https://docs.oracle.com/javase/tutorial/essential/concurrency/)

4. [Java 内存模型规范](mdc:https://download.oracle.com/javase/specs/jls/se17/html/jls-17.html#jls-17.4)

5. [Doug Lea - Java Concurrency](mdc:https://gee.cs.oswego.edu/dl/cpj/) 