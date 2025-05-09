# Java 基础

## 简介

Java 是一种广泛使用的编程语言，由 Sun Microsystems 公司于 1995 年发布，后被 Oracle 公司收购。Java 具有跨平台、面向对象、健壮性强等特点，被广泛应用于企业级应用、移动应用、嵌入式系统等场景。本文将介绍 Java 的基础语法，帮助初学者快速入门。

## 基本概念

### Java 运行机制

Java 程序的运行依赖于 JVM（Java 虚拟机），其运行流程如下：

1. 源代码（`.java` 文件）
2. 编译为字节码（`.class` 文件）
3. JVM 加载并执行字节码

正是由于 JVM 的存在，Java 实现了"一次编写，到处运行"的特性。

### JDK、JRE 与 JVM

- **JDK（Java Development Kit）**：Java 开发工具包，包含 JRE 以及开发工具（如编译器、调试器等）
- **JRE（Java Runtime Environment）**：Java 运行环境，包含 JVM 和核心类库
- **JVM（Java Virtual Machine）**：Java 虚拟机，负责执行 Java 字节码

## 开发环境搭建

### 安装 JDK

根据操作系统选择合适的 JDK 版本进行安装：

1. 访问 [Oracle 官网](https://www.oracle.com/java/technologies/downloads/) 或 [OpenJDK](https://openjdk.java.net/) 下载 JDK
2. 安装 JDK 并配置环境变量
3. 验证安装：在命令行输入 `java -version` 和 `javac -version` 查看版本信息

## 第一个 Java 程序

### Hello World

创建一个名为 `HelloWorld.java` 的文件，内容如下：

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

编译和运行：

```bash
javac HelloWorld.java
java HelloWorld
```

### 程序结构解析

- `public class HelloWorld`：定义一个公共类，类名必须与文件名一致
- `public static void main(String[] args)`：程序入口方法
- `System.out.println()`：输出语句，将内容打印到控制台

## 基本语法

### 标识符命名规则

- 由字母、数字、下划线和美元符号组成，不能以数字开头
- 不能使用关键字作为标识符
- 命名规范：
  - 类名：首字母大写，采用驼峰命名法（如 `HelloWorld`）
  - 方法名和变量名：首字母小写，采用驼峰命名法（如 `getName`）
  - 常量名：全部大写，单词间用下划线连接（如 `MAX_VALUE`）
  - 包名：全部小写（如 `java.util`）

### 数据类型

Java 的数据类型分为两大类：基本数据类型和引用数据类型。

#### 基本数据类型

| 类型 | 占用空间 | 取值范围 | 默认值 |
|------|---------|---------|-------|
| byte | 1 字节 | -128 到 127 | 0 |
| short | 2 字节 | -32768 到 32767 | 0 |
| int | 4 字节 | -2^31 到 2^31-1 | 0 |
| long | 8 字节 | -2^63 到 2^63-1 | 0L |
| float | 4 字节 | 约 ±3.4E38，精确到小数点后 6-7 位 | 0.0f |
| double | 8 字节 | 约 ±1.8E308，精确到小数点后 15-16 位 | 0.0d |
| char | 2 字节 | 0 到 65535 | '\u0000' |
| boolean | 1 位 | true 或 false | false |

#### 引用数据类型

- 类（Class）
- 接口（Interface）
- 数组（Array）

### 变量与常量

#### 变量声明与初始化

```java
// 声明变量
int age;
// 初始化变量
age = 25;
// 声明并初始化
String name = "张三";
```

#### 常量声明

```java
// 使用 final 关键字声明常量
final double PI = 3.14159;
```

### 运算符

#### 算术运算符

```java
int a = 10, b = 3;
int sum = a + b;      // 加法：13
int diff = a - b;     // 减法：7
int product = a * b;  // 乘法：30
int quotient = a / b; // 整数除法：3
int remainder = a % b; // 取余：1
```

#### 赋值运算符

```java
int x = 10;
x += 5;  // 等价于 x = x + 5
```

#### 比较运算符

```java
int m = 5, n = 8;
boolean isEqual = (m == n);    // 等于：false
boolean isNotEqual = (m != n); // 不等于：true
boolean isLess = (m < n);      // 小于：true
```

#### 逻辑运算符

```java
boolean a = true, b = false;
boolean result1 = a && b; // 逻辑与：false
boolean result2 = a || b; // 逻辑或：true
boolean result3 = !a;     // 逻辑非：false
```

#### 位运算符

```java
int x = 5;  // 二进制：0101
int y = 3;  // 二进制：0011
int z1 = x & y;  // 按位与：0001（十进制：1）
int z2 = x | y;  // 按位或：0111（十进制：7）
int z3 = x ^ y;  // 按位异或：0110（十进制：6）
int z4 = ~x;     // 按位取反：1010（十进制：-6）
int z5 = x << 1; // 左移：1010（十进制：10）
int z6 = x >> 1; // 右移：0010（十进制：2）
```

#### 三元运算符

```java
int age = 20;
String status = (age >= 18) ? "成年" : "未成年";
```

### 控制流程

#### 条件语句

##### if-else 语句

```java
int score = 85;

if (score >= 90) {
    System.out.println("优秀");
} else if (score >= 80) {
    System.out.println("良好");
} else if (score >= 60) {
    System.out.println("及格");
} else {
    System.out.println("不及格");
}
```

##### switch 语句

```java
int day = 3;
String dayName;

switch (day) {
    case 1:
        dayName = "星期一";
        break;
    case 2:
        dayName = "星期二";
        break;
    case 3:
        dayName = "星期三";
        break;
    // ...其他情况
    default:
        dayName = "无效日期";
}
```

#### 循环语句

##### for 循环

```java
// 基本 for 循环
for (int i = 0; i < 5; i++) {
    System.out.println("第 " + (i + 1) + " 次循环");
}

// 增强 for 循环（用于遍历数组或集合）
int[] numbers = {1, 2, 3, 4, 5};
for (int num : numbers) {
    System.out.println(num);
}
```

##### while 循环

```java
int i = 0;
while (i < 5) {
    System.out.println("第 " + (i + 1) + " 次循环");
    i++;
}
```

##### do-while 循环

```java
int i = 0;
do {
    System.out.println("第 " + (i + 1) + " 次循环");
    i++;
} while (i < 5);
```

#### 跳转语句

```java
// break 语句：跳出循环
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;
    }
    System.out.println(i);
}

// continue 语句：跳过当前循环的剩余部分
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue;
    }
    System.out.println(i);
}

// return 语句：从方法返回
public int add(int a, int b) {
    return a + b;
}
```

## 数组

### 数组声明与初始化

```java
// 声明数组
int[] numbers;
// 创建指定长度的数组
numbers = new int[5];

// 数组声明和创建一步完成
int[] scores = new int[3];

// 数组声明、创建和初始化一步完成
int[] points = {80, 90, 75, 88, 95};

// 二维数组
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
```

### 数组操作

```java
// 访问元素
int first = numbers[0];
numbers[1] = 100;

// 数组长度
int length = numbers.length;

// 数组遍历
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}

// 使用增强 for 循环遍历
for (int num : numbers) {
    System.out.println(num);
}

// 二维数组遍历
for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        System.out.print(matrix[i][j] + " ");
    }
    System.out.println();
}
```

### 数组工具类

Java 提供了 `Arrays` 类，包含了数组操作的常用方法：

```java
import java.util.Arrays;

// 数组排序
int[] numbers = {5, 3, 8, 1, 7};
Arrays.sort(numbers);  // 结果：{1, 3, 5, 7, 8}

// 数组填充
int[] scores = new int[5];
Arrays.fill(scores, 100);  // 结果：{100, 100, 100, 100, 100}

// 数组复制
int[] source = {1, 2, 3, 4, 5};
int[] dest = Arrays.copyOf(source, 7);  // 结果：{1, 2, 3, 4, 5, 0, 0}

// 数组比较
int[] a = {1, 2, 3};
int[] b = {1, 2, 3};
boolean isEqual = Arrays.equals(a, b);  // 结果：true

// 二分查找（要求数组已排序）
int[] sortedArray = {10, 20, 30, 40, 50};
int index = Arrays.binarySearch(sortedArray, 30);  // 结果：2
```

## 字符串

### 创建字符串

```java
// 字符串字面量
String name = "张三";

// 使用构造函数
String message = new String("Hello");

// 字符数组转字符串
char[] chars = {'J', 'a', 'v', 'a'};
String str = new String(chars);
```

### 字符串操作

```java
String s = "Hello, Java!";

// 获取长度
int length = s.length();  // 12

// 获取字符
char firstChar = s.charAt(0);  // 'H'

// 字符串连接
String s1 = "Hello";
String s2 = "World";
String s3 = s1 + ", " + s2;  // "Hello, World"
String s4 = s1.concat(", ").concat(s2);  // "Hello, World"

// 子字符串
String sub1 = s.substring(7);  // "Java!"
String sub2 = s.substring(0, 5);  // "Hello"

// 字符串查找
int index1 = s.indexOf('J');  // 7
int index2 = s.indexOf("Java");  // 7
int lastIndex = s.lastIndexOf('a');  // 10

// 字符串替换
String replaced = s.replace('l', 'L');  // "HeLLo, Java!"
String replacedAll = s.replaceAll("a", "A");  // "Hello, JAvA!"

// 字符串比较
boolean equals = s1.equals("Hello");  // true
boolean equalsIgnoreCase = "hello".equalsIgnoreCase("HELLO");  // true
int compareResult = s1.compareTo(s2);  // 负数，表示 s1 小于 s2

// 字符串转换
String upper = s.toUpperCase();  // "HELLO, JAVA!"
String lower = s.toLowerCase();  // "hello, java!"

// 去除首尾空白
String trimmed = "  Hello  ".trim();  // "Hello"

// 字符串分割
String text = "apple,banana,orange";
String[] fruits = text.split(",");  // ["apple", "banana", "orange"]

// 判断开始和结束
boolean startsWith = s.startsWith("Hello");  // true
boolean endsWith = s.endsWith("Java!");  // true

// 检查包含关系
boolean contains = s.contains("Java");  // true

// 判空检查
boolean isEmpty = "".isEmpty();  // true
boolean isBlank = "   ".isBlank();  // true (Java 11+)
```

### 字符串不变性

Java 中的字符串是不可变的，每次对字符串的修改都会创建一个新的字符串对象。对于频繁修改的场景，应使用 `StringBuilder` 或 `StringBuffer`。

```java
// 不推荐的做法
String result = "";
for (int i = 0; i < 100; i++) {
    result += i;  // 每次循环都会创建新对象
}

// 推荐的做法
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 100; i++) {
    sb.append(i);
}
String result = sb.toString();
```

### StringBuilder 和 StringBuffer

- `StringBuilder`：非线程安全，但性能较好
- `StringBuffer`：线程安全，但性能略低

```java
// StringBuilder 示例
StringBuilder sb = new StringBuilder("Hello");
sb.append(", World");
sb.insert(0, "Java: ");
sb.delete(0, 5);
sb.reverse();
String result = sb.toString();
```

## 最佳实践

1. **命名规范**：严格遵循 Java 命名规范，使代码更具可读性
2. **适当注释**：为关键代码添加注释，使他人容易理解
3. **字符串处理**：对于需要频繁修改的字符串，使用 StringBuilder
4. **异常处理**：合理使用 try-catch 处理可能出现的异常
5. **资源释放**：使用完的资源（如文件、数据库连接）及时关闭
6. **边界检查**：在访问数组元素前检查索引是否越界
7. **代码简洁**：避免冗余代码，提高代码复用率

## 常见问题

### 问题1：基本类型和包装类型的区别？

基本类型直接存储值，而包装类型是对象，可以为 null。常见的包装类型有 Integer、Boolean、Character 等。

### 问题2：String、StringBuilder 和 StringBuffer 的区别？

- String 是不可变的，每次修改都会创建新对象
- StringBuilder 是可变的，线程不安全但速度快
- StringBuffer 是可变的，线程安全但速度较慢

### 问题3：数组和列表（ArrayList）的区别？

- 数组大小固定，不能动态调整；列表大小可变
- 数组可存储基本类型和对象；列表只能存储对象
- 数组没有内置方法；列表有丰富的操作方法

## 参考资料

1. [Java 官方文档](https://docs.oracle.com/en/java/javase/17/)
2. [Java 语言规范](https://docs.oracle.com/javase/specs/index.html)
3. Effective Java (作者: Joshua Bloch)
4. Java 编程思想 (作者: Bruce Eckel) 