# Java 基础语法

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

> [!tip]包装类
> Java 为每个基本数据类型提供了对应的**包装类**，使其能作为对象使用。包装类主要用于集合、泛型等需要对象的场景。

**自动装箱与拆箱**

| 机制   | 触发场景                    | 内存分配                                           | 代码示例                                         |
|------|-------------------------|------------------------------------------------|----------------------------------------------|
| 自动装箱 | 集合泛型操作<br/>方法参数传递       | <span style="color: #4a90e2">堆内存（对象实例）</span>  | `List<Integer> list = Arrays.asList(1,2,3);` |
| 自动拆箱 | 算术运算<br/>包装类型比较         | <span style="color: #50e3c2">栈内存（基本类型值）</span> | `int sum = list.get(0) + list.get(1);`       |
| 缓存机制 | -128 ~ 127 的 Integer 创建 | <span style="color: #9013fe">方法区（缓存池）</span>   | `Integer a=127,b=127; // a==b → true`        |

<style>
.md-typeset table:not([class]) th:nth-child(4),
.md-typeset table:not([class]) td:nth-child(4) {
    width: 35%;
    min-width: 200px;
}
</style>

```d2
AutoBoxingFlow: {
  style.stroke: "#4a90e2"
  基本类型 -> 包装类: 自动装箱 (valueOf) {
    style: {
      stroke-width: 2
      animated: true
    }
  }
  包装类 -> 基本类型: 自动拆箱 (xxxValue) {
    style: {
      stroke-width: 2
      animated: true
    }
  }
  
  缓存机制: "-128~127 复用对象" {
    shape: class
  }
}
```

> [!warning]注意
> 拆箱陷阱：包装类对象可能为null

```java
Integer total = null;

// 运行时抛出 NullPointerException
int actual = total; 
```

**类型转换增强**

```java
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

### 引用类型

- 类（Class）
- 接口（Interface）
- 数组 (Array)
- 枚举（Enum）

## 变量

变量本质是命名的数据存储单元，声明语法为`类型 标识符 [= 初始值]`。

> [!tip]内存分配原理
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

常量是在程序运行期间不可改变的值。

| 常量类型        | 存储位置 | 生命周期      | 示例                     |
|-------------|------|-----------|------------------------|
| 编译时常量       | 方法区  | 类卸载时回收    | `final class`          |
| 运行时常量对象     | 堆内存  | 随对象 GC 回收 | `Integer.valueOf(127)` |
| 局部 final 常量 | 栈内存  | 方法执行期间    | `final int local = 5`  |

```d2
MemoryLayout: 内存布局 {
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

**应用场景**

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
- 对象常量：包装类型缓存（-128 ~ 127）
- 局部常量：方法内`final`变量

## 运算符

Java 中运算符按功能分类：

### 算术运算符

- **基本运算**

  `+`（加）、`-`（减）、`*`（乘）、`/`（除）、`%`（取模）
  ```java
  int a = 10 / 3; // 3（整数除法）
  double b = 10 % 3; // 1.0（取余）
  ```

- **自增/自减**

  `++`（自增）、`--`（自减）
  ```java
  int i = 5;
  int j = i++; // j=5, i=6（后缀：先赋值后自增）
  int k = ++i; // k=7, i=7（前缀：先自增后赋值）
  ```

### 关系运算符

- 比较两个值的关系，返回 `boolean` 类型（`true`/`false`）

  `==`（等于）、`!=`（不等于）、`>`（大于）、`<`（小于）、`>=`（大于等于）、`<=`（小于等于）
  ```java
  boolean result = (10 > 5); // true
  ```

### 逻辑运算符

- **基本逻辑运算**

  `&&`（逻辑与）、`||`（逻辑或）、`!`（逻辑非）
  ```java
  boolean res = (true && false); // false
  ```

- **短路特性**

  `&&` 和 `||` 会短路：若左侧可确定结果，右侧不执行
  ```java
  if (a != null && a.getValue() > 0) { ... } // 避免空指针
  ```

- **非短路逻辑**

  `&`（按位与）、`|`（按位或）：两侧都会执行
  ```java
  boolean b = (a() & b()); // 无论 a() 结果如何，b() 都会执行
  ```

### 位运算符

- 直接操作二进制位补码，适用于整数类型（int, long 等）

  `&`（按位与）、`|`（按位或）、`^`（按位异或）、`~`（按位取反）
  ```java
  int x = 5 & 3; // 0101 & 0011 = 0001 → 1
  ```

- **移位运算符**

  `<<`（左移）、`>>`（带符号右移）、`>>>`（无符号右移）
  ```java
  int a = 8 << 1; // 16（左移1位，相当于乘2）

  int b = -8 >> 1; // -4（保留符号位）
  
  int c = -8 >>> 1; // 2147483644（高位补0）
  ```

### 赋值运算符

- **基本赋值**

  `=`（赋值）
  ```java
  int num = 10;
  ```

- **复合赋值**

  `+=`、`-=`、`*=`、`/=`、`%=`、`<<=`、`>>=` 等
  ```java
  num += 5; // 等价于 num = num + 5;
  ```

### 条件运算符（三元运算符或三元运算符）

- 语法：`条件 ? 表达式1 : 表达式2`

  若条件为 `true`，返回`表达式1`的值，否则返回`表达式2`的值
  ```java
  int max = (a > b) ? a : b; // 取较大值
  ```

### 类型检查运算符

- `instanceof`

  判断对象是否属于某个类（或接口）的实例
  ```java
  String str = "hello";
  boolean isString = str instanceof String; // true
  ```

### 其他运算符

- **字符串连接符** `+`

  拼接字符串（若操作数为非字符串类型，会自动转换）
  ```java
  String s = "num: " + 5 + 10; // "num: 510"
  ```

### 运算符优先级（从高到低）

| 优先级 | 运算符                                       |
|-----|-------------------------------------------|
| 最高  | `()`、`[]`、`.`（方法调用、属性访问）                  |
| ↓   | `!`、`~`、`++`、`--`（单目运算）                   |
| ↓   | `*`、`/`、`%`                               |
| ↓   | `+`、`-`                                   |
| ↓   | `<<`、`>>`、`>>>`                           |
| ↓   | `>`、`>=`、`<`、`<=`、`instanceof`            |
| ↓   | `==`、`!=`                                 |
| ↓   | `&`、`^`、`                       \|`       |
| ↓   | `&&`、`                              \|\|` |
| ↓   | `?:`（三元运算符）                               |
| 最低  | `=`、`+=`、`-=` 等赋值运算符                      |

> [!warning]注意事项
>
> 1. **整数除法**：`10 / 3` 结果为 `3`，若需小数结果，需强制类型转换。
> 2. **逻辑短路**：利用 `&&` 和 `||` 避免不必要的计算或异常。
> 3. **字符串拼接**：`+` 可能导致非预期结果，建议使用 `StringBuilder` 或括号控制优先级。

## 流程控制

### 顺序结构

程序中最简单最基本的流程控制，没有特定的语法结构，按照代码的先后顺序，依次执行。

### 选择结构

- **if 语句**
```java
// 单分支结构
if (布尔表达式) {
    // 条件为真时执行
}

// 双分支结构
if (布尔表达式) {
    // 条件为真时执行
} else {
    // 条件为假时执行
}

// 多分支结构
if (布尔表达式1) {
    // 条件1为真时执行
} else if (布尔表达式2) {
    // 条件2为真时执行
} else {
    // 所有条件都为假时执行
}
```

- **switch 语句**
```java
switch (表达式) {
  case 值1: 
      // 匹配值1时执行
      break; // 跳出 switch
  case 值2:
  case 值3: // 多条件匹配
      // 匹配值2或值3时执行
      break;
  default: 
      // 所有case都不匹配时执行
}
```

**基础用法示例**
```java
class SelectionExample {
    
    @Test
    void testIfStatement() {
        int score = 85;
        String result = "";
        
        // 多条件判断
        if (score >= 90) {
            result = "优秀";
        } else if (score >= 75) {
            result = "良好";
        } else if (score >= 60) {
            result = "及格";
        } else {
            result = "需努力";
        }
        
        assertEquals("良好", result);
    }

    @Test
    void testSwitchAdvanced() {
        String day = "MONDAY";
        int workHours = 0;
        
        switch (day) {
            case "MONDAY":
            case "TUESDAY":
            case "WEDNESDAY":
                workHours = 8;
                break;
            case "THURSDAY":
                workHours = 6; // 周四半天
                break;
            case "FRIDAY":
                workHours = 4; // 周五弹性
                break;
            default:
                workHours = 0; // 周末休息
        }
        
        assertTrue(workHours > 4);
    }
}
```

**枚举类型匹配**
```java
enum UserRole { ADMIN, EDITOR, GUEST }

class RoleCheckTest {
    
    @Test
    void testEnumSwitch() {
        UserRole role = UserRole.ADMIN;
        String permissions = "";
        
        switch (role) {
            case ADMIN:
                permissions = "所有权限";
                break;
            case EDITOR:
                permissions = "编辑权限";
                break;
            case GUEST:
                permissions = "只读权限";
                break;
        }
        
        assertEquals("所有权限", permissions);
    }
}
```

> [!tip]最佳实践
> 1. 总是添加`default`分支处理未预见值
> 2. 使用`break`避免case穿透
> 3. 优先使用枚举替代字符串匹配
> 4. 复杂逻辑建议改用多态实现

### 循环结构

- **while 循环**
```java
while (布尔表达式) {
    // 循环体
}
```
- **do-while 循环**
```java
do {
    // 循环体
} while (布尔表达式);
```
- **for 循环**
```java
// 基本语法
for (初始化; 布尔表达式; 更新) {
    // 循环体
}

// 示例：打印1到5
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}

// 增强 for 循环
for (元素类型 变量名 : 数组或集合(即 Iterable 的实例)) {
    // 循环体
} 

// 示例：遍历数组
int[] numbers = {1, 2, 3, 4, 5};
for (int num : numbers) {
    System.out.println(num);
}
```

### 控制跳转语句

- **break**：终止当前循环或 switch 语句
- **continue**：跳过当前循环，继续下一次循环
- **return**：结束当前方法，返回值（可选）