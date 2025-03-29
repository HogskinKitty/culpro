# 基础语法

## 数据类型

### 基本类型

| 类型      | 大小/范围                                | 默认值      |
|---------|--------------------------------------|----------|
| byte    | 8位 (-128 ~ 127)                      | 0        |
| short   | 16位 (-32768 ~ 32767)                 | 0        |
| int     | 32位 (-2³¹ ~ 2³¹-1)                   | 0        |
| long    | 64位 (-2⁶³ ~ 2⁶³-1)                   | 0L       |
| float   | 32位 IEEE 754 (±1.4E-45 ~ ±3.4E+38)   | 0.0f     |
| double  | 64位 IEEE 754 (±4.9E-324 ~ ±1.7E+308) | 0.0d     |
| boolean | true/false                           | false    |
| char    | 16位 Unicode (\u0000 ~ \uffff)        | '\u0000' |

```d2
PrimitiveTypesContainer: "数值型" {
  style.stroke: "#9013fe"
  IntegerTypes: "整型" {
    byte: "byte\n8位"
    short: "short\n16位"
    int: "int\n32位"
    long: "long\n64位"
  }
  FloatTypes: "浮点型" {
    style.stroke: "#4a90e2"
    float: "float\n32位"
    double: "double\n64位"
  }
}

BooleanType: "布尔型" {
  style.stroke: "#ff6f61"
  boolean: "boolean\n1位"
}

CharType: "字符型" {
  style.stroke: "#50e3c2"
  char: "char\n16位"
}
```

### 引用类型

- 类（Class）
- 接口（Interface）
- 数组 (Array)

### 自动装箱与拆箱

```d2
AutoBoxingFlow: {
  style.stroke: "#4a90e2"
  基本类型 -> 包装类: 自动装箱 (valueOf)
  包装类 -> 基本类型: 自动拆箱 (xxxValue)
  
  缓存机制: "-128~127 复用对象" {
    shape: class
  }
}
```

| 机制   | 触发场景                  | 内存分配                                           | 代码示例                                         |
|------|-----------------------|------------------------------------------------|----------------------------------------------|
| 自动装箱 | 集合泛型操作<br/>方法参数传递     | <span style="color: #4a90e2">堆内存（对象实例）</span>  | `List<Integer> list = Arrays.asList(1,2,3);` |
| 自动拆箱 | 算术运算<br/>包装类型比较       | <span style="color: #50e3c2">栈内存（基本类型值）</span> | `int sum = list.get(0) + list.get(1);`       |
| 缓存机制 | -128~127 的 Integer 创建 | <span style="color: #9013fe">方法区（缓存池）</span>   | `Integer a=127,b=127; // a==b → true`        |

<style>
.md-typeset table:not([class]) th:nth-child(4),
.md-typeset table:not([class]) td:nth-child(4) {
    width: 35%;
    min-width: 200px;
}
</style>

> [!warning]
> 拆箱陷阱：包装类对象可能为null

```java
Integer total = null;

// 运行时抛出 NullPointerException
int actual = total; 
```

#### 类型转换增强

```java
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TypeConversionTest {
    
    @Test
    void testAutomaticPromotion() {
        // 自动类型提升验证
        byte b = 100;
        short s = 32000;
        assertEquals(32100, b + s);  // byte + short → int
        
        char c = 'A';
        assertEquals(165, c + 100);   // char + int → int
    }
    
    @Test
    void testExplicitCast() {
        // 强制转换验证
        double d = 3.1415;
        assertEquals(3, (int) d);
        
        long l = Long.MAX_VALUE;
        assertEquals(-1, (int) l);    // 溢出验证
    }
    
    @Test
    void testAutoBoxingAndUnboxing() {
        // 自动装箱拆箱验证
        List<Double> doubles = new ArrayList<>();
        doubles.add(3.14);           // 自动装箱
        assertEquals(3.14, doubles.get(0), 0.001);
        
        // 缓存机制验证
        Integer a = 127;
        Integer b = 127;
        assertTrue(a == b);          // 缓存对象
        
        Integer c = 128;
        Integer d = 128;
        assertFalse(c == d);         // 非缓存对象
    }
}
```

## 变量

变量本质是命名的数据存储单元，声明语法为`类型 标识符 [= 初始值]`，局部变量必须显式初始化。

> [!tip]
> 内存分配原理
> - 基本类型：栈帧中的局部变量表（方法调用结束立即回收）
> - 对象类型：堆内存存储对象实例，栈中存储引用地址（4字节）
> - 常量池：存储字符串字面量和编译期确定的常量

Java 变量需要先声明后使用，支持基本类型和引用类型：

```java
// 变量声明示例
int count = 10;

String name = "Java";
```

### 全局变量

- 类作用域中使用`static`修饰
- 静态变量分配在方法区（元空间）
- 生命周期与类加载、卸载同步

```java
class GlobalExample {
    
    static int globalCount = 0; // 类加载时初始化
    
    void method() {
        globalCount++; // 所有实例共享
    }
}
```

### 局部变量

- 包含方法参数和方法内声明的变量
- 栈帧创建时分配内存（操作数栈）
- 方法结束时随栈帧销毁

```java
void calculate(int param) { // 参数属于局部变量
    int localVar = param * 2; // 方法内局部变量
    System.out.println(localVar);
}
```

| 变量类型 | 存储位置 | 初始化要求     | 生命周期   |
|------|------|-----------|--------|
| 全局变量 | 方法区  | 类加载时自动初始化 | 类卸载时回收 |
| 局部变量 | 栈帧   | 必须显式初始化   | 方法执行期间 |

### 变量作用域

| 作用域类型 | 范围       | 生命周期    |
|-------|----------|---------|
| 类作用域  | 整个类      | 类实例存活期间 |
| 方法作用域 | 方法内部     | 方法执行期间  |
| 块级作用域 | {}包裹的代码块 | 代码块执行期间 |

```d2
ClassScope: "类作用域" {
  MethodScope: "方法作用域" {
    BlockScope: "块级作用域" {
      style.stroke: "#4a90e2"
    }
    style.stroke: "#50e3c2"
  }
  style.stroke: "#9013fe"
}
```

## 常量

### 存储机制

```d2
MemoryLayout: {
  方法区: {
    style.stroke: "#9013fe"
    类常量池: "编译时常量\n(final 类/方法/基本类型)"
  }
  
  堆内存: {
    style.stroke: "#4a90e2"
    对象常量: "运行时常量\n(包装类型对象)"
  }
  
  栈内存: {
    style.stroke: "#50e3c2"
    局部常量: "方法局部 final 变量"
  }
}
```

| 常量类型        | 存储位置 | 生命周期    | 示例                     |
|-------------|------|---------|------------------------|
| 编译时常量       | 方法区  | 类卸载时回收  | `final class`          |
| 运行时常量对象     | 堆内存  | 随对象GC回收 | `Integer.valueOf(127)` |
| 局部 final 常量 | 栈内存  | 方法执行期间  | `final int local=5`    |

### 应用场景

```java
// 1. final类（编译时常量）
final class MathConstants {
    
    static final double PI = 3.1415926;
}

// 2. final方法参数（运行时常量）
void process(final int maxAttempts) {
    // 方法内不可修改maxAttempts
}

// 3. final局部变量（栈常量）
void calculate() {
    final int bufferSize = 1024;
    // 使用bufferSize...
}
```

### 常量类型

#### 字面常量

- 整数：`123`、`0x123`（十六进制）、`0b1010`（二进制）
- 浮点数：`3.14`、`3.14e-2`（科学计数法）
- 字符：`'A'`、`'\u0041'`（Unicode）
- 字符串：`"Hello"`、`"多行\n字符串"`
- 布尔值：`true`、`false`

#### 符号常量

- 类常量：`static final`修饰，类加载时初始化
- 对象常量：包装类型缓存（-128~127）
- 局部常量：方法内`final`变量

## 运算符

| 类型 | 运算符       |
|----|-----------|
| 算术 | + - * / % |
| 比较 | > < == != |
| 逻辑 | && \|\| ! |

### 运算符优先级（从上到下）

| 优先级 | 运算符                                | 结合性 |
|-----|------------------------------------|-----|
| 1   | () [] .                            | 左→右 |
| 2   | ! ~ ++ -- +(正) -(负)                | 右→左 |
| 3   | * / %                              | 左→右 |
| 4   | + -                                | 左→右 |
| 5   | << >> >>>                          | 左→右 |
| 6   | < <= > >= instanceof               | 左→右 |
| 7   | == !=                              | 左→右 |
| 8   | &                                  | 左→右 |
| 9   | ^                                  | 左→右 |
| 10  | \|                                 | 左→右 |
| 11  | &&                                 | 左→右 |
| 12  | \|\|                               | 左→右 |
| 13  | ?:                                 | 右→左 |
| 14  | = += -= *= /= %= &= ^= \|= <<= >>= | 右→左 |

> [!note]
> **结合性解析**：
> - **左结合**：同优先级运算符从左到右计算（如 `a + b - c` → `(a + b) - c`）
> - **右结合**：从右到左计算（如 `x = y = 5` → `x = (y = 5)`）
>
> **典型示例**：
> - 右结合：赋值运算（参考下方赋值表达式）、三目运算符（见[类型转换增强](#类型转换增强)章节示例）
> - 左结合：算术运算（参考[自动类型提升](#自动装箱与拆箱)规则）、比较运算（与[表达式分类](#表达式分类)逻辑关联）

<style>
.md-typeset table:not([class]) th:nth-child(3),
.md-typeset table:not([class]) td:nth-child(3) {
    width: 15%;
    min-width: 100px;
}
</style>

## 表达式

### 表达式分类

| 类型    | 示例               | 运算规则            |
|-------|------------------|-----------------|
| 算术表达式 | `(a + b) * c`    | 遵循运算符优先级，自动类型提升 |
| 关系表达式 | `age > 18`       | 返回boolean类型     |
| 逻辑表达式 | `flag1 && flag2` | 短路求值特性          |
| 赋值表达式 | `x = y += 5`     | 右结合性            |

### 类型转换

```d2
TypeConversion: {
  自动提升: {
    byte -> short
    short -> int
    char -> int
    int -> long
    float -> double
  }
  强制转换: {
    style.stroke-dash: 3
    大类型 -> 小类型: 强制转换 (type)value
  }
}
```

### 三目运算符规范

```java
// 类型必须兼容
int max = (a > b) ? a : b;

// 自动装箱拆箱示例
Integer result = (flag) ? 100 : Integer.valueOf(200);
```

| 转换类型 | 场景        | 示例                 |
|------|-----------|--------------------|
| 自动提升 | 二元运算      | `byte + int → int` |
| 强制转换 | 大数据类型转小类型 | `(int) 3.14 → 3`   |
| 自动装箱 | 基本↔包装类    | `Integer i = 10;`  |

## 流程控制

### 跳转控制

```java
class FlowControlTest {
    
    // break 跳出循环
    @Test
    void testBreakLabel() {
        List<Integer> loopCounter = new ArrayList<>();
        
        outer:
        for (int i : List.of(1, 2, 3)) {
            for (String j : List.of("a", "b")) {
                if (i == 2)
                    break outer;
                loopCounter.add(i);
            }
        }
        
        assertEquals(List.of(1, 1), loopCounter);
    }
    
    // continue 跳过当前循环
    @Test
    void testContinueUsage() {
        List<Integer> oddNumbers = new ArrayList<>();
        
        for (int i = 0; i < 5; i++) {
            if (i % 2 == 0)
                continue;
            oddNumbers.add(i);
        }
        
        assertEquals(List.of(1, 3), oddNumbers);
    }
    
    // return 结束当前方法
    @Test
    void testReturnVsExit() {
        class Calculator {
            
            int calculate(boolean error) {
                if (error)
                    return -1;
                return 0;
            }
        }
        
        Calculator calc = new Calculator();
        assertEquals(-1, calc.calculate(true));
        assertEquals(0, calc.calculate(false));
    }
}
```

### switch 表达式

```java
class SwitchTest {
    
    @Test
    void testTraditionalSwitch() {
        String dayType = "";
        DayOfWeek day = DayOfWeek.MONDAY;
        
        switch (day) {
            case MONDAY:
            case TUESDAY:
            case WEDNESDAY:
            case THURSDAY:
            case FRIDAY:
                dayType = "工作日";
                break;
            case SATURDAY:
            case SUNDAY:
                dayType = "周末";
                break;
            default:
                fail("Unexpected value: " + day);
        }
        
        assertEquals("工作日", dayType);
    }
}

enum DayOfWeek {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY
}
```

### 条件语句

```java
class ConditionTest {
    
    @Test
    void testIfElse() {
        String result = "";
        int score = 75;
        
        if (score >= 90) {
            result = "优秀";
        } else if (score >= 60) {
            result = "及格";
        } else {
            result = "不及格";
        }
        
        assertEquals("及格", result);
    }
}
```

### 循环结构

```java
class LoopTest {
    
    @Test
    void testForLoop() {
        List<Integer> output = new ArrayList<>();
        
        for (int i = 0; i < 5; i++) {
            output.add(i);
        }
        
        assertEquals(List.of(0, 1, 2, 3, 4), output);
    }
    
    @Test
    void testWhileLoop() {
        List<Integer> output = new ArrayList<>();
        int j = 0;
        
        while (j < 3) {
            output.add(j++);
        }
        
        assertEquals(List.of(0, 1, 2), output);
    }
}
```