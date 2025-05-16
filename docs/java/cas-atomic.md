# CAS 与 Atomic 原子操作详解

## 简介

CAS（Compare-And-Swap，比较并交换）是一种无锁算法，是实现原子操作的重要基础。Java 并发包中的原子类（Atomic 系列类）就是基于 CAS 操作实现的，它们提供了在高并发环境下不需要使用锁就能保证数据一致性的解决方案。本文将深入解析 CAS 原理和 Atomic 原子类的实现和应用。

## 基本概念

### 什么是 CAS

CAS 是一种基于硬件原语的操作，它包含三个操作数：

- **内存位置（V）**：要更新的变量的内存地址

- **预期原值（A）**：更新前的预期值

- **新值（B）**：要设置的新值

CAS 的核心思想是：当且仅当内存位置 V 的值等于预期值 A 时，才将其更新为新值 B。整个操作是一个原子操作，不会被中断。

```java
// CAS 的伪代码表示
boolean compareAndSwap(V, A, B) {
    if (V == A) {
        V = B;
        return true;
    } else {
        return false;
    }
}
```

### CAS 的底层实现

在 JVM 中，CAS 操作是通过 `sun.misc.Unsafe` 类中的 `native` 方法实现的：

```java
public final native boolean compareAndSwapInt(Object o, long offset, int expected, int x);

public final native boolean compareAndSwapLong(Object o, long offset, long expected, long x);

public final native boolean compareAndSwapObject(Object o, long offset, Object expected, Object x);
```

这些方法最终会被编译成 CPU 的特定指令：

- 在 x86 架构上，对应的是 `cmpxchg` 指令

- 在 ARM 架构上，对应的是 `ldrex` 和 `strex` 指令

这些指令通常会附带总线锁或缓存锁，确保多个处理器不会同时修改同一内存位置。

## 原子类详解

### Atomic 类家族概览

Java 的 `java.util.concurrent.atomic` 包提供了一系列原子类，主要分为以下几类：

1. **基本类型原子类**
   - `AtomicBoolean`：原子更新布尔类型
   
   - `AtomicInteger`：原子更新整型
   
   - `AtomicLong`：原子更新长整型

2. **引用类型原子类**
   - `AtomicReference`：原子更新引用类型
   
   - `AtomicMarkableReference`：原子更新带有标记位的引用类型
   
   - `AtomicStampedReference`：原子更新带有版本号的引用类型

3. **数组类型原子类**
   - `AtomicIntegerArray`：原子更新整型数组里的元素
   
   - `AtomicLongArray`：原子更新长整型数组里的元素
   
   - `AtomicReferenceArray`：原子更新引用类型数组里的元素

4. **属性更新器类**
   - `AtomicIntegerFieldUpdater`：原子更新整型字段
   
   - `AtomicLongFieldUpdater`：原子更新长整型字段
   
   - `AtomicReferenceFieldUpdater`：原子更新引用类型字段

5. **累加器类（Java 8 新增）**
   - `LongAdder`：比 `AtomicLong` 更高效的计数器
   
   - `LongAccumulator`：提供自定义函数操作的累加器
   
   - `DoubleAdder`：`double` 类型的累加器
   
   - `DoubleAccumulator`：`double` 类型的累加器

### AtomicInteger 源码分析

`AtomicInteger` 是最常用的原子类之一，我们通过分析它的源码来了解 CAS 的实际应用：

```java
public class AtomicInteger extends Number implements java.io.Serializable {
    private static final Unsafe unsafe = Unsafe.getUnsafe();
    private static final long valueOffset;

    static {
        try {
            valueOffset = unsafe.objectFieldOffset
                (AtomicInteger.class.getDeclaredField("value"));
        } catch (Exception ex) { throw new Error(ex); }
    }

    private volatile int value;

    // 构造方法
    public AtomicInteger(int initialValue) {
        value = initialValue;
    }

    public AtomicInteger() {
    }

    // 核心方法：compareAndSet
    public final boolean compareAndSet(int expect, int update) {
        return unsafe.compareAndSwapInt(this, valueOffset, expect, update);
    }

    // 获取当前值并设置新值
    public final int getAndSet(int newValue) {
        return unsafe.getAndSetInt(this, valueOffset, newValue);
    }

    // 获取当前值并加上给定值
    public final int getAndAdd(int delta) {
        return unsafe.getAndAddInt(this, valueOffset, delta);
    }

    // 加1并获取结果
    public final int incrementAndGet() {
        return unsafe.getAndAddInt(this, valueOffset, 1) + 1;
    }

    // 减1并获取结果
    public final int decrementAndGet() {
        return unsafe.getAndAddInt(this, valueOffset, -1) - 1;
    }
    
    // 更多方法...
}
```

关键点解析：

1. **valueOffset**：通过 `Unsafe.objectFieldOffset()` 方法获取 `value` 字段在内存中的偏移量

2. **volatile value**：使用 `volatile` 关键字修饰 `value` 字段，确保多线程之间的可见性

3. **compareAndSet**：核心方法，调用 `Unsafe.compareAndSwapInt()` 实现 CAS 操作

4. **其他方法**：`getAndAdd`、`incrementAndGet` 等都是基于 CAS 实现的原子操作

### Unsafe.getAndAddInt 实现

Java 8 中的 `Unsafe.getAndAddInt` 方法实现展示了 CAS 的自旋特性：

```java
public final int getAndAddInt(Object o, long offset, int delta) {
    int v;
    do {
        v = getIntVolatile(o, offset);
    } while (!compareAndSwapInt(o, offset, v, v + delta));
    return v;
}
```

这里使用了一个自旋循环，不断尝试执行 CAS 操作，直到成功为止。

## CAS 的应用场景

### 计数器

原子计数器是 CAS 最典型的应用场景，相比使用 `synchronized` 锁实现的计数器，基于 `AtomicInteger` 的实现性能更高：

```java
// 使用 AtomicInteger 实现线程安全的计数器
public class AtomicCounter {
    private AtomicInteger count = new AtomicInteger(0);
    
    public void increment() {
        count.incrementAndGet();
    }
    
    public void decrement() {
        count.decrementAndGet();
    }
    
    public int value() {
        return count.get();
    }
}
```

### 无锁数据结构

CAS 可以用于实现各种无锁数据结构，例如无锁队列、无锁链表等：

```java
// 使用 AtomicReference 实现的简单无锁栈
public class ConcurrentStack<E> {
    private AtomicReference<Node<E>> top = new AtomicReference<>();
    
    public void push(E item) {
        Node<E> newHead = new Node<>(item);
        Node<E> oldHead;
        do {
            oldHead = top.get();
            newHead.next = oldHead;
        } while (!top.compareAndSet(oldHead, newHead));
    }
    
    public E pop() {
        Node<E> oldHead;
        Node<E> newHead;
        do {
            oldHead = top.get();
            if (oldHead == null)
                return null;
            newHead = oldHead.next;
        } while (!top.compareAndSet(oldHead, newHead));
        return oldHead.item;
    }
    
    private static class Node<E> {
        final E item;
        Node<E> next;
        
        Node(E item) {
            this.item = item;
        }
    }
}
```

### 数据一致性验证

在需要检查数据一致性的场景中，可以使用 `AtomicStampedReference` 或 `AtomicMarkableReference` 解决 ABA 问题：

```java
// 使用 AtomicStampedReference 处理 ABA 问题
public class StampedAccount {
    private AtomicStampedReference<Integer> balance;
    
    public StampedAccount(int initialBalance) {
        balance = new AtomicStampedReference<>(initialBalance, 0);
    }
    
    public boolean transfer(int amount) {
        int[] stamp = new int[1];
        Integer currentBalance;
        
        do {
            currentBalance = balance.get(stamp);
            if (currentBalance < amount)
                return false;
        } while (!balance.compareAndSet(currentBalance, 
                                        currentBalance - amount, 
                                        stamp[0], 
                                        stamp[0] + 1));
        return true;
    }
    
    public int getBalance() {
        return balance.getReference();
    }
}
```

## CAS 的优缺点

### 优点

1. **无锁**：不需要加锁，避免了线程上下文切换的开销

2. **乐观并发**：假设不会发生冲突，冲突时才进行重试，适合读多写少的场景

3. **适合高并发**：在高并发环境下比传统锁有更好的性能

### 缺点

1. **ABA 问题**：
   - 问题描述：如果一个值原来是 A，变成了 B，又变回了 A，使用 CAS 进行检查时会认为它没有变化，但实际上已经发生了变化
   
   - ABA 问题详解：
     
     在并发环境中，假设线程 T1 读取了共享变量的值为 A，此时被挂起。线程 T2 将共享变量的值从 A 修改为 B，然后又修改回 A。当线程 T1 恢复执行，发现共享变量的值仍为 A，所以 CAS 操作成功。但实际上，共享变量已经经历了 A→B→A 的变化过程。
     
     这在某些场景下可能导致问题，典型的例子是链表操作：
     
     ```
     初始状态： A -> B -> C
     线程1：准备删除A，读取到 A 的值，但被挂起
     线程2：删除了 A 和 B，现在链表变成：C
     线程2：插入新节点 D，链表变成：D -> C
     线程2：又插入新节点 A，链表变成：A -> D -> C
     线程1：恢复执行，发现头节点仍然是 A，CAS 成功，但实际链表结构已经变成了：D -> C
     ```
     
     此时出现了错误，因为线程1并不知道 A 节点已经不是原来的 A 节点，链表结构已经发生了变化。
   
   - 解决方案：使用 `AtomicStampedReference` 或 `AtomicMarkableReference` 添加版本号或标记
     
     `AtomicStampedReference` 不仅比较值，还比较版本号（stamp），只有两者都匹配时才进行更新：
     
     ```java
     // 使用 AtomicStampedReference 解决 ABA 问题的示例
     AtomicStampedReference<Integer> asr = new AtomicStampedReference<>(100, 1);
     
     // 获取当前值和版本号
     int[] stampHolder = new int[1];
     Integer initialRef = asr.get(stampHolder);
     int initialStamp = stampHolder[0];
     
     // 只有当值为 100 且版本号为 1 时，才更新为 101，并将版本号加 1
     boolean success = asr.compareAndSet(100, 101, 1, 2);
     ```

2. **循环时间长开销大**：
   - 问题描述：如果 CAS 操作长时间不成功，会导致 CPU 资源浪费
   
   - 解决方案：设置自旋次数上限，超过后使用锁或其他机制

3. **只能保证单个共享变量的原子性**：
   - 问题描述：CAS 只能保证单个共享变量操作的原子性，无法保证多个共享变量操作的原子性
   
   - 解决方案：使用 `AtomicReference` 将多个变量封装在一个对象中，或使用锁机制

## Java 8 中的增强型原子类

### LongAdder

`LongAdder` 是 Java 8 引入的增强型原子类，相比 `AtomicLong`，它通过内部分段的方式减少了线程竞争，提高了高并发环境下的性能：

```java
LongAdder counter = new LongAdder();
counter.increment();   // 加1
counter.add(5);        // 加5
long value = counter.sum();  // 获取当前值
```

内部实现原理：

1. 当竞争不激烈时，和 `AtomicLong` 类似，直接更新 base 值

2. 当竞争激烈时，会创建多个 Cell，不同线程更新不同的 Cell

3. 最终结果是所有 Cell 值和 base 值的总和

### LongAccumulator

`LongAccumulator` 是比 `LongAdder` 更加通用的累加器，允许使用自定义的累加函数：

```java
// 创建一个累加器，初始值为0，操作为求和
LongAccumulator accumulator = new LongAccumulator(Long::sum, 0);
accumulator.accumulate(5);  // 累加5
accumulator.accumulate(10); // 再累加10
long result = accumulator.get(); // 获取结果：15
```

它可以实现更复杂的原子操作，例如求最大值：

```java
// 创建一个累加器，求最大值
LongAccumulator maxAccumulator = new LongAccumulator(Long::max, Long.MIN_VALUE);
maxAccumulator.accumulate(10);
maxAccumulator.accumulate(5);
maxAccumulator.accumulate(15);
long max = maxAccumulator.get(); // 获取最大值：15
```

## 最佳实践

### 性能考量

1. **选择合适的原子类**：
   - 在低竞争环境下，`AtomicLong` 和 `AtomicInteger` 性能良好
   
   - 在高竞争环境下，使用 `LongAdder` 或 `LongAccumulator` 获得更好的性能

2. **避免过度使用**：
   - CAS 操作依然会带来一定的开销，尤其是在竞争激烈时
   
   - 在合适的场景使用原子类，不需要原子性的场景就不要使用

3. **避免长时间自旋**：
   - 设置自旋次数上限，超过后使用其他机制
   
   - 考虑使用 `java.util.concurrent.locks` 包中的锁作为备选方案

### 安全使用

1. **处理 ABA 问题**：
   - 在引用类型操作中，考虑使用带版本号的 `AtomicStampedReference`
   
   - 在只关心值是否被修改过，不关心修改次数时，可以使用 `AtomicMarkableReference`

2. **复合操作注意事项**：
   - 原子类的多个方法调用之间不保证原子性
   
   - 需要复合操作时，优先使用原子类提供的复合方法，如 `compareAndSet`

### 代码示例

#### 高并发计数器

```java
public class Counter {
    // 在低竞争环境下使用 AtomicLong
    private AtomicLong normalCounter = new AtomicLong(0);
    
    // 在高竞争环境下使用 LongAdder
    private LongAdder highConcurrencyCounter = new LongAdder();
    
    // 低竞争环境计数方法
    public void incrementNormal() {
        normalCounter.incrementAndGet();
    }
    
    // 高竞争环境计数方法
    public void incrementHighConcurrency() {
        highConcurrencyCounter.increment();
    }
    
    // 获取计数结果
    public long getNormalCount() {
        return normalCounter.get();
    }
    
    public long getHighConcurrencyCount() {
        return highConcurrencyCounter.sum();
    }
}
```

#### 安全的对象引用更新

```java
public class SafeReferenceUpdate<T> {
    private final AtomicStampedReference<T> reference;
    
    public SafeReferenceUpdate(T initialRef) {
        reference = new AtomicStampedReference<>(initialRef, 0);
    }
    
    public boolean safeUpdate(T expectedRef, T newRef) {
        int[] stampHolder = new int[1];
        T currentRef = reference.get(stampHolder);
        if (expectedRef == currentRef) {
            return reference.compareAndSet(expectedRef, newRef, 
                                          stampHolder[0], stampHolder[0] + 1);
        }
        return false;
    }
    
    public T getReference() {
        return reference.getReference();
    }
    
    public int getStamp() {
        int[] stamp = new int[1];
        reference.get(stamp);
        return stamp[0];
    }
}
```

## 常见问题

### 为什么 CAS 比 synchronized 性能更好？

CAS 操作是乐观的，不需要线程阻塞和上下文切换，而 `synchronized` 是悲观锁，需要线程阻塞和唤醒。在竞争不激烈的情况下，CAS 避免了这些开销，性能更好。

### CAS 的自旋会导致 CPU 使用率升高吗？

是的，如果 CAS 长时间失败，自旋会导致 CPU 使用率升高。在高竞争环境下，应该设置自旋次数上限，或使用 `LongAdder` 等减少竞争的替代方案。

### 如何选择合适的原子类？

- 基本类型原子操作：使用 `AtomicInteger`、`AtomicLong` 等

- 引用类型原子操作：使用 `AtomicReference`

- 防止 ABA 问题：使用 `AtomicStampedReference`

- 高并发计数：使用 `LongAdder`

- 自定义聚合操作：使用 `LongAccumulator`

### Unsafe 类为什么被称为"不安全"？

`sun.misc.Unsafe` 提供了直接访问内存、创建对象但不调用构造函数等底层操作，使用不当会导致 JVM 崩溃，因此被称为"不安全"。正常情况下，普通程序不应该直接使用 `Unsafe` 类，而是通过 JUC 包中的类间接使用它。

## 参考资料

- [Java 并发编程实战](https://www.amazon.com/Java-Concurrency-Practice-Brian-Goetz/dp/0321349601)

- [Java 并发包中 AtomicInteger 的实现原理](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/AtomicInteger.html)

- [Doug Lea: JUC 包的设计文档](http://gee.cs.oswego.edu/dl/jsr166/dist/jsr166edocs/)

- [LongAdder 和 AtomicLong 的性能对比](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/LongAdder.html)

- [JEP 193: Variable Handles](https://openjdk.java.net/jeps/193) 

